// PACKAGES
// ===============================================================================
var express = require("express");
var app = express();        // call express
var server = require('http').Server(app);
var io = require('socket.io')(server); // define our app using express
var bodyParser = require("body-parser");   //json
var graphManager = require("./graphManager.js");
var fs = require('fs');

graphManager.constructGraph(function () {
    graphManager.constructPOIList();
});

/****************
 * SOCKET
 **************/

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
    });

    /**
     * POI LIST
     */
    socket.on('getPOI', function () {
        console.log("SOCKET: getPOI");

        graphManager.getAllPOI(function (poi) {
            console.log(poi);
            socket.emit('POIList', {
                poi: poi
            });
        });
    });

    socket.on('getBeaconArray', function () {
        console.log("SOCKET: getBeaconArray");

        graphManager.getAllBeacons(function (array) {
            socket.emit('beaconArray', {
                beaconArray: array
            });
        });
    });

    socket.on('getAllNodes', function () {
        console.log("SOCKET: getAllNodes: ");

        graphManager.getAllNodes(function (nodes) {
            socket.emit('allNodes', {
                nodes: nodes
            });
        });
    });

    /**
     * DISCONNECTING
     */
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});


/********************
 * ROUTING CONFIG ***
 ********************/
// =============================================================================
// configure app to use bodyParser()
// this will let us get the data from a POST
app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //console.log(req.body);
    next();
});


// ----------------------------------------------------
router.route('/graph')
// demande le chemin
// (accessed at POST http://localhost:8080/api/path)
    .post(function (req, res) {
        console.log("POST==>path");
        var map = graphManager.findPath(req.body.source, req.body.destination);
        res.send(map);
    })

    /**
     * Renvoie GRAPH
     */
    .get(function (req, res) {
        console.log("REST: getGraph");
        res.send(graphManager.getGraph());
    });

router.route('/updateGraph')
    .post(function (req, res) {
        console.log("updating Graph");
        console.log(req.body);
        graphManager.updateGraph(req.body, function (value) {
            res.send(value);
            broadcastToAll(req.body);
        });
    });

router.route('/getAllBeacons')
    .get(function (req, res) {
        console.log("get Beacon List");
        graphManager.getAllBeacons(function (array) {
            res.send(array);
        });
    });

router.route('/updateBeacons')
    .post(function (req, res) {
        console.log("updating Beacon List");
        graphManager.updateBeaconList(req.body, function (value) {
            res.send(value);
        });
    });

/*******************
 * FUNCTIONS *******
 ******************/
var broadcastToAll = function (graph) {
    console.log("emitting notification: ");
    console.log(graph);
    console.log("---------------------\n");
    io.sockets.emit('notif', graph);
};

// Register our routes : all of our routes will be prefixed with /api
app.use('/api', router);
// =============================================================================

// START THE SERVER
// =============================================================================
server.listen(port);
console.log('Magic happens on port ' + port);