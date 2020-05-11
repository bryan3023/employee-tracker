/*
  Manages operations around the employee table.
 */
class EmployeeManager {

  constructor(database) {
    this.database = database
    this.displayColumns =
      "ID, 'Given Name', Surname, Title, Department, Salary, Manager"
  }


  // --- Get tables ---

  /*
    Get full employees report.
   */
  async getTable() {
    const selectAllEmployees =
      `SELECT ${this.displayColumns} FROM v_employees ORDER BY Department, Surname, 'Given Name'`
    return await this.database.query(selectAllEmployees)
  }


  /*
    Get all employees within a given department.
   */
  getTableByDepartment(departmentName) {
    const whereDepartment = { department: departmentName}
    return this.getWhere(whereDepartment)
  }


  /*
    Get all employees under a given manager.
   */
  getTableByManager(managerId) {
    const whereManager = { manager_id: managerId}
    return this.getWhere(whereManager)
  }


  // --- Get name/value lists ---

  /*
    Get the full names of all employees.
   */
  async getListAll() {
    return this.getNameList("employee")
  }


  /*
    Get the full names of everyone with at least one direct report.
   */
  async getListManagers() {
    return this.getNameList("v_employees_managers")
  }


  /*
    Get the full names for everyone without at least one direct report.
   */
  async getListNonManagers() {
    return this.getNameList("v_employees_nonmanagers")
  }


  // --- Modifiers ---

  /*
    Add an employee.
   */
  async add(givenName, surname, roleId, managerId) {
    const
      insertEmployee = "INSERT INTO employee SET ?",
      employee = {
        given_name: givenName,
        surname: surname,
        role_id: roleId,
        manager_id: this.nullId(managerId)
      }

    await this.database.query(insertEmployee, employee)
  }


  /*
    Remove an employee.
   */
  async remove(employeeId) {
    const deleteEmployee ="DELETE FROM employee WHERE id = ?"
    await this.database.query(deleteEmployee, employeeId)
  }


  /*
    Change an employee's role.
   */
  async setRole(employeeId, roleId) {
    const updateEmployee = "UPDATE employee SET role_id = ? WHERE id = ?"
    await this.database.query(updateEmployee, [roleId, employeeId])
  }


  /*
    Change an employee's manager.
   */
  async setManager(employeeId, managerId) {
    const updateEmployee = "UPDATE employee SET manager_id = ? WHERE id = ?"
    await this.database.query(updateEmployee,
      [this.nullId(managerId), employeeId])
  }


  // --- Validator ---

  /*
    Validate names are in range.
   */
  validateName(text) {
    return this.database.validateVarchar(text, 30)
  }


  // --- Private methods ---

  /*
    Assume any ID value less than 1 should be NULL.
   */
  nullId(id) {
    return (id > 0) ? id : null
  }


  /*
    Get results from the employees view based on provided condition.
   */
  async getWhere(condition) {
    const selectEmployees = `SELECT ${this.displayColumns} FROM v_employees WHERE ?`
    return await this.database.query(selectEmployees, condition)
  }


  /*
    Return a list of IDs/FullNames from specified table.
   */
  async getNameList(table) {
    const
      selectEmployees =
        `SELECT id, CONCAT(given_name, ' ', surname) AS name FROM ${table}`,
      employees = await this.database.query(selectEmployees)

    return this.database.getSortedPromptList(employees, "name")
  }
}

module.exports = EmployeeManager