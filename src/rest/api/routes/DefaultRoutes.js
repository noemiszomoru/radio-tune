'use strict';
module.exports = function (app) {
  var radioController = require('../controllers/RadioController');

  // Collections routes
  app.route('/collections')
    .get(radioController.getCollections);


  app.route('/collection/:id')
    .get(radioController.getCollection)
    .post(radioController.saveCollection)
    .delete(radioController.deleteCollection);

  // Covers routes
  app.route('/covers')
    .get(radioController.getCovers);

  app.route('/cover')
    .post(radioController.saveCover);

  app.route('/cover/:id')
    .get(radioController.getCover)
    .delete(radioController.deleteCover);

  // Songs routes
  app.route('/songs')
    .get(radioController.getSongs)
    .post(radioController.scanSongs);


  app.route('/song/:id')
    .get(radioController.getSong)
    .put(radioController.saveSong);

  // General routes
  app.route('/collection-songs/{id}')
    .get(radioController.getCollectionSongs)

  app.route('/playlist')
    .get(radioController.getPlaylist)

};
