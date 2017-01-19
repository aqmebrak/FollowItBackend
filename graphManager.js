var Graph = require("graphlib").Graph;   //graph lib
var write = require("graphlib").json.write;
var read = require("graphlib").json.read;
var alg = require("graphlib").alg;
var fs = require('fs');
//JSON FILE OBJECT
var gr;

var POIList = [];


module.exports = {
    constructGraph: function () {
        var jsonFile = require("./public/content/graph.json");
        jsonFile = JSON.stringify(jsonFile);
        gr = read(JSON.parse(jsonFile));
        //console.log(gr.nodes());
        //console.log(gr.edges());
    },

    findPath: function (source, destination) {
        var map = alg.dijkstra(gr, source, weight);
        console.log(map);
        var nodeArray = findBestPath(map, source, destination);
        nodeArray = constructNavigationZ(nodeArray);
        return nodeArray;
    },

    constructPOIList: function () {
        var nodeList = gr.nodes();

        for (var n in nodeList) {
            var label = gr.node(nodeList[n]);
            for (var i in label.poi) {
                POIList.push(label.poi[i]);
            }
        }
        console.log(POIList);
    },

    getPOIList: function () {
        return POIList;
    },

    updateGraph: function (newJson) {
        //write in JSON
        fs.writeFile("./public/content/graph.json", newJson);

        //refresh variable
        var jsonFile = require("./public/content/graph.json");
        jsonFile = JSON.stringify(jsonFile);
        gr = read(JSON.parse(jsonFile));
    }
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
        nodeArray[i] = {node: "" + nodeArray[i], "POIList": gr.node(nodeArray[i])['POI'], "instruction": ""};
        //if le noeud a un beacon
    }

    //generation des instructions

    //je parcours le tableau
    // du noeud n au noeud n+1, je regarde les coordonnées

    for (var i = 0; i < nodeArray.length - 2; i++) {
        //TODO: Cas du premier chemin ??????????

        //ETAPE 1 : Je calcule les coord des vecteurs
        //  AB
        console.log("/////");
        console.log(gr.node(nodeArray[i].node));
        console.log(gr.node(nodeArray[i + 1].node));
        console.log(gr.node(nodeArray[i + 2].node));
        console.log("/////\n");
        var v1 = {
            x: gr.node(nodeArray[i + 1].node).coord.x - gr.node(nodeArray[i].node).coord.x,
            y: gr.node(nodeArray[i + 1].node).coord.y - gr.node(nodeArray[i].node).coord.y
        };

        // BC
        var v2 = {
            x: gr.node(nodeArray[i + 2].node).coord.x - gr.node(nodeArray[i + 1].node).coord.x,
            y: gr.node(nodeArray[i + 2].node).coord.y - gr.node(nodeArray[i + 1].node).coord.y
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
        var angle = Math.cos(produit_vecteur / (norme_v1 * norme_v2));
        console.log(Math.acos(angle));
        angle = Math.acos(angle);
        //ETAPE 4: 180 - resultat
        if (angle < Math.PI && angle > 0) {
            console.log("gauche");
        } else if (angle > -Math.PI && angle < 0) {
            console.log("droite");
        } else {
            console.log("ERROR CALCULATING ARCCOSINUS");
            return null;
        }
        //ETAPE 5: Si < 180 ==> gauche Sinon ==> droite
        console.log("-----------------------\n");

    }
    //console.log(nodeArray);
    console.log("-----------------------\n");
}


function constructNavigationZ(nodeArray) {
    //construction de l'objet de base
    for (i in nodeArray) {
        nodeArray[i] = {node: "" + nodeArray[i], POIList: gr.node(nodeArray[i]).POI, instruction: ""};
        //if le noeud a un beacon
    }

    //generation des instructions
    for (var i = 0; i < nodeArray.length - 2; i++) {

        //ETAPE 1 : Je calcule les coord des vecteurs
        //  AB
        console.log("/////");
        console.log(gr.node(nodeArray[i].node));
        console.log(gr.node(nodeArray[i + 1].node));
        console.log(gr.node(nodeArray[i + 2].node));
        console.log("/////\n");
        var v1 = {
            x: gr.node(nodeArray[i + 1].node).coord.x - gr.node(nodeArray[i].node).coord.x,
            y: gr.node(nodeArray[i + 1].node).coord.y - gr.node(nodeArray[i].node).coord.y
        };

        // BC
        var v2 = {
            x: gr.node(nodeArray[i + 2].node).coord.x - gr.node(nodeArray[i + 1].node).coord.x,
            y: gr.node(nodeArray[i + 2].node).coord.y - gr.node(nodeArray[i + 1].node).coord.y
        };
        console.log("/////");
        console.log(v1);
        console.log(v2);
        console.log("/////");

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