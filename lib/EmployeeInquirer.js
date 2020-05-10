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


function removeDepartment() {
  database.getDepartmentsWithoutRoles()
    .then(departments => {
      const departmentNames = departments.map(d => d.Department)
      departmentNames.push("(cancel)")
      inquirer.prompt([
        {
          type: "list",
          message: "Only empty departments can be removed. Choose from the following:",
          choices: departmentNames,
          name: "department"
        }
      ]).then(({department}) => {
        cancelIfRequested(department)
        database.removeDepartment(department)
          .then(response => promptMainMenu())
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
      menuItem: "Add a role"
    },
    {
      menuItem: "Remove a role"
    },
    {
      menuItem: "Change a role's salary"
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
