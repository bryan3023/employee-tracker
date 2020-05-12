# Employee Tracker

## Synopsis

Manage employees, roles, and departments via a text-based interface.

## Description

This program presents a text-based menu for viewing, updating, and deleting items related to an organization's employees. You can:

* Create/delete departments, roles, and employees.
* Change the salary associated with a role.
* Change an employee's role or manager.
* View all departments, roles, and employees.
* View employees within a given department
* View employees reporting to a given manager.
* View the sum of salaries for all departments.

Referential integrity will be protected. For example:

* You cannot delete employees if they have at least one direct report.
* You cannot delete roles if at least one employee is assigned to them.
* You cannot delete departments if at least one role is assigned within it.

## Installation

First, once you've downloaded the repo, type:

```
npm install
```

Next, you need to setup the database. If you're on a Mac, you can run:

```
npm run create-db-mac
```

You'll need to provide the root password for your local MySQL instance. This will not be saved and you can review the script under `scripts\create_database.sh`.

I don't yet have the script setup for Windows, but you can run the SQL scripts manually via `sql\create.sql` and `sql\seed.sql`.

At this point, both the database and its service account are created.

Once you're done with the program, you can cleanly remove it. On the Mac, type:

```
npm run remove-db-mac
```

On Windows, run `sql\cleanup.sql`.

## Usage

Once installed, begin the program by typing:

```
npm run start
```

You'll then be presented with a menu. Choose your options and follow the prompts to complete tasks. Once complete, select `Exit` from the main menu.

## Testing

Again, no tests. :-(

I encountered a problem similar to as before: much of this program's functionality is tied to the state of both the database and the inquirer. I could have written tests for the handful of pure functions, like the validators, but I lost sight of that while working on the larger project.
