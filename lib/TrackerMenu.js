const
  inquirer = require("inquirer"),
  consoleTable = require("console.table")

const
  database = new (require("./TrackerDatabase"))(),
  departments = new (require("./DepartmentModel"))(database),
  roles = new (require("./RoleModel"))(database),
  employees = new (require("./EmployeeModel"))(database)


const
  // menu options
  cancel = { name: "(cancel)", value: -1 },
  none = { name: "(none)", value: -1 }


/*
  Ask user to select from the top-level menu.
 */
async function promptMainMenu() {
  promptMenu("main")
}


/*
  Load the specified menu and invoke its corresponding action.
 */
async function promptMenu(menu) {
  const message = ("main" === menu) ?
    "What would you like to do?" :
    `What would you like to do in the ${menu}s table?`

  const {menuAction} = await inquirer.prompt([
    {
      type: "list",
      message: message,
      choices: menuList[menu],
      name: "menuAction"
    }
  ])
  
  menuAction()
}


// --- Department menu actions ---

/*
  Prompt for the name a department and then add it.
 */
async function addDepartment() {
  const {name} = await inquirer.prompt([
    {
      message: "What would you like the department name to be?",
      name: "name",
      validate: (answer) => departments.validateName(answer)
    }
  ])
  
  await departments.add(name)
  promptMainMenu()
}


/*
  Prompt for a department, then delete it.
 */
async function removeDepartment() {
  const departmentList = await departments.getListEmpty()

  if (departmentList.length) {
    const {departmentId} = await inquirer.prompt([
      {
        type: "list",
        message: "Only empty departments can be removed. Choose from the following:",
        choices: [...departmentList, cancel],
        name: "departmentId"
      }
    ])

    if (departmentId > 0) {
      await departments.remove(departmentId)
    }
  } else {
    showMessage("There are no empty departments eligible for removal.")
  }
  promptMainMenu()
}


// --- Role menu items ---

/*
  Prompt for information and add a role.
 */
async function addRole() {
  const departmentList = await departments.getListAll()
  
  const {title, salary, departmentId} = await inquirer.prompt([
    {
      message: "What is the role's title?",
      name: "title",
      validate: (answer) => roles.validateTitle(answer)
    },
    {
      message: "What is the role's salary?",
      name: "salary",
      validate: (answer) => roles.validateSalary(answer)
    },
    {
      type: "list",
      message: "Which department does this role belong to?",
      choices: departmentList,
      name: "departmentId"
    }
  ])

  await roles.add(title, salary, departmentId)
  promptMainMenu()
}


/*
  Remove the specified role.
 */
async function removeRole() {
  const roleList = await roles.getListUnassigned()

  if (roleList.length) {
    const {roleId} = await inquirer.prompt([
      {
        type: "list",
        message: "Only unassigned roles can be removed. Choose from the following:",
        choices: [...roleList, cancel],
        name: "roleId"
      }
    ])
    
    if (roleId > 0) {
      await roles.remove(roleId)
    }
  } else {
    showMessage("There are no unassigned roles eligible for removal.")
  }
  promptMainMenu()
}


/*
  Set a role's salary to the new value provided.
 */
async function setRoleSalary() {
  const
    roleList = await roles.getListAll(),
    {roleId, salary} = await inquirer.prompt([
      {
        type: "list",
        message: "Which role's salary would you like to update?",
        choices: roleList,
        name: "roleId",
      },
      {
        message: "What should the new salary be?",
        name: "salary",
        validate: (answer) => roles.validateSalary(answer)
      }
    ])
  
  await roles.setSalary(roleId, salary)
  promptMainMenu()
}


// -- Employee menu actions ---

/*
  Prompt for new information and add a new employee.
 */
async function addEmployee() {
  const
    employeesList = await employees.getListAll(),
    roleList = await roles.getListAll()

  const {givenName, surname, roleId, managerId} =
    await inquirer.prompt([
      {
        message: "What is the employee's given name?",
        name: "givenName",
        validate: (answer) => employees.validateName(answer)
      },
      {
        message: "What is the employee's surname?",
        name: "surname",
        validate: (answer) => employees.validateName(answer)
      },
      {
        type: "list",
        message: "What is the employee's role?",
        choices: roleList,
        name: "roleId"
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        choices: [...employeesList, none],
        name: "managerId"
      }
    ])
  
  await employees.add(givenName, surname, roleId, managerId)
  promptMainMenu()
}


/*
  Remove the employee specified.
 */
async function removeEmployee() {
  const employeeList = await employees.getListNonManagers()

  const {employeeId} = await inquirer.prompt([
    {
      type: "list",
      message: "You can only remove employees without direct reports. Which would you like to remove?",
      choices: [...employeeList, cancel],
      name: "employeeId"
    }
  ])
  
  if (employeeId > 0) {
    await employees.remove(employeeId)
  }
  promptMainMenu()
}


/*
  Update an employee's role.
 */
async function setEmployeeRole() {
  const
    employeeList = await employees.getListAll(),
    roleList = await roles.getListAll()

  const {employeeId, roleId} = await inquirer.prompt([
    {
      type: "list",
      message: "Which employee's role would you like to change?",
      choices: employeeList,
      name: "employeeId"
    },
    {
      type: "list",
      message: "What is the employee's new role?",
      choices: roleList,
      name: "roleId"
    }
  ])

  await employees.setRole(employeeId, roleId)
  promptMainMenu()
}


/*
  Update an employee's manager.
 */
async function setEmployeeManager() {
  const
    employeeList = await employees.getListAll(),
    {employeeId, managerId} = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee's manager do you want to change?",
        choices: employeeList,
        name: "employeeId"
      },
      {
        type: "list",
        message: "Who is the employee's new manager?",
        choices: [...employeeList, none],
        name: "managerId"
      }
    ])

  if (employeeId === managerId) {
    showMessage("Sadly, an employee cannot be their own manager.")
  } else {
    await employees.setManager(employeeId, managerId)
  }
  promptMainMenu()
}


// --- Special table view actions ---

/*
  Show all employees within a department.
 */
async function viewEmployeesByDepartment() {
  const
    departmentNames = await departments.getNamesAll(),
    {departmentName} = await inquirer.prompt([
      {
        type: "list",
        message: "Which department's employees would you like to view?",
        choices: departmentNames,
        name: "departmentName"
      }
    ])
  
  const departmentTable = await employees.getTableByDepartment(departmentName)

  if (departmentTable.length) {
    showTable(departmentTable)
  } else {
    showMessage(`No employees in ${departmentName} department.`)
    promptMainMenu()
  }
}


/*
  Show all employees reporting to a given manager.
 */
async function viewEmployeesByManager() {
  const
    managerList = await employees.getListManagers(),
    {managerId} = await inquirer.prompt([
      {
        type: "list",
        message: "Which manager's employees would you like to view?",
        choices: managerList,
        name: "managerId"
      }
    ])

  showTable(await employees.getTableByManager(managerId))
}


// --- Utility functions ---

/*
  Display a nicely formatted meesage.
 */
function showMessage(message) {
  console.log(`\n${message}\n`)
}


/*
  Show a table of results and return to the main menu.
 */
function showTable(table) {
  console.log("")
  console.table(table)
  promptMainMenu()
}


// --- Menu object that drives navigation ---

const menuList = {
  main: [
    {
      name: "View All Employees",
      value: async () => { showTable(await employees.getTable()) }
    },
    {
      name: "View Employees by Department",
      value: viewEmployeesByDepartment
    },
    {
      name: "View Employees by Manager",
      value: viewEmployeesByManager
    },
    {
      name: "View Total Salaries by Department",
      value: async () => { showTable(await departments.getTableSalaryTotal()) }
    },
    {
      name: "Manage Departments",
      value: () => { promptMenu("department") }
    },
    {
      name: "Manage Roles",
      value: () => { promptMenu("role") }
    },
    {
      name: "Manage Employees",
      value: () => { promptMenu("employee") }
    },
    {
      name: "Exit",
      value: () => database.close()
    }
  ],
  department: [
    {
      name: "View departments",
      value: async () => { showTable(await departments.getTable()) }
    },
    {
      name: "Add a department",
      value: addDepartment
    },
    {
      name: "Remove a department",
      value: removeDepartment
    }
  ],
  role: [
    {
      name: "View roles",
      value: async () => { showTable(await roles.getTable()) }
    },
    {
      name: "Add a role",
      value: addRole
    },
    {
      name: "Remove a role",
      value: removeRole
    },
    {
      name: "Change a role's salary",
      value: setRoleSalary
    }
  ],
  employee: [
    {
      name: "View employees",
      value: async () => { showTable(await employees.getTable()) }
    },
    {
      name: "Add employee",
      value: addEmployee  
    },
    {
      name: "Remove employee",
      value: removeEmployee
    },
    {
      name: "Change an employee's role",
      value: setEmployeeRole
    },
    {
      name: "Change an employee's manager",
      value: setEmployeeManager
    }
  ]
}


/*
  Add an option to go to the main menu from submenus
  to make navigation a little easier.
 */
for (menu in menuList) {
  if (menu !== "main") {
    menuList[menu].push({
      name: "(go back)",
      value: promptMainMenu
    })
  }
}


module.exports = {
  promptMainMenu,
}
