const
  mysql = require("mysql"),
  inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "bryan3023.employee_tracker",
  password: "1L5i%KV&^@jc7LFe5c5C",
  database: "employee_tracker_DB"
});


connection.connect(function(err) {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  //createProduct();
});