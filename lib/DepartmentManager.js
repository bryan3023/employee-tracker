/*
  Manages operations around the department table.
 */
class DepartmentManager {
  constructor(database) {
    this.database = database
  }

  async getTable() {
    const selectAllDepartments = "SELECT * FROM v_departments"
    return await this.database.query(selectAllDepartments)
  }


  async getSalaryTotalTable() {
    const selectSalaryByDepartment =
      "SELECT * FROM v_salaries_by_department ORDER BY Department"
    return await this.database.query(selectSalaryByDepartment)
  }


  async getAll() {
    const departments = await this.getTable()
    return this.getSortedNames(departments)
  }


  async getEmpty() {
    const
      departmentsWithoutRoles = "SELECT * FROM v_department_unused",
      empty = await this.database.query(departmentsWithoutRoles)

    return this.getSortedNames(empty)
  }


  async add(departmentName) {
    const
      insertDepartment = "INSERT INTO department SET ?",
      department = { name: departmentName }
    await this.database.query(insertDepartment, department)
  }

  async remove(departmentName) {
    const
      deleteDepartment = "DELETE FROM department WHERE ?",
      department = { name: departmentName }
    await this.database.query(deleteDepartment, department)
  }



  // -- Private methods --

  getSortedNames(departments) {
    return departments.map(d => d.Name).sort()
  }

}

module.exports = DepartmentManager