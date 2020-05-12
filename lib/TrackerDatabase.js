const mysql = require("mysql")

/*
  Manages the database connection and provides utility functions to table managers.
 */
class TrackerDatabase {

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

  /*
    Close the connection when done.
   */
  async close() {
    this.connection.end()
  }


  /*
    Workhorse of the class. Runs queries and returns a promise for processing.
   */
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


  /*
    Transform a result set into an array of name/value objects for easy
    processing within inquirer list prompts,
    
    The name property will be the column name specified. The value will
    be the record's ID.
   */
  getSortedPromptList(resultSet, nameColumn) {
    const
      sortPromptList = (a,b) => a.name.localeCompare(b.name),
      promptList = resultSet.map(rs => {
        return {
          name: rs[nameColumn],
          value: rs.id || rs.ID
        }
      }).sort(sortPromptList)

    return promptList
  }


  // --- Validators ---

  /*
    Is the string within the specified length?
   */
  validateVarchar(text, length) {
    return text.trim() && text.trim().length <= length ?
      true :
      `Please enter a text value of no more than ${length} characters`
  }


  /*
    Does the number meet decimal length and precision requirements?
   */
  validateDecimal(text, precision, decimalLength) {
    const
      trimmedText = text.trim(),
      [whole, decimal] = trimmedText.split("."),

      validDecimal =
        this.isFloatOrInteger(trimmedText) &&
        this.isDecimalPartCompliant(decimal, decimalLength) &&
        this.isDecimalPrecisionCompliant(whole, precision, decimalLength)

    return validDecimal ?
      true :
      `Please enter a number with no more than ${decimalLength} decimal points and ${precision} total digits`
  }


  // --- Private methods ---

  /*
    Does the number match either a positive float or integer pattern?
    (Exponential formats not supported.)
   */
  isFloatOrInteger(text) {
    const
      floatRegex = text.match(/^(\d*\.)?\d+$/),
      integerRegex = text.match(/^\d+$/)

    return (floatRegex || integerRegex) ? true : false
  }


  /*
    Is the decimal part within the specified length?
   */
  isDecimalPartCompliant(decimal, decimalLength) {
    return decimal ? decimal.length <= decimalLength : true
  }


  /*
    Is the whole part within the range allowed by the preecsion?
   */
  isDecimalPrecisionCompliant(whole, precision, decimalLength) {
    const
      wholeDigits = precision - decimalLength,
      maxValue = (10 ** wholeDigits) - 1
    return parseInt(whole) <= maxValue
  }
}

module.exports = TrackerDatabase
