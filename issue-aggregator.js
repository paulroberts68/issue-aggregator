var kanboard = require("./kanboard");
var github = require("./github");
var trello = require("./trello");

var testing = false;

kanboard.initialize("localhost", "905078a207084e5f822c82dab1545dc1f62529470c0c12694abc680b6b09");

// BCDevExchange-app board.
github.import("BCDevExchange", "BCDevExchange-app", kanboard, testing);

// BCDevExchange-app board.
github.import("BCDevExchange", "Our-Project-Docs", kanboard, testing);

// Service Design board.
// trello.import("<board ID>", "<API key>", "<membership token>", kanboard, testing);