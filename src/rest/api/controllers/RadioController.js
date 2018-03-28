'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../../config');
const formidable = require('formidable');
// Load the core build.
var lodash = require('lodash/core');

const DB_DIR = '../../db';
const COVER_DIR = '../../covers';

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

const JSON_FILE_SONGS = DB_DIR + "/songs.json";
const JSON_FILE_COVERS = DB_DIR + "/covers.json";
const JSON_FILE_COLLECTIONS = DB_DIR + "/collections.json";

const emptyDb = "[]";

if (!fs.existsSync(JSON_FILE_SONGS)) {
    fs.writeFileSync(JSON_FILE_SONGS, emptyDb, 'utf8');
    console.log("Songs Db created");
}

if (!fs.existsSync(JSON_FILE_COVERS)) {
    fs.writeFileSync(JSON_FILE_COVERS, emptyDb, 'utf8');
    console.log("Covers Db created");
}

if (!fs.existsSync(JSON_FILE_COLLECTIONS)) {
    fs.writeFileSync(JSON_FILE_COLLECTIONS, emptyDb, 'utf8');
    console.log("Collections Db created");
}

var songs = JSON.parse(fs.readFileSync(JSON_FILE_SONGS, 'utf8'));
var covers = JSON.parse(fs.readFileSync(JSON_FILE_COVERS, 'utf8'));
var collections = JSON.parse(fs.readFileSync(JSON_FILE_COLLECTIONS, 'utf8'));

//     .get(radioController.getCollections);
//     .get(radioController.getCollection)
//     .put(radioController.saveCollection)
//     .delete(radioController.deleteCollection);

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

    fs.writeFileSync(JSON_FILE_COLLECTIONS, JSON.stringify(collections), 'utf8');

    exports.getCollections(req, res);
};

exports.deleteCollection = function (req, res) {
    res.json({}); // res.send(err);
};

//     .get(radioController.getCovers);
//     .get(radioController.getCover)
//     .put(radioController.saveCover)
//     .delete(radioController.deleteCover);

exports.getCovers = function (req, res) {
    res.json(covers); // res.send(err);
};

exports.getCover = function (req, res) {
    const cover = lodash.filter(covers, cover => cover.id == req.params.id)[0];
    res.sendFile(path.resolve(COVER_DIR + "/" + cover.name));
};

exports.saveCover = function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.fileUpload.path;

        const coverId = covers.length + 1;
        const coverFileName = coverId + "." + files.fileUpload.name.toLowerCase().substr(files.fileUpload.name.lastIndexOf('.') + 1);

        var newpath = path.normalize(COVER_DIR + "\\" + coverFileName);
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;

            covers.push({
                id: coverId,
                name: coverFileName
            });

            fs.writeFileSync(JSON_FILE_COVERS, JSON.stringify(covers), 'utf8');
        });

        exports.getCovers(req, res);
    });
};

exports.deleteCover = function (req, res) {
    res.json(true); // res.send(err);
};

//     .get(radioController.getSongs)
//     .post(radioController.scanSongs);
//     .get(radioController.getSong)
//     .put(radioController.saveSong);

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
                        collections.push(
                            {
                                id: collections.length + 1,
                                name: path.basename(dir).replace(/[^A-Za-z0-9_'-\s]/gi, '').replace(/[\s-_]+/gi, ' '),
                                path: dir
                            }
                        );
                        fs.writeFileSync(JSON_FILE_COLLECTIONS, JSON.stringify(collections), 'utf8');
                        colDic[dir] = collections.length;
                    }

                    var collectionId = colDic[dir];

                    console.log("New song found: " + fullPath);
                    count--;
                    songs.push({
                        id: songs.length + 1,
                        path: fullPath,
                        collectionId: collectionId,
                        name: file.substr(0, file.indexOf('.mp3')).replace(/[^A-Za-z0-9_'-]/gi, '')
                    });
                }

            });
        }

        walkSync(dir);

    });

    fs.writeFileSync(JSON_FILE_SONGS, JSON.stringify(songs), 'utf8');

    exports.getSongs(req, res);
};
