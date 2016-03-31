var Q = require("q");
var http = require("http");

var kanboardApiToken = "";
var kanboardHost = "";

var kanboard = {
	initialize: function(host, apiToken) {
		kanboardHost = host;
		kanboardApiToken = apiToken;
	},

	remoteProcedure: function(postData, callback) {
		var postDataString = JSON.stringify(postData).replace("”", "'").replace("“", "'");

		var options = {
			hostname: kanboardHost,
			path: "/kanboard/jsonrpc.php",
			method: "POST",
			auth: `jsonrpc:${kanboardApiToken}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": postDataString.length
			}
		};

		var deferred = Q.defer();
		var req = http.request(options, (response) => {
			response.setEncoding("utf8");

			var body = "";
			response.on("data", (d) => {
				body += d;
			})

			response.on("end", () => {
				// console.log("req: " + postDataString);
				// console.log("body: " + body);
				try {
					deferred.resolve(JSON.parse(body));
				} catch(e) {
					//console.log(e);
					//console.log("Body: " + body);
					//console.log("Request:");
					//console.log(postDataString);
					//console.log(options);
				}
			});
		});

		req.on("error", function(err) {
			//if an error occurs reject the deferred
			deferred.reject(err);
		});

		req.write(postDataString);
		req.end();

		return deferred.promise;
	},

	createTask: function(projectID, columnID, title) {
		console.log("createTask: " + projectID + " " + columnID + " " + title);
		return kanboard.remoteProcedure({
			"jsonrpc": "2.0",
			"method": "createTask",
			"id": 1176509098,
			"params": {
				"title": title,
				"project_id": projectID,
				"color_id": "green",
				"column_id": columnID,
			}
		});
	},

	addColumn: function(projectID, column) {
		console.log("insertColumn: " + column);
		return kanboard.remoteProcedure({
			"jsonrpc": "2.0",
			"method": "addColumn",
			"id": 638544704,
			"params": [
				projectID,
				column
			]
		});
	},

	enableProject: function(boardID) {
		console.log("enableProject: " + boardID);
		return kanboard.remoteProcedure({
			"jsonrpc": "2.0",
			"method": "enableProject",
			"id": 1775494839,
			"params": [
				boardID
			]
		});
	},

	getColumns: function(projectID) {
		console.log("getColumns: " + projectID);
		return kanboard.remoteProcedure({
			"jsonrpc": "2.0",
			"method": "getColumns",
			"id": 887036325,
			"params": [
				projectID
			]
		})
	},

	removeColumn: function(columnID) {
		console.log("removeColumn: " + columnID);
		return kanboard.remoteProcedure({
			"jsonrpc": "2.0",
			"method": "removeColumn",
			"id": 1433237746,
			"params": [
				columnID
			]
		});
	},

	removeAllColumns: function(projectID) {
		console.log("removeAllColumns");
		var deferred = Q.defer();

		// Get all default columns.
		kanboard.getColumns(projectID).then((columns) => {
			// Remove all default columns.
			var allDone = Q.all(columns.result.map((column) => kanboard.removeColumn(column.id)));
			allDone.then(deferred.resolve, deferred.reject);
		});

		return deferred.promise;
	},

	createProject: function(name) {
		console.log("createProject: " + name);

		var req = kanboard.remoteProcedure({
			"jsonrpc": "2.0",
			"method": "createProject",
			"id": 1797076613,
			"params": {
				"name": name
			}
		});

		req.then((res) => {
			var projectID = res.result;
			console.log("projectID: " + projectID);
			//kanboard.enableBoard(projectID);
		});

		return req;
	},
}

module.exports = kanboard;