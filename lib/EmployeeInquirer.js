const
  EmployeeDatabase = require("./EmployeeDatabase"),
  inquirer = require("inquirer"),
  consoleTable = require("console.table")

const database = new EmployeeDatabase()

function promptMainMenu() {
  const tableMenu = mainMenuLookup.map(m => m.menuItem)

  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: tableMenu,
      name: "menuItem"
    }
  ]).then(({menuItem}) => {
    mainMenuLookup
      .filter(m => m.menuItem === menuItem)[0]
      .action()
  })
}


function manageTable(table) {
  const tableMenu = tableMenuLookup[table].map(m => m.menuItem)
  inquirer.prompt([
    {
      type: "list",
      message: `What would you like to do in the ${table}s table?`,
      choices: tableMenu,
      name: "menuItem"
    }
  ]).then(({menuItem}) => {
    tableMenuLookup[table]
      .filter(m => m.menuItem === menuItem)[0]
      .action()
  })
}


function viewAllDepartments() {
  database.getAllDepartments()
    .then(departments => showTable(departments))
}


function viewAllRoles() {
  database.getAllRoles()
    .then(roles => showTable(roles))
}


function addDepartment() {
  inquirer.prompt([
    {
      message: "What would you like the department name to be?",
      name: "name"
    }
  ]).then(({name}) => {
    database.addDepartment(name)
      .then(response => promptMainMenu())
  })
}

function addRole() {
  database.getAllDepartments()
    .then(departments => {
      const departmentNames = departments.map(d => d.Name)
      inquirer.prompt([
        {
          message: "What is the role's title?",
          name: "title"
        },
        {
          message: "What is the role's salary?",
          name: "salary"
        },
        {
          type: "list",
          message: "Which department does this role belong to?",
          choices: departmentNames,
          name: "department"
        }
      ]).then(({title, salary, department}) => {
        database.addRole(title, salary, department)
          .then(result => promptMainMenu())
      })
    })
}


function removeDepartment() {
  database.getDepartmentsWithoutRoles()
    .then(departments => {
      const departmentNames = departments.map(d => d.Department)

      if (0 === departmentNames.length) {
        console.log("\nThere are no empty departments eligible for removal.\n")
        promptMainMenu()
      } else {
        departmentNames.push("(cancel)")
        inquirer.prompt([
          {
            type: "list",
            message: "Only empty departments can be removed. Choose from the following:",
            choices: departmentNames,
            name: "department"
          }
        ]).then(({department}) => {
          if ("(cancel)" === department) {
            promptMainMenu()
          } else {
            database.removeDepartment(department)
              .then(response => promptMainMenu())
          }
        })
      }
    })
}

function removeRole() {
  database.getRolesWithoutEmployees()
    .then(roles => {
      const roleNames = roles.map(r => r.Title)

      if (0 == roleNames.length) {
        console.log("\nThere are no empty roles eligible for removal.")
        promptMainMenu()
      } else {
        roleNames.push("(cancel)")
        inquirer.prompt([
          {
            type: "list",
            message: "Only empty roles can be removed. Choose from the following:",
            choices: roleNames,
            name: "role"
          }
        ]).then(({role}) => {
          if ("(cancel)" === role) {
            promptMainMenu()
          } else {
            database.removeRole(role)
              .then(response => promptMainMenu())
          }
        })

      }
    })
}

function setRoleSalary() {
  database.getAllRoles()
    .then(roles => {
      const roleNames = roles.map(r => r.Title)
     
      inquirer.prompt([
        {
          type: "list",
          message: "Which role's salary would you like to update?",
          choices: roleNames,
          name: "roleName"
        },
        {
          message: "What should the new salary be?",
          name: "salary"
        }
      ]).then(({roleName, salary}) => {
        database.setRoleSalary(roleName, salary)
          .then(result => promptMainMenu())
      })
    })
}


function viewAllEmployees() {
  database.getAllEmployees()
    .then(employees => showTable(employees))
}


function viewEmployeesByDepartment() {
  database.getAllDepartments()
    .then(departments => {
      const departmentNames = departments.map(d => d.Name)

      inquirer.prompt([
        {
          type: "list",
          message: "Which department's employees would you like to view?",
          choices: departmentNames,
          name: "department"
        }
      ]).then(({department}) => {
        database.getEmployeesByDepartment(department)
          .then(employees => showTable(employees))
      })
    })
}


function viewEmployeesByManager() {
  database.getAllManagers()
    .then(managers => {
      const managerNames = managers.map(m => m.Manager)

      inquirer.prompt([
        {
          type: "list",
          message: "Which manager's employees would you like to view?",
          choices: managerNames,
          name: "manager"
        }
      ]).then(({manager}) => {
        database.getEmployeesByManager(manager)
          .then(employees => showTable(employees))
      })
    })
}


function viewSalariesByDepartment() {
  database.getSalaryByDepartment()
    .then(salaryTotals => showTable(salaryTotals))
}


/*
  Close the database connection so we can quit the program.
 */
function quit() {
  database.close()
}


function cancelIfRequested(choice) {
  if ("(cancel)" === choice) {
    promptMainMenu()
  }
}


/*
  Show a table of results and return to the main menu.
 */
function showTable(table) {
  console.log("")
  console.table(table)
  promptMainMenu()
}


// --- Lookup tables for menus ---

const mainMenuLookup = [
  {
    menuItem: "View All Employees",
    action: viewAllEmployees
  },
  {
    menuItem: "View Employees by Department",
    action: viewEmployeesByDepartment
  },
  {
    menuItem: "View Employees by Manager",
    action: viewEmployeesByManager
  },
  {
    menuItem: "View Total Salaries by Department",
    action: viewSalariesByDepartment
  },
  {
    menuItem: "Manage Departments",
    action: () => { manageTable("department") }
  },
  {
    menuItem: "Manage Roles",
    action: () => { manageTable("role") }
  },
  {
    menuItem: "Manage Employees",
    action: () => { manageTable("employee") }
  },
  {
    menuItem: "Exit",
    action: quit
  }
]

const tableMenuLookup = {
  department: [
    {
      menuItem: "View departments",
      action: viewAllDepartments
    },
    {
      menuItem: "Add a department",
      action: addDepartment
    },
    {
      menuItem: "Remove a department",
      action: removeDepartment
    }
  ],
  role: [
    {
      menuItem: "View roles",
      action: viewAllRoles
    },
    {
      menuItem: "Add a role",
      action: addRole
    },
    {
      menuItem: "Remove a role",
      action: removeRole
    },
    {
      menuItem: "Change a role's salary",
      action: setRoleSalary
    }

  ],
  employee: [
    {
      menuItem: "View employees",
      action: viewAllEmployees
    },
    {
      menuItem: "Add employee"      
    },
    {
      menuItem: "Remove employee"
    },
    {
      menuItem: "Change an employee's role"
    },
    {
      menuItem: "Change an employee's manager"
    }
  ]
}


module.exports = {
  promptMainMenu,
}
