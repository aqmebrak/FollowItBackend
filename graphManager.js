var Graph = require("graphlib").Graph;   //graph lib
var write = require("graphlib").json.write;
var read = require("graphlib").json.read;
var alg = require("graphlib").alg;
var fs = require('fs');
var database = require("./database.js");

//GRAPH LIB OBJECT
var gr;
//GRAPH JSON OBJECT
var graphe;

var POIList = [];
var BeaconList = [];

/***
 *
 * EXPORTS FUNCTIONS
 */

module.exports = {
    constructGraph: function (callback) {
        database.getGraphDocument(function (result) {
            console.log("GET GRAPH:");
            console.log("--------------------");
            var json = {};
            json.options = result[0].options;
            json.nodes = result[0].nodes;
            json.edges = result[0].edges;
            graphe = json;

            //on ajoute la partie Temp
            database.getTempDocument(function (result) {
                graphe.temp = result[0].temp;
                console.log(JSON.stringify(graphe));
            });
            //on genere la graphe pour la LIB
            gr = read(json);
            console.log(JSON.stringify(gr));
            callback(gr);
        });
    },

    getGraph: function () {
        return graphe;
    },

    constructPOIList: function () {
        generatePOI();
    },

    findPath: function (source, destination) {
        var map = alg.dijkstra(gr, source, weight);
        console.log("MAP ==>");
        console.log(map);
        console.log(gr.edge('a', 'b'));
        console.log(gr.edge('b', 'a'));
        var nodeArray = findBestPath(map, source, destination);
        console.log("nodeArray");
        console.log(nodeArray);
        nodeArray = constructNavigation(nodeArray);
        return nodeArray;
    },

    updateGraph: function (newJson, callback) {

        console.log("updateGraphh");
        //console.log(newJson);
        graphe = {}
        graphe.options = newJson.options;
        graphe.nodes = newJson.nodes;
        graphe.edges = newJson.edges;
        var temp = {};
        temp.temp = newJson.temp;

        database.updateGraphDocument(graphe, function (result) {
            database.updateTempDocument(temp, function (result) {
                console.log("-------------------------");
                gr = read(newJson);
                console.log("gr:");
                generatePOI();
            });
        });
        graphe.temp = temp.temp;
        console.log("-------------------------");
        console.log(graphe);
        callback('done');
    },

    getAllPOI: function () {
        return POIList;
    },

    //renvoie toute la liste des beacons
    getAllBeacons: function (callback) {

        database.getBeaconDocuments(function (result) {
            callback(result);
        })
    },

    //recupere le noeud du beacon recherché
    getAllNodes: function () {
        return graphe.nodes;
    },

    updateBeaconList: function (beaconArray, callback) {
        database.updateBeaconDocuments(beaconArray, function (result) {
            callback('done');
        });
    }

    //tODO: ajouter addPromo, qui supprimera la promo du magasin en question pour la remplacer pâr la nouvelle
};


var generatePOI = function () {
    var nodeList = gr.nodes();
    POIList = [];
    for (var n in nodeList) {
        var label = gr.node(nodeList[n]);
        for (var i in label.POI) {
            POIList.push({poi: label.POI[i], node: nodeList[n]});
        }
    }
    console.log("POI")
    //console.log(POIList);
};


var findBestPath = function (map, source, destination) {

    //on prend le noeud darrivee et on reconstruit le chemin en prenant les predecesseurs successifs
    //tableau des noeuds successifs a parcourir
    var bestPath = [];
    var reachedSource = false;
    var lastNode;

    //on met la destination en premier
    bestPath.push(destination);
    lastNode = destination;
    var cpt = 0;

    //puis on prend le predecesseur, on push dans l'Array (duku) et on s'arrete quand on tombe sur la source
    while (!reachedSource) {
        console.log(cpt);

        //si le predecesseur est le noeud de fin, on l'ajoute et on arrete
        if (lastNode == source) {
            console.log("if");
            reachedSource = true;
        }//sinon, on l'ajoute au tableau et on le garde en clé "lastNode" pour la prochaine iteration
        else {
            console.log("lastnode" + map[lastNode].predecessor);
            console.log("lastnode predecessor:" + map[lastNode].predecessor);
            bestPath.push(map[lastNode].predecessor);
            lastNode = map[lastNode].predecessor;
            cpt++;
        }
    }
    bestPath.reverse();
    console.log("BestPAth");
    console.log(bestPath);
    console.log("-----------------------\n");

    return bestPath;
};

function weight(e) {
    return gr.edge(e).weight;
}


function constructNavigation(nodeArray) {
    //construction de l'objet de base
    for (i in nodeArray) {
        nodeArray[i] = {
            node: "" + nodeArray[i],
            POIList: gr.node(nodeArray[i]).POI,
            instruction: ""
        };
        nodeArray[i].coord = {x: gr.node(nodeArray[i].node).coord.x, y: gr.node(nodeArray[i].node).coord.y};
        //if le noeud a un beacon
        if (gr.node(nodeArray[i].node).hasOwnProperty("beacon")) {
            console.log("true");
            nodeArray[i].beacon = gr.node(nodeArray[i].node).beacon;
        }
    }

    //generation des instructions
    //je parcours le tableau
    // du noeud n au noeud n+1, je regarde les coordonnées

    for (var i = 0; i < nodeArray.length - 2; i++) {

        //ETAPE 1 : Je calcule les coord des vecteurs
        //  AB
        console.log("/////");
        //console.log(gr.node(nodeArray[i].node));
        //console.log(gr.node(nodeArray[i + 1].node));
        //console.log(gr.node(nodeArray[i + 2].node));
        console.log("/////\n");

        var depX = gr.node(nodeArray[i].node).coord.x;
        var depY = gr.node(nodeArray[i].node).coord.y;

        var intermX = gr.node(nodeArray[i + 1].node).coord.x;
        var intermY = gr.node(nodeArray[i + 1].node).coord.y;

        var arrX = gr.node(nodeArray[i + 2].node).coord.x;
        var arrY = gr.node(nodeArray[i + 2].node).coord.y;

        var v1 = {
            x: intermX - depX,
            y: intermY - depY
        };

        // BC
        var v2 = {
            x: arrX - intermX,
            y: arrY - intermY
        };
        console.log("/////");
        console.log(v1);
        console.log(v2);
        console.log("/////");

        //ETAPE 2: Je calcule ||v1|| et ||v2|| et v1*v2
        var produit_vecteur = (v1.x * v2.x ) + ( v1.y * v2.y );
        var norme_v1 = Math.sqrt((v1.x * v1.x) + (v1.y * v1.y));
        var norme_v2 = Math.sqrt((v2.x * v2.x) + (v2.y * v2.y));

        //ETAPE 3: Je calcule O = cos-1(||v1|| / ||v2||)
        var angle = produit_vecteur / (norme_v1 * norme_v2);
        console.log(angle);
        var aAngle = Math.acos(angle);
        console.log("ARCOS");
        console.log(aAngle);
        var aAngleDegr = aAngle / (Math.PI / 180);
        console.log("ANGLE DEGRE " + aAngleDegr);

        var prod = (v1.x * v2.y ) - ( v1.y * v2.x );

        if (aAngleDegr < 45) {
            console.log("haut");
            nodeArray[i + 1].instruction = "A l'intersection, allez tout droit";
        } else if (aAngleDegr > 135) {
            console.log("bas");
            nodeArray[i + 1].instruction = "A l'intersection, faites demi-tour";
        } else if (prod < 0) {
            console.log("gauche");
            nodeArray[i + 1].instruction = "A l'intersection, tournez à gauche";

        } else {
            console.log("droite");
            nodeArray[i + 1].instruction = "A l'intersection, tournez à droite";
        }
    }

//console.log(nodeArray);
    console.log("-----------------------\n");
}


function constructNavigationZ(nodeArray) {
    //construction de l'objet de base
    for (i in nodeArray) {
        nodeArray[i] = {
            node: "" + nodeArray[i],
            POIList: gr.node(nodeArray[i]).POI,
            instruction: ""
        };
        nodeArray[i].coord = {x: gr.node(nodeArray[i].node).coord.x, y: gr.node(nodeArray[i].node).coord.y};
        //if le noeud a un beacon
        if (gr.node(nodeArray[i].node).hasOwnProperty("beacon")) {
            console.log("true");
            nodeArray[i].beacon = gr.node(nodeArray[i].node).beacon;
        }
    }

    //generation des instructions
    for (var i = 0; i < nodeArray.length - 2; i++) {

        //ETAPE 1 : Je calcule les coord des vecteurs
        //  AB
        //console.log("/////");
        // console.log(gr.node(nodeArray[i].node));
        //console.log(gr.node(nodeArray[i + 1].node));
        //console.log(gr.node(nodeArray[i + 2].node));
        //console.log("/////\n");
        var v1 = {
            x: gr.node(nodeArray[i + 1].node).coord.x - gr.node(nodeArray[i].node).coord.x,
            y: gr.node(nodeArray[i + 1].node).coord.y - gr.node(nodeArray[i].node).coord.y
        };

        // BC
        var v2 = {
            x: gr.node(nodeArray[i + 2].node).coord.x - gr.node(nodeArray[i + 1].node).coord.x,
            y: gr.node(nodeArray[i + 2].node).coord.y - gr.node(nodeArray[i + 1].node).coord.y
        };
        //console.log("/////");
        //console.log(v1);
        //console.log(v2);
        //console.log("/////");


        var norme_v1 = Math.sqrt((v1.x * v1.x) + (v1.y * v1.y));
        var norme_v2 = Math.sqrt((v2.x * v2.x) + (v2.y * v2.y));


        //ETAPE 2: Je calcule ||v1|| et ||v2|| et v1*v2
        var prod = (v1.x * v2.y ) - ( v1.y * v2.x );
        console.log(prod);
        //ETAPE 4: 180 - resultat
        if (prod < 0) {
            console.log("gauche");
            nodeArray[i + 1].instruction = "A l'intersection, tournez à gauche";
        } else if (prod > 0) {
            console.log("droite");
            nodeArray[i + 1].instruction = "A l'intersection, tournez à droite";
        } else {
            console.log("TOUT DROIT");
            nodeArray[i + 1].instruction = "A l'intersection, continuez tout droit";

        }
        //ETAPE 5: Si < 180 ==> gauche Sinon ==> droite
        console.log("-----------------------\n");

    }
    console.log(nodeArray);
    console.log("-----------------------\n");
    return nodeArray;
}