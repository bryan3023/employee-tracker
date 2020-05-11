/*
  Manages operations around the role table.
 */
class RoleManager {
  constructor(database) {
    this.database = database
  }


  /*
    Return the complete table for display.
   */
  async getTable() {
    const selectAllRoles = "SELECT * FROM v_roles"
    return await this.database.query(selectAllRoles)
  }


  /*
    Return all role titles.
   */
  async getAll() {
    const roles = await this.getTable()
    return this.getSortedTitles(roles)
  }

  
  /*
    Return all role titles with no employees assigned to them.
   */
  async getUnassigned() {
    const
      rolesWithoutEmployees = "SELECT * FROM v_roles_unused",
      emptyRoles = await this.database.query(rolesWithoutEmployees)

    return this.getSortedTitles(emptyRoles)
  }

  async remove(roleTitle) {
    const
      deleteRole = "DELETE FROM role WHERE ?",
      whereTitle = { title: roleTitle }
    await this.database.query(deleteRole, whereTitle)
  }

  async setSalary(roleTitle, salary) {
    const
      updateRole = "UPDATE role SET ? WHERE ?",
      salaryByTitle = [
        { salary: salary },
        { title: roleTitle }
      ]
    await this.database.query(updateRole, salaryByTitle)
  }

  // -- Private methods --

  getSortedTitles(roles) {
    return roles.map(r => r.Title).sort()
  }
}

module.exports = RoleManager