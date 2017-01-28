var MongoClient = require('mongodb').MongoClient, assert = require('assert');

/**
 - return graph json ---OK---
 - return temp json  ---OK---
 - write new graph json ---OK---
 - write new temp json ---OK---
 - return all nodes ---
 - return all POI ---
 - envoyer un nouveau Beacon ---
 */


// Connection URL
var url = 'mongodb://root:Catchouball06@ds135798.mlab.com:35798/followit';
module.exports = {

    //get Graph JSON
    getGraphDocument: function (callback) {
        MongoClient.connect(url, function (err, database) {
            assert.equal(null, err);
            // Get the documents collection
            var collection = database.collection('Graph');
            // Find some documents
            collection.find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                callback(docs);
            });
        });
    },

    //get Temp JSON
    getTempDocument: function (callback) {
        MongoClient.connect(url, function (err, database) {
            assert.equal(null, err);
            // Get the documents collection
            var collection = database.collection('Temp');
            // Find some documents
            collection.find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                callback(docs);
            });
        });
    },

    //update Graph
    updateGraphDocument: function (graph, callback) {
        MongoClient.connect(url, function (err, database) {
            assert.equal(null, err);
            // Get the documents collection
            var collection = database.collection('Graph');
            collection.deleteMany({}, function (err, docs) {
                assert.equal(null, err);
                collection.insertOne(graph, function (err, result) {
                    assert.equal(err, null);
                    callback(result);
                });
            });
        });
    },

    updateTempDocument: function (temp, callback) {
        MongoClient.connect(url, function (err, database) {
            assert.equal(null, err);
            // Get the documents collection
            var collection = database.collection('Temp');
            // Update document where a is 2, set b equal to 1
            collection.deleteMany({}, function (err, docs) {
                collection.insertOne(temp, function (err, result) {
                    assert.equal(err, null);
                    callback(result);
                });
            })
        });
    },

    getBeaconDocuments: function (callback) {
        MongoClient.connect(url, function (err, database) {
            assert.equal(null, err);
            // Get the documents collection
            var collection = database.collection('Beacon');
            // Find some documents
            collection.find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                callback(docs);
            });
        });
    },

    getPromoDocuments: function (callback) {
        MongoClient.connect(url, function (err, database) {
            assert.equal(null, err);
            // Get the documents collection
            var collection = database.collection('Temp');
            // Find some documents
            collection.find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                callback(docs);
            });
        });
    },

    updateBeaconDocuments: function (beanconArray, callback) {
        MongoClient.connect(url, function (err, database) {
            assert.equal(null, err);
            // Get the documents collection
            var collection = database.collection('Beacon');
            // Update document where a is 2, set b equal to 1
            collection.deleteMany({}, function (err, docs) {
                for (var b in beanconArray.beacons) {
                    collection.insertOne(beanconArray.beacons[b], function (err, result) {
                        assert.equal(err, null);
                    });
                }
                callback('done');
            })
        });
    },


};