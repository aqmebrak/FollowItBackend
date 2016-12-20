var graphLib = require("graphlib").Graph;   //graph lib

module.exports = {
    constructGraph: function (jsonFile) {
        var g2 = graphLib.json.read(JSON.parse(jsonFile));
        console.log(g2.nodes());
        console.log(g2.edges());
        graphLib.json.
    }
};