var mysql = require('mysql');

var mysql_creds = require('../../drone-db.json');
var mysql_con = mysql.createConnection(mysql_creds);

mysql_con.connect(function(err) {
  if (err) {
    console.log("Error connecting to MySQL", err);
    process.exit(1);
  }
});

createDatabase()
.then(() => useDatabase())
.then(() => createUsersTable())
.then(() => {
  console.log("Done");
  mysql_con.end(function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}).catch((reason) => {
  console.log("Quitting script: ", reason);
  process.exit(1);
});


function createDatabase() {
  return new Promise(function(resolve, reject) {
    console.log("Creating database 'drone'");
    mysql_con.query(`CREATE DATABASE IF NOT EXISTS drone CHARACTER SET = utf8 COLLATE = utf8_general_ci`, function(err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

function useDatabase() {
  return new Promise(function(resolve, reject) {
    console.log("Using database 'drone'");
    mysql_con.query(`USE drone`, function(err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

function createUsersTable() {
  return new Promise(function(resolve, reject) {
    console.log("Creating table 'users'");
    mysql_con.query(`CREATE TABLE IF NOT EXISTS users (guid varchar(8) NOT NULL PRIMARY KEY, username varchar(30) NOT NULL, password varchar(32) NOT NULL)`, function(err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}
