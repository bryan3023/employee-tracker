class EmployeeManager {
  constructor(database) {
    this.database = database
  }

  async getAll() {
    const selectAllEmployees =
      "SELECT * FROM v_employees ORDER BY Department, Surname, 'Given Name'"
    return await this.database.query(selectAllEmployees)
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
    Return the full names for everyone without at least one direct report.
   */
  async getNonManagerFullNames() {
    const
      selectNonManagerEmployees = "SELECT given_name, surname FROM v_employees_nonmanagers",
      nonManagers = await this.database.query(selectNonManagerEmployees)

    return this.getFullNames(nonManagers)
  }


  // --- Private methods ---

  /*
    Return a list of names in the format of "GivenName Surname".
   */
  getFullNames(employees) {
    return employees.map(e => `${e.given_name} ${e.surname}`)
  }
}

module.exports = EmployeeManager