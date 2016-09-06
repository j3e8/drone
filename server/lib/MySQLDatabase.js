var mysql = require('mysql');

var mysql_con = mysql.createConnection({
  host: "localhost",
  user: "web",
  password: "Tortuga01",
  database: "drone"
});

mysql_con.connect(function(err) {
  if (err) {
    console.log("Error connecting to MySQL");
    return;
  }
});

module.exports = mysql_con;