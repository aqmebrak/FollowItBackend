var Graph = require("graphlib").Graph;   //graph lib
var write = require("graphlib").json.write;
var read = require("graphlib").json.read;
var alg = require("graphlib").alg;
var gr;

module.exports = {
    constructGraph: function () {
        var jsonFile = require("../content/graph.json");
        jsonFile = JSON.stringify(jsonFile);
        gr = read(JSON.parse(jsonFile));
        console.log(gr.nodes());
        console.log(gr.edges());
    },

    findPath: function (source, destination) {
        var map = alg.dijkstra(gr, source);
        console.log(map);
        return findBestPath(map, source, destination);
    }
};

var findBestPath = function (map, source, destination) {

    //on prend le noeud darrivee et on reconstruit le chemin en prenant les predecesseurs successifs

    //tableau des noeuds successifs a parcourir
    var bestPath = [];
    var reachedSource = false;
    var i = 0;

    do {
        console.log(map[i]);
        if (map[i] == map[destination])
            reachedSource = true;
    } while (reachedSource);


    return bestPath;
};

var findPredecessor = function (map, node) {

};