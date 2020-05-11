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
    })
  }

  async close() {
    this.connection.end()
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


  async addEmployee(givenName, surname, roleName, managerName) {
    const
      insertEmployee = "INSERT INTO employee SET ?",
      roleId = await this.getRoleIdByName(roleName),
      employee = {
        given_name: givenName,
        surname: surname,
        role_id: roleId
      }
    if ("(none)" !== managerName) {
      const managerId = await this.getEmployeeIdByFullName(managerName)
      employee['manager_id'] = managerId;
    }
    await this.query(insertEmployee, employee)
  }

  async removeEmployee(employeeName) {
    const
      deleteEmployee ="DELETE FROM employee WHERE ?",
      employeeId = await this.getEmployeeIdByFullName(employeeName),
      employee = { id: employeeId }
    await this.query(deleteEmployee, employee)
  }


  async setEmployeeRole(employeeName, roleName) {
    const
      updateEmployee = "UPDATE employee SET ? WHERE ?",
      employeeId = await this.getEmployeeIdByFullName(employeeName),
      roleId = await this.getRoleIdByName(roleName),
      roleIdById = [
        { role_id: roleId },
        { id: employeeId }
      ]
    await this.query(updateEmployee, roleIdById)
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

  async getEmployeeIdByFullName(fullName) {
    const selectEmployee = `SELECT id FROM employee WHERE CONCAT(given_name, ' ', surname) = '${fullName}'`
    return (await this.query(selectEmployee))[0].id
  }


  query(queryString, conditions) {
    return new Promise((resolve, reject) => {
      const queryCallback =
        (error, results) => error ? reject(error) : resolve(results)

      if (conditions !== undefined) {
        this.connection.query(queryString, conditions, queryCallback)
      } else {
        this.connection.query(queryString, queryCallback)
      }
    })
  }
}

module.exports = EmployeeDatabase