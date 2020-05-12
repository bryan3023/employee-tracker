/*
  Manages operations around the department table.
 */
class DepartmentModel {

  constructor(database) {
    this.database = database
  }


  // --- Get tables ---

  /*
    Get all departments.
   */
  async getTable() {
    const selectAllDepartments = "SELECT * FROM v_departments"
    return await this.database.query(selectAllDepartments)
  }


  /*
    Get the sum total of salaries for each department.
   */
  async getTableSalaryTotal() {
    const selectSalaryByDepartment =
      "SELECT * FROM v_salaries_by_department ORDER BY Department"
    return await this.database.query(selectSalaryByDepartment)
  }


  // --- Get name/value lists ---

  /*
    Get all department.
   */
  async getListAll() {
    const departments = await this.getTable()
    return this.database.getSortedPromptList(departments,"Name")
  }


  /*
    Get departments with no roles assigned to them.
   */
  async getListEmpty() {
    const
      departmentsWithoutRoles = "SELECT * FROM v_departments_unused",
      empty = await this.database.query(departmentsWithoutRoles)

    return this.database.getSortedPromptList(empty, "Department")
  }


  // --- Get list of names ---

  /*
    Get names of all departments.
   */
  async getNamesAll() {
    const departments = await this.getTable()
    return this.getSortedNames(departments)
  }


  // --- Modifiers ---

  /*
    Add a department.
   */
  async add(departmentName) {
    const insertDepartment = "INSERT INTO department SET name = ?"
    await this.database.query(insertDepartment, departmentName)
  }


  /*
    Remove a department.
   */
  async remove(departmentId) {
    const deleteDepartment = "DELETE FROM department WHERE id = ?"
    await this.database.query(deleteDepartment, departmentId)
  }


  // --- Validators ---

  /*
    Validate department name.
   */
  validateName(name) {
    return this.database.validateVarchar(name, 30)
  }

  // --- Private methods ---

  /*
    Get a list of names from a result set.
   */
  getSortedNames(departments) {
    return departments.map(d => d.Name).sort()
  }
}

module.exports = DepartmentModel