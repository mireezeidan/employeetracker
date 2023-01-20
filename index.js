const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.PW,
    database: "tracker",
  },
  console.log(`Connected to the tracker database.`)
);

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
  console.log("it worked");
}

function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the name of the department?",
        name: "name",
      },
    ])
    .then((answer) => {
      db.query("INSERT INTO department SET ?", answer, function (err, results) {
        console.log("Department added successfully");
      });
    });
}

function viewRoles() {
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
  });
  console.log("it worked");
}

// function addRole() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         message: "What is the name of the role?",
//         name: "title",
//       },
//       {
//         type: "input",
//         message: "What is the salary of the role?",
//         name: "salary",
//       },
//       {
//         type: "list",
//         message: "Which department does the role belong to?",
//         name: "department",
//         choices:
//       },
//     ])
//     .then((answer) => {
//       db.query("INSERT INTO role", function (values) {
//         values(answer);
//       });
//     });
// }

function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
    console.table(results);
  });
  console.log("it worked");
}

function anotherOne() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          { name: "view all departments", value: "VIEW DEPARTMENTS" },
          { name: "Add department", value: "ADD DEPARTMENT" },
          { name: "view all roles", value: "VIEW ROLES" },
          { name: "Add Role", value: "ADD ROLE" },
          { name: "view all employees", value: "VIEW EMPLOYEES" },
          { name: "Update employee role", value: "UPDATE EMPLOYEE ROLE" },
          { name: "Add employee", value: "ADD EMPLOYEE" },
          { name: "Exit", value: "EXIT" },
        ],
      },
    ])
    .then((response) => {
      if (response.choice === "VIEW DEPARTMENTS") {
        viewDepartments();
      }
      if (response.choice === "ADD DEPARTMENT") {
        addDepartment();
      }
      if (response.choice === "VIEW ROLES") {
        viewRoles();
      }
      if (response.choice === "ADD ROLE") {
        addRole();
      }
      if (response.choice === "VIEW EMPLOYEES") {
        viewEmployees();
      }
      if (response.choice === "UPDATE EMPLOYEE ROLE") {
        updateEmployeeRole();
      }
      if (response.choice === "ADD EMPLOYEE") {
        addEmployee();
      }
      if (response.choice === "EXIT") {
        process.exit();
      }
      //   else {
      //     anotherOne();
      //   }
    });
}

anotherOne();
