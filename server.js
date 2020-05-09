const
  EmployeeDatabase = require("./lib/EmployeeDatabase"),
  inquirer = require("inquirer"),
  consoleTable = require("console.table")

const
  database = new EmployeeDatabase();

function init() {
  promptMainMenu()
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
    const action = mainMenuLookup
      .filter(m => m.menuItem === choice)[0]
      .action

    action()
  })
}


const mainMenuLookup = [
  {
    menuItem: "View All Employees",
    action: viewAllEmployees
  },
  {
    menuItem: "Exit",
    action: quit
  }
]

function viewAllEmployees() {
  database.getFullEmployeeListing()
    .then(result => {
      console.table(result)
      promptMainMenu()
    })
}


function quit() {
  database.close()
}

init()
