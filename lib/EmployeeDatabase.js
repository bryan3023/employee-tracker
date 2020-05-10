const mysql = require("mysql")

class EmployeeDatabase {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "bryan3023.employee_tracker",
      password: "1L5i%KV&^@jc7LFe5c5C",
      database: "employee_tracker_DB"
    })

    this.connection.connect((error) => {
      if (error) throw error
    });
  }

  async close() {
    this.connection.end()
  }


  async getAllDepartments() {
    const selectAllDepartments = "SELECT * FROM v_departments ORDER BY Name"
    return await this.query(selectAllDepartments)
  }

  async getAllRoles() {
    const selectAllRoles = "SELECT * FROM v_roles ORDER BY Title"
    return await this.query(selectAllRoles)
  }

  async getAllEmployees() {
    const selectAllEmployees =
      "SELECT * FROM v_employees ORDER BY Department, Surname, 'Given Name'"
    return await this.query(selectAllEmployees)
  }

  async getAllManagers() {
    const selectAllManagers =
      "SELECT DISTINCT manager FROM v_employees ORDER BY manager"
    return await this.query(selectAllManagers)
  }

  async getSalaryByDepartment() {
    const selectSalaryByDepartment =
      "SELECT * FROM v_salaries_by_department ORDER BY Department"
    return await this.query(selectSalaryByDepartment)
  }

  getEmployeesByDepartment(departmentName) {
    const whereDepartment = { department: departmentName}
    return this.getEmployees(whereDepartment)
  }

  getEmployeesByManager(managerName) {
    const whereManager = { manager: managerName}
    return this.getEmployees(whereManager)
  }

  async addDepartment(departmentName) {
    const
      insertDepartment = "INSERT INTO department SET ?",
      department = { name: departmentName }
    await this.query(insertDepartment, department)
  }

  async removeDepartment(departmentName) {
    const
      deleteDepartment = "DELETE FROM department WHERE ?",
      department = { name: departmentName }
    await this.query(deleteDepartment, department)
  }

  async getDepartmentsWithoutRoles() {
    const departmentsWithoutRoles = "SELECT * FROM v_department_unused"
    return await this.query(departmentsWithoutRoles)
  }


  async getRolesWithoutEmployees() {
    const rolesWithoutEmployees = "SELECT * FROM v_roles_unused"
    return await this.query(rolesWithoutEmployees)
  }


  async addRole(title, salary, departmentName) {
    const
      insertRole = "INSERT INTO role SET ?",
      departmentId = await this.getDepartmentIdByName(departmentName),
      role = {
        title: title,
        salary: salary,
        department_id: departmentId
      }
    await this.query(insertRole, role)
  }

  async removeRole(roleName) {
    const
      deleteRole = "DELETE FROM role WHERE ?",
      whereName = { title: roleName }
    await this.query(deleteRole, whereName)
  }

  async setRoleSalary(roleName, salary) {
    const
      updateRole = "UPDATE role SET ? WHERE ?",
      salaryByTitle = [
        { salary: salary },
        { title: roleName }
      ]
    await this.query(updateRole, salaryByTitle)
  }

  // -- Private methods --

  async getDepartmentIdByName(departmentName) {
    const
      selectDepartment = "SELECT id FROM department WHERE ?",
      whereName = { name: departmentName }
    return (await this.query(selectDepartment, whereName))[0].id
  }

  async getRoleIdByName(roleName) {
    const
      selectRole = "SELECT id FROM role WHERE ?",
      whereTitle = { title: roleName }
    return (await this.query(selectRole, whereTitle))[0].id
  }

  async getEmployees(whereCondition) {
    const selectEmployees = "SELECT * FROM v_employees WHERE ?"
    return await this.query(selectEmployees, whereCondition)
  }

  query(queryString, conditions) {
    return new Promise((resolve, reject) => {
      const queryCallback = (error, results) => {
        return error ? reject(error) : resolve(results)
      }
      if (conditions !== undefined) {
        this.connection.query(queryString, conditions, queryCallback)
      } else {
        this.connection.query(queryString, queryCallback)
      }
    })
  }
}

module.exports = EmployeeDatabase