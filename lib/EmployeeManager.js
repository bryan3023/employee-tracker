class EmployeeManager {
  constructor(database) {
    this.database = database
  }

  async getAll() {
    const selectAllEmployees =
      "SELECT * FROM v_employees ORDER BY Department, Surname, 'Given Name'"
    return await this.database.query(selectAllEmployees)
  }


  getByDepartment(departmentName) {
    const whereDepartment = { department: departmentName}
    return this.getWhere(whereDepartment)
  }

  getByManager(managerName) {
    const whereManager = { manager: managerName}
    return this.getWhere(whereManager)
  }


  /*
    Get the full names of all employees.
   */
  async getAllFullNames() {
    const
      selectAllEmployees = "SELECT given_name, surname FROM employee",
      allEmployees = await this.database.query(selectAllEmployees)

    return this.getFullNames(allEmployees)
  }


  /*
    Return the full names of everyone with at least one direct report.
   */
  async getManagerFullNames() {
    const
      selectAllManagers = "SELECT given_name, surname FROM v_employees_managers",
      managers = await this.database.query(selectAllManagers)

    return this.getFullNames(managers)
  }


  /*
    Return the full names for everyone without at least one direct report.
   */
  async getNonManagerFullNames() {
    const
      selectNonManagers = "SELECT given_name, surname FROM v_employees_nonmanagers",
      nonManagers = await this.database.query(selectNonManagers)

    return this.getFullNames(nonManagers)
  }


  async setManager(employeeName, managerName) {
    const
      updateEmployee = "UPDATE employee SET ? WHERE ?",
      employeeId = await this.getIdFromFullName(employeeName),
      managerId = await this.getIdFromFullName(managerName),
      managerIdById = [
        { manager_id: managerId },
        { id: employeeId }
      ]
    await this.database.query(updateEmployee, managerIdById)
  }


  // --- Private methods ---


  async getIdFromFullName(fullName) {
    const selectEmployee = `SELECT id FROM employee WHERE CONCAT(given_name, ' ', surname) = '${fullName}'`
    return (await this.database.query(selectEmployee))[0].id
  }


  async getWhere(condition) {
    const selectEmployees = "SELECT * FROM v_employees WHERE ?"
    return await this.database.query(selectEmployees, condition)
  }


  /*
    Return a list of names in the format of "GivenName Surname".
   */
  getFullNames(employees) {
    return employees.map(e => `${e.given_name} ${e.surname}`)
  }
}

module.exports = EmployeeManager