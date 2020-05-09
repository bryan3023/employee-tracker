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

  close() {
    this.connection.end()
  }

  async getFullEmployeeListing() {
    const selectFullEmployees = "SELECT * FROM v_employees_full"
    return await this.query(selectFullEmployees)
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