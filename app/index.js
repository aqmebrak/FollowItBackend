// server.js

// PACKAGES
// ===============================================================================
var express = require("express");        // call express
var app = express();                 // define our app using express
var bodyParser = require("body-parser");   //json
var jsonFile = require("../content/graph.json");
var graphManager = require("./graphManager.js");

graphManager.constructGraph(jsonFile);

// ROUTING CONFIG
// =============================================================================
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    console.log(req.body);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

// more routes for our API will happen here
// on routes that end in /bears
// ----------------------------------------------------
router.route('/path')
// demande le chemin en envoyant noeuds de depart et arrivee param: body.D , body.A
// renvoie la liste en json des chemins
// (accessed at POST http://localhost:8080/api/path)
    .post(function (req, res) {
        console.log("POST==>path");
        res.send();
    });

//permet de demander une nouvelle version du graphe
//sera appelé à chaque demarrage de l'appli
router.route('/updateGraph')
    .get(function (req, res) {


    });
// Register our routes : all of our routes will be prefixed with /api
app.use('/api', router);
// =============================================================================

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);