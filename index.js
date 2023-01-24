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
  anotherOne();
}

function viewRoles() {
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
  });
}

function addRole() {
  db.query("SELECT * FROM department", function (err, results) {
    const departments = results.map((department) => ({ name: department.name, value: department.id }));
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary of the role?",
          name: "salary",
        },
        {
          type: "list",
          message: "Which department does the role belong to?",
          name: "department_id",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query("INSERT INTO role SET ?", answer, function (err, results) {
          console.log("Role added successfully");
        });
      });
  });
}

function viewEmployees() {
  db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, results) {
    console.table(results);
  });
}

function addEmployee() {
  db.query("SELECT * FROM employee", function (err, results) {
    const employees = results.map((employee) => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));
    employees.unshift({ name: "None", value: null });

    db.query("SELECT * FROM role", function (err, results) {
      const roles = results.map((role) => ({ name: role.title, value: role.id }));

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employees first name?",
            name: "first_name",
          },
          {
            type: "input",
            message: "What is the employees last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is the employees role?",
            name: "role_id",
            choices: roles,
          },
          {
            type: "list",
            message: "Who is the employees manager?",
            name: "manager_id",
            choices: employees,
          },
        ])
        .then((answer) => {
          db.query("INSERT INTO employee SET ?", answer, function (err, results) {
            console.log("Employee added successfully");
          });
        });
    });
  });
}

function updateEmployeeRole() {
  db.query("SELECT * FROM employee", function (err, results) {
    const employees = results.map((employee) => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));

    db.query("SELECT * FROM role", function (err, results) {
      const roles = results.map((role) => ({ name: role.title, value: role.id }));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employees role do you want to update?",
            name: "id",
            choices: employees,
          },
          {
            type: "list",
            message: "Which role do you want to assign to the selected employee?",
            name: "role_id",
            choices: roles,
          },
        ])
        .then((answer) => {
          db.query("UPDATE employee SET role_id = ? WHERE id = ? ", [answer.role_id, answer.id], function (err, results) {
            console.log("Employee updated successfully");
          });
        });
    });
  });
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
