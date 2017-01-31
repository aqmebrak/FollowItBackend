// PACKAGES
// ===============================================================================
var express = require("express");
var app = express();        // call express
var server = require('http').Server(app);
var io = require('socket.io')(server); // define our app using express
var bodyParser = require("body-parser");   //json
var graphManager = require("./graphManager.js");
var fs = require('fs');
var cors = require('cors');

graphManager.constructGraph(function () {
	graphManager.constructPOIList();
});

/****************
 * SOCKET
 **************/

io.on('connection', function (socket) {
	console.log('A user is connected');
	/**
	 * DEmande le chemin
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
	 * Renvoie la liste des POints of interest du graphe
	 */
	socket.on('getPOI', function () {
		console.log("SOCKET: getPOI");

		socket.emit('POIList', {
			poi: graphManager.getAllPOI()
		});
	});

	/**
	 * Renvoie tous les beacons
	 */
	socket.on('getAllBeacons', function () {
		console.log("SOCKET: getAllBeacons");

		graphManager.getAllBeacons(function (array) {
			socket.emit('beaconList', {
				beaconArray: array
			});
		});
	});

	/**
	 * Renvoie tous les noeuds du graphe
	 */
	socket.on('getAllNodes', function () {
		console.log("SOCKET: getAllNodes: ");

		socket.emit('nodeList', {
			nodes: graphManager.getAllNodes()
		});
	});


	/**
	 * Renvoie la promotion du magasin associé
	 */
	socket.on('getPOIDiscount', function (poi) {
		console.log("SOCKET: getPOIDiscount: ");

		graphManager.getPOIDiscount(poi, function (discount) {
			socket.emit('POIDiscount', {
				discount: discount
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
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

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

/**
 DEMANDE CHEMIN
 **/
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

/**
 * Met a jour le graphe
 */
router.route('/updateGraph')
	.post(function (req, res) {
		console.log("updating Graph");
		console.log(req.body);
		graphManager.updateGraph(req.body, function (value) {
			res.send(value);
			broadcastToAll(req.body);
		});
	});

/**
 * Recupere tous les BEACONS existants
 **/
router.route('/getAllBeacons')
	.get(function (req, res) {
		console.log("get Beacon List");
		graphManager.getAllBeacons(function (array) {
			res.send(array);
		});
	});


/**
 * Recupere tous les NODES existants
 **/
router.route('/getAllNodes')
	.get(function (req, res) {
		console.log("get Nodes List");
		res.send(graphManager.getAllNodes());
	});

/**
 * Recupere tous les POI existants
 **/
router.route('/getAllPOI')
	.get(function (req, res) {
		console.log("get Nodes List");
		res.send(graphManager.getAllPOI());
	});

/**
 * Met a jour les beacons
 */
router.route('/updateBeacons')
	.post(function (req, res) {
		console.log("updating Beacon List");
		graphManager.updateBeaconList(req.body, function (value) {
			res.send(value);
		});
	});

/*******************
 * BROADCAST TO ALL USERS
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