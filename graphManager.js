var Graph = require("graphlib").Graph;   //graph lib
var write = require("graphlib").json.write;
var read = require("graphlib").json.read;
var alg = require("graphlib").alg;
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
        nodeArray = constructNavigation(nodeArray);
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

    console.log(bestPath);
    return bestPath;
};

function weight(e) {
    return gr.edge(e).weight;
}


function constructNavigation(nodeArray) {
    //construction de l'objet de base
    for (i in nodeArray) {
        nodeArray[i] = {node: "" + nodeArray[i], "POIList": gr.node(nodeArray[i])['POI'] , "instruction":""}
        //if le noeud a un beacon
    }

    //generation des instructions

    //je parcours le tableau
    // du noeud n au noeud n+1, je regarde les coordonnées
    //si X2 - X1 > 0 et Y2 - Y1 == 0 ==>
    //si X2 - X1 < 0 et Y2 - Y1 == 0 ==>
    //si Y2 - Y1 > 0 et X2 - X1 == 0 ==>
    //si Y2 - Y1 < 0 et X2 - X1 == 0 ==>

    console.log(nodeArray);
}