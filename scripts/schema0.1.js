var mysql = require('mysql');

var mysql_creds = require('../drone-db.json');
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
.catch((reason) => {
  console.log("Quitting script: ", reason);
  process.exit(1);
});

mysql_con.end(function(err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});




function createDatabase() {
  return new Promise(function(resolve, reject) {
    db.query(`CREATE DATABASE IF NOT EXISTS drone CHARACTER SET = utf8 COLLATE = utf8_general_ci`, function(err, rows) {
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
    db.query(`USE drone`, function(err, rows) {
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
    db.query(`CREATE TABLE users (guid varchar(8) NOT NULL PRIMARY KEY, username varchar(30) NOT NULL, password varchar(32) NOT NULL)`, function(err, rows) {
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
