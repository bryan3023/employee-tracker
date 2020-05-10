const
  { promptMainMenu } = require("./lib/EmployeeInquirer"),
  asciiArtLogo = require("asciiart-logo")


/*
  Program entry point.
 */
function init() {
  showSplash()
  promptMainMenu()
}


/*
  Show a splash header. If you're going BBS, go big!
 */
function showSplash() {
  const logo = asciiArtLogo({
    name: "Employee Tracker",
    version: "COVID-19",
    description: "They can't leave their homes - it's like fish in a barrel!"
  }).render()

  console.log(logo)
}


init()
