var mysql = require('mysql');

var mysql_creds = require('../../drone-db.json');
var connection_config = Object.assign({ database: "drone" }, mysql_creds);
var mysql_con = mysql.createConnection(connection_config);

mysql_con.connect(function(err) {
  if (err) {
    console.log("Error connecting to MySQL");
    return;
  }
});

module.exports = mysql_con;
