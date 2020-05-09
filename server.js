const
  EmployeeDatabase = require("./lib/EmployeeDatabase"),
  inquirer = require("inquirer"),
  consoleTable = require("console.table"),
  asciiArtLogo = require("asciiart-logo")

const
  database = new EmployeeDatabase();

function init() {
  showSplash()
  promptMainMenu()
}

function showSplash() {
  const logo = asciiArtLogo({
    name: "Employee Tracker",
    version: "COVID-19",
    description: "They can't leave their homes - it's like fish in a barrel!"
  }).render()

  console.log(logo)
}

function promptMainMenu() {
  const choices = mainMenuLookup.map(m => m.menuItem)

  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: choices,
      name: "choice"
    }
  ]).then(({choice}) => {
    mainMenuLookup
      .filter(m => m.menuItem === choice)[0]
      .action()
  })
}


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

function manageTable(table) {
  promptMainMenu()
}

function viewAllEmployees() {
  database.getFullEmployeeListing()
    .then(result => {
      writeTable(result)
      promptMainMenu()
    })
}

function viewEmployeesByDepartment() {
  database.getAllDepartments()
    .then(result => {
      const departmentNames = result.map(d => d.Name)

      inquirer.prompt([{
        type: "list",
        message: "Which department's employees would you like to view?",
        choices: departmentNames,
        name: "choice"
      }]).then(({choice}) => {
        database.getEmployeesByDepartment(choice)
          .then(result => {
            writeTable(result)
            promptMainMenu()
          })
      })
    })
}

function quit() {
  database.close()
}


function writeTable(results) {
  console.log("")
  console.table(results)
}

init()
