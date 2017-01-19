// PACKAGES
// ===============================================================================
var express = require("express");
var app = express();        // call express
var server = require('http').Server(app);
var io = require('socket.io')(server); // define our app using express
var bodyParser = require("body-parser");   //json
var graphManager = require("./graphManager.js");

graphManager.constructGraph();
graphManager.constructPOIList();

var v = '{"options": {"directed": true,"multigraph": false,"compound": false},"nodes": [{ "v": "a", "value": { "label": "node a", "POI": ["H&M"], "coord": {"x": "0", "y":"0"}} },'
        + '{ "v": "b", "value": { "label": "node b", "POI": ["Cinema"], "coord": {"x": "1", "y":"0"}} },'

    + '"edges": [{ "v": "a", "w": "b", "value": { "label": "edge a->b", "weight": "2"} },{ "v": "b", "w": "a", "value": { "label": "edge b->a", "weight": "2"} },'
       + ' { "v": "b", "w": "c", "value": { "label": "edge b->c", "weight": "1" } },{ "v": "c", "w": "b", "value": { "label": "edge c->b", "weight": "1"} },'
       + ' { "v": "c", "w": "d", "value": { "label": "edge c->d", "weight": "3"} },{ "v": "d", "w": "c", "value": { "label": "edge d->c", "weight": "3"} },'
        + '{ "v": "d", "w": "e", "value": { "label": "edge d->e", "weight": "4"} },{ "v": "e", "w": "d", "value": { "label": "edge e->d", "weight": "4"} },'
        + '{ "v": "e", "w": "f", "value": { "label": "edge e->f", "weight": "6"} },{ "v": "f", "w": "e", "value": { "label": "edge f->e", "weight": "6"} },'
       + ' { "v": "b", "w": "d", "value": { "label": "edge b->d", "weight": "1"} },{ "v": "d", "w": "b", "value": { "label": "edge d->b", "weight": "1"} }]}';

graphManager.updateGraph(v);

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
        //console.log(json);

        var poi = graphManager.getPOIList();
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
app.all('/', function(req, res, next) {
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
        var jsonFile = require("./public/content/graph.json");
        jsonFile = JSON.stringify(jsonFile);
        res.send(jsonFile);
    });

router.route('/updateGraph')
    .post(function (req, res) {
        console.log("updating");
        console.log(req.body);
        //broadcastToAll(req.body);
        var done = graphManager.updateGraph(req.body);
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