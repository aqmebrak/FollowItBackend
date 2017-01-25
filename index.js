// PACKAGES
// ===============================================================================
var express = require("express");
var app = express();        // call express
var server = require('http').Server(app);
var io = require('socket.io')(server); // define our app using express
var bodyParser = require("body-parser");   //json
var graphManager = require("./graphManager.js");
var fs = require('fs');

graphManager.constructGraph();
graphManager.constructPOIList();
//var b = '{"beacons": [{"name": "premier beacon","UUID": "dfhbdfhdudfdssf","major": "premier major","minor": "premier minor"},{"name": "deux beacon","UUID": "zezazzezezezze","major": "deux major","minor": "deux minor"}]}';
//graphManager.updateBeaconList(b);

//graphManager.updateGraph(v);

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

		var poi = graphManager.getPOIList();
		console.log(poi);

		socket.emit('POIList', {
			poi: poi
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
		var jsonFile = fs.readFileSync('./public/content/graph.json', 'utf8');
		res.send(jsonFile);
	});

router.route('/updateGraph')
	.post(function (req, res) {
		console.log("updating Graph");
		console.log(req.body);
		broadcastToAll(req.body);
		var done = graphManager.updateGraph(req.body);
		res.send(done);
	});

router.route('/updateBeacons')
	.post(function (req, res) {
		console.log("updating Beacon List");
		console.log(req.body);
		var done = graphManager.updateBeaconList(req.body);
		res.send(done);
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