/*
  Manages operations around the role table.
 */
class RoleManager {

  constructor(database) {
    this.database = database
  }


  // --- Get tables ---

  /*
    Get the complete table for display.
   */
  async getTable() {
    const selectAllRoles = "SELECT * FROM v_roles"
    return await this.database.query(selectAllRoles)
  }


  // -- Get name/value lists ---

  /*
    Get all role titles.
   */
  async getListAll() {
    return this.getTitleList("v_roles")
  }

  
  /*
    Get all role titles with no employees assigned to them.
   */
  async getListUnassigned() {
    return this.getTitleList("v_roles_unused")
  }


  // --- Modifiers ---

  /*
    Add a role.
   */
  async add(title, salary, departmentId) {
    const
      insertRole = "INSERT INTO role SET ?",
      role = {
        title: title,
        salary: salary,
        department_id: departmentId
      }
    await this.database.query(insertRole, role)
  }


  /*
    Remove a role.
   */
  async remove(roleId) {
    const deleteRole = "DELETE FROM role WHERE id = ?"
    await this.database.query(deleteRole, roleId)
  }


  /*
    Set a role's salary.
   */
  async setSalary(roleId, salary) {
    const updateRole = "UPDATE role SET salary = ? WHERE id = ?"
    await this.database.query(updateRole, [salary, roleId])
  }


  // --- Validators ---

  /*
    Validate a roles title is within a specified length.
   */
  validateTitle(title) {
    return this.database.validateVarchar(title, 30)
  }


  /*
    Validate a role's salary is within a specified range.
   */
  validateSalary(salary) {
    return this.database.validateDecimal(salary, 8, 2)
  }


  // --- Private methods ---

  /*
    Get a list of name/value objects from the specified table.
   */
  async getTitleList(table) {
    const
      selectRoles = `SELECT id, Title FROM ${table}`,
      roles = await this.database.query(selectRoles)

    return this.database.getSortedPromptList(roles, "Title")
  }
}

module.exports = RoleManager