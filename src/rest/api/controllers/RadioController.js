'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../../config');
const formidable = require('formidable');
// Load the core build.
var lodash = require('lodash/core');

const DB_DIR = '../../db';
const COVER_DIR = '../../covers';

// INIT

// Query the entry
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR);
    console.log("DB DIR created");
} else {
    console.log("DB DIR exists");
}

// Query the entry
if (!fs.existsSync(COVER_DIR)) {
    fs.mkdirSync(COVER_DIR);
    console.log("COVER DIR created");
} else {
    console.log("COVER DIR exists");
}

const JSON_FILE_PLAYLIST = DB_DIR + "/playlist.json";
const JSON_FILE_SONGS = DB_DIR + "/songs.json";
const JSON_FILE_COVERS = DB_DIR + "/covers.json";
const JSON_FILE_COLLECTIONS = DB_DIR + "/collections.json";
const JSON_FILE_COLLECTION_SONGS = DB_DIR + "/collection_songs.json";

const emptyArray = "[]";
const emptyObj = "{}";

if (!fs.existsSync(JSON_FILE_PLAYLIST)) {
    fs.writeFileSync(JSON_FILE_PLAYLIST, emptyArray, 'utf8');
    console.log("Playlist Db created");
}

if (!fs.existsSync(JSON_FILE_SONGS)) {
    fs.writeFileSync(JSON_FILE_SONGS, emptyArray, 'utf8');
    console.log("Songs Db created");
}

if (!fs.existsSync(JSON_FILE_COVERS)) {
    fs.writeFileSync(JSON_FILE_COVERS, emptyArray, 'utf8');
    console.log("Covers Db created");
}

if (!fs.existsSync(JSON_FILE_COLLECTIONS)) {
    fs.writeFileSync(JSON_FILE_COLLECTIONS, emptyArray, 'utf8');
    console.log("Collections Db created");
}

if (!fs.existsSync(JSON_FILE_COLLECTION_SONGS)) {
    fs.writeFileSync(JSON_FILE_COLLECTION_SONGS, emptyObj, 'utf8');
    console.log("Collections songs Db created");
}

var songs = JSON.parse(fs.readFileSync(JSON_FILE_SONGS, 'utf8'));
var covers = JSON.parse(fs.readFileSync(JSON_FILE_COVERS, 'utf8'));
var collections = JSON.parse(fs.readFileSync(JSON_FILE_COLLECTIONS, 'utf8'));
var collectionSongs = JSON.parse(fs.readFileSync(JSON_FILE_COLLECTION_SONGS, 'utf8'));
var playlist = JSON.parse(fs.readFileSync(JSON_FILE_PLAYLIST, 'utf8'));

// UTILS


function saveSongs() {
    fs.writeFileSync(JSON_FILE_SONGS, JSON.stringify(songs), 'utf8');
}

function saveCollections() {
    fs.writeFileSync(JSON_FILE_COLLECTIONS, JSON.stringify(collections), 'utf8');
}

function saveCollectionSongs() {
    fs.writeFileSync(JSON_FILE_COLLECTION_SONGS, JSON.stringify(collectionSongs), 'utf8');
}

function saveCovers() {
    fs.writeFileSync(JSON_FILE_COVERS, JSON.stringify(covers), 'utf8');
}

function getCoverById(id) {
    return lodash.filter(covers, cover => cover.id == id)[0];
}

function getCollectionById(id) {
    return lodash.filter(collections, collection => collection.id == id)[0];
}


function getSongById(id) {
    return lodash.filter(songs, song => song.id == id)[0];
}


// EXPORTS

// .get(radioController.getCollections);
// .get(radioController.getCollection)
// .put(radioController.saveCollection)
// .delete(radioController.deleteCollection);

exports.getCollections = function (req, res) {
    res.json(collections); // res.send(err);
};

exports.getCollection = function (req, res) {
    res.json({}); // res.send(err);
};

exports.saveCollection = function (req, res) {

    var obj = req.body;
    obj.id = collections.length + 1;


    collections.push(obj);

    saveCollections();

    exports.getCollections(req, res);
};

exports.deleteCollection = function (req, res) {
    res.json({}); // res.send(err);
};

// .get(radioController.getCovers);
// .get(radioController.getCover)
// .put(radioController.saveCover)
// .delete(radioController.deleteCover);

exports.getCovers = function (req, res) {
    res.json(covers); // res.send(err);
};

exports.getCover = function (req, res) {
    const cover = getCoverById(req.params.id);
    res.sendFile(path.resolve(COVER_DIR + "/" + cover.name));
};

exports.saveCover = function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.fileUpload.path;

        const coverId = covers.length + 1;
        const coverFileName = coverId + "." + files.fileUpload.name.toLowerCase().substr(files.fileUpload.name.lastIndexOf('.') + 1);

        var newpath = path.normalize(COVER_DIR + "\\" + coverFileName);

        fs.copyFileSync(oldpath, newpath);
        fs.unlinkSync(oldpath);
        
        covers.push({
            id: coverId,
            name: coverFileName
        });

        saveCovers();

        exports.getCovers(req, res);
    });
};

exports.deleteCover = function (req, res) {
    res.json(true); // res.send(err);
};

// .get(radioController.getSongs)
// .post(radioController.scanSongs);
// .get(radioController.getSong)
// .put(radioController.saveSong);

exports.getSongs = function (req, res) {
    res.json(songs); // res.send(err);
};

exports.getSong = function (req, res) {
    res.json({}); // res.send(err);
};

exports.saveSong = function (req, res) {
    res.json({}); // res.send(err);
};

exports.scanSongs = function (req, res) {

    console.log("Scanning for songs");

    var dic = {};
    var colDic = {};

    console.log(JSON.stringify(songs));

    collections.forEach(collection => {
        if (collection.path !== undefined) {
            colDic[collection.path] = collection.id;
        }

    });

    songs.forEach(song => {
        dic[song.path] = song.id;
    });

    // Simulate added songs by forcing the scan of maximum # of songs
    var count = 10;

    config.songsPaths.forEach(dir => {
        dir = path.normalize(dir);

        const walkSync = (dir) => {
            console.log("Scanning: " + path.basename(dir));
            fs.readdirSync(dir).forEach(file => {

                var fullPath = path.join(dir, file);

                if (fs.statSync(fullPath).isDirectory()) {
                    walkSync(fullPath)
                } else {
                    if (file.substr(-4).toLowerCase() != '.mp3') return; // || count < 1
                    if (dic[fullPath] !== undefined) return;

                    if (colDic[dir] == undefined) {

                        var collectionObj =
                            {
                                id: collections.length + 1,
                                name: path.basename(dir).replace(/[^A-Za-z0-9_'-\s]/gi, '').replace(/[\s-_]+/gi, ' '),
                                path: dir
                            };

                        collections.push(collectionObj);
                        colDic[dir] = collections.length;
                    }

                    var collectionId = colDic[dir];

                    count--;

                    var songObj = {
                        id: songs.length + 1,
                        path: fullPath,
                        collectionId: collectionId,
                        name: file.substr(0, file.indexOf('.mp3')).replace(/[^A-Za-z0-9_'-]/gi, '')
                    };

                    songs.push(songObj);

                    if (collectionSongs[collectionId] === undefined) {
                        collectionSongs[collectionId] = [];
                    }

                    collectionSongs[collectionId].push(songObj.id)
                }

            });
        }

        walkSync(dir);

    });

    saveCollections();
    saveSongs();
    saveCollectionSongs();

    exports.getSongs(req, res);
};


// .get(radioController.getCollectionSongs);
// .get(radioController.getPlaylist)

exports.getCollectionSongs = function (req, res) {
    res.json(collectionSongs[req.params.id] !== undefined ? collectionSongs[req.params.id] : []); // res.send(err);
};

exports.getPlaylist = function (req, res) {
    res.json(playlist); // res.send(err);
};
