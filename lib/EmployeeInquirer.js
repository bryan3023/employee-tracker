const
  EmployeeDatabase = require("./EmployeeDatabase"),
  DepartmentManager = require("./DepartmentManager"),
  RoleManager = require("./RoleManager"),
  EmployeeManager = require("./EmployeeManager"),

  inquirer = require("inquirer"),
  consoleTable = require("console.table")

const
  database = new EmployeeDatabase(),
  departments = new DepartmentManager(database),
  roles = new RoleManager(database),
  employees = new EmployeeManager(database)


async function promptMainMenu() {
  const tableMenu = mainMenuLookup.map(m => m.menuItem)

  const {menuItem} = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: tableMenu,
      name: "menuItem"
    }
  ])
  
  mainMenuLookup
    .filter(m => m.menuItem === menuItem)[0]
    .action()
}


async function manageTable(table) {
  const tableMenu = tableMenuLookup[table].map(m => m.menuItem)

  const {menuItem} = await inquirer.prompt([
    {
      type: "list",
      message: `What would you like to do in the ${table}s table?`,
      choices: tableMenu,
      name: "menuItem"
    }
  ])
  
  tableMenuLookup[table]
    .filter(m => m.menuItem === menuItem)[0]
    .action()
}


async function viewAllDepartments() {
  showTable(await departments.getTable())
}


async function viewAllRoles() {
  showTable(await roles.getTable())
}


async function addDepartment() {
  const {name} = inquirer.prompt([
    {
      message: "What would you like the department name to be?",
      name: "name"
    }
  ])
  
  await departments.add(name)
  promptMainMenu()
}

async function addRole() {
  const departmentNames = await departments.getAll()
  
  const {title, salary, department} = await inquirer.prompt([
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
  ])
  
  await database.addRole(title, salary, department)
  promptMainMenu()
}


async function removeDepartment() {
  const departmentNames = await departments.getEmpty()

  if (departmentNames.length) {
    const {department} = await inquirer.prompt([
      {
        type: "list",
        message: "Only empty departments can be removed. Choose from the following:",
        choices: [...departmentNames, "(cancel)"],
        name: "department"
      }
    ])
    
    if ("(cancel)" !== department) {
      await departments.remove(department)
    }
  } else {
    console.log("\nThere are no empty departments eligible for removal.\n")
  }
  promptMainMenu()
}

async function removeRole() {
  const roleTitles = await roles.getUnassigned()

  if (roleTitles.length) {
    const {roleTitle} = await inquirer.prompt([
      {
        type: "list",
        message: "Only empty roles can be removed. Choose from the following:",
        choices: [...roleTitles, "(cancel)"],
        name: "roleTitle"
      }
    ])
    
    if ("(cancel)" !== roleTitle) {
      await roles.remove(roleTitle)
    }
  } else {
    console.log("\nThere are no empty roles eligible for removal.\n")
  }
  promptMainMenu()
}

async function setRoleSalary() {
  const
    roleTitles = await roles.getAll(),
    {roleTitle, salary} = await inquirer.prompt([
      {
        type: "list",
        message: "Which role's salary would you like to update?",
        choices: roleTitles,
        name: "roleTitle"
      },
      {
        message: "What should the new salary be?",
        name: "salary"
      }
    ])
  
  await roles.setSalary(roleTitle, salary)
  promptMainMenu()
}


async function addEmployee() {
  const
    managerNames = await employees.getAllFullNames(),
    roleNames = roles.getAll()

  const {givenName, surname, roleName, managerName} =
    await inquirer.prompt([
      {
        message: "What is the employee's given name?",
        name: "givenName"
      },
      {
        message: "What is the employee's surname?",
        name: "surname"
      },
      {
        type: "list",
        message: "What is the employee's role?",
        choices: roleNames,
        name: "roleName"
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        choices: [...managerNames, "(none)"],
        name: "managerName"
      }
    ])
    
  await database.addEmployee(givenName, surname, roleName, managerName)
  promptMainMenu()
}

async function removeEmployee() {
  const employeeNames = await employees.getNonManagerFullNames()

  const {employeeName} = await inquirer.prompt([
    {
      type: "list",
      message: "You can only remove employees without direct reports. Which would you like to remove?",
      choices: [...employeeNames, "(cancel)"],
      name: "employeeName"
    }
  ])
  
  if ("(cancel)" !== employeeName) {
    await database.removeEmployee(employeeName)
  }
  promptMainMenu()
}

async function setEmployeeRole() {
  const
    employeeNames = await employees.getAllFullNames(),
    roleTitles = await roles.getAll()

  const {employeeName, roleTitle} = await inquirer.prompt([
    {
      type: "list",
      message: "Who is the employee's manager?",
      choices: employeeNames,
      name: "employeeName"
    },
    {
      type: "list",
      message: "What is the employee's new role?",
      choices: roleTitles,
      name: "roleTitle"
    }
  ])

  await database.setEmployeeRole(employeeName, roleTitle)
  promptMainMenu()
}


async function setEmployeeManager() {
  const
    employeeNames = await employees.getAllFullNames(),
    {employeeName, managerName} = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee's manager do you want to change?",
        choices: employeeNames,
        name: "employeeName"
      },
      {
        type: "list",
        message: "Who is the new employees manager?",
        choices: [...employeeNames, "(none)"],
        name: "managerName"
      }
    ])

  if (employeeName === managerName) {
    console.log("\nSadly, an employee cannot be their own manager.\n")
  } else {
    await employees.setManager(employeeName, managerName)
  }
  promptMainMenu()
}


async function viewAllEmployees() {
  showTable(await employees.getAll())
}


async function viewEmployeesByDepartment() {
  const departmentNames = await departments.getAll()

  const {department} = await inquirer.prompt([
    {
      type: "list",
      message: "Which department's employees would you like to view?",
      choices: departmentNames,
      name: "department"
    }
  ])
  
  showTable(await employees.getByDepartment(department))
}


async function viewEmployeesByManager() {
  const
    managerNames = await employees.getManagerFullNames(),
    {manager} = await inquirer.prompt([
      {
        type: "list",
        message: "Which manager's employees would you like to view?",
        choices: managerNames,
        name: "manager"
      }
    ])
  showTable(await employees.getByManager(manager))
}


async function viewSalariesByDepartment() {
  showTable(await departments.getSalaryTotalTable())
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
    action: () => database.close()
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
      menuItem: "Add employee",
      action: addEmployee  
    },
    {
      menuItem: "Remove employee",
      action: removeEmployee
    },
    {
      menuItem: "Change an employee's role",
      action: setEmployeeRole
    },
    {
      menuItem: "Change an employee's manager",
      action: setEmployeeManager
    }
  ]
}


module.exports = {
  promptMainMenu,
}
