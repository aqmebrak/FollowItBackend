// PACKAGES
// ===============================================================================
var express = require("express");
var app = express();        // call express
var server = require('http').Server(app);
var io = require('socket.io')(server); // define our app using express
var bodyParser = require("body-parser");   //json
var graphManager = require("./graphManager.js");

graphManager.constructGraph();
graphManager.constructShopList();


io.on('connection', function (socket) {
    console.log('A user is connected');
	
	/**
	* ASKING PATH
	*/    
	socket.on('askPath', function (json) {
        console.log(json);
        console.log("SOCKET==>path");
        var map = graphManager.findPath(json.source, json.destination);
        socket.emit('path', {
            map: map
        });
        // // echo globally (all clients) that a person has connected
        // socket.broadcast.emit('user joined', {
        //     username: socket.username,
        //     numUsers: 'broadcast'
        // });
    });

    /**
     * SHOP LIST
     */
    socket.on('getShops', function () {
        console.log("SOCKET: getShops");
        //console.log(json);

        var shops = graphManager.getShopList();
        socket.emit('shopList', {
            shops: shops
        });
    });

	/**
	* DISCONNECTING
	*/    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

// console.log("FINDPATH");
// var map = graphManager.findPath("a", "f");
// console.log(map);

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


// more routes for our API will happen here
// on routes that end in /bears
// ----------------------------------------------------
router.route('/graph')
// demande le chemin en envoyant noeuds de depart et arrivee param: body.D , body.A
// renvoie la liste en json des chemins
// (accessed at POST http://localhost:8080/api/path)
    .post(function (req, res) {
        console.log("POST==>path");
        var map = graphManager.findPath(req.body.source, req.body.destination);
        res.send(map);
    })
	
	/**
	* ASKING GRAPH
	*/
    .get(function (req, res) {
        console.log("REST: getGraph");
        var jsonFile = require("./public/content/graph.json");
        jsonFile = JSON.stringify(jsonFile);
        res.send(jsonFile);
    });


// Register our routes : all of our routes will be prefixed with /api
app.use('/api', router);
// =============================================================================

// START THE SERVER
// =============================================================================
server.listen(port);
console.log('Magic happens on port ' + port);