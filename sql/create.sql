--
--  Create Employee Tracker Database
--
--  Create database and user account for running the application.
--

DROP DATABASE IF EXISTS employee_tracker_DB;
CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;


-- Create tables --

CREATE TABLE department (
  id
    INT
    NOT NULL
    AUTO_INCREMENT
    PRIMARY KEY,

  name
    VARCHAR(30)
    NOT NULL
);


CREATE TABLE role (
  id
    INT
    NOT NULL
    AUTO_INCREMENT
    PRIMARY KEY,

  title
    VARCHAR(30)
    NOT NULL,

  salary
    DECIMAL(8,2)
    NOT NULL,

  department_id
    INT
    NOT NULL,

  CONSTRAINT FK_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);


CREATE TABLE employee (
  id
    INT
    NOT NULL
    AUTO_INCREMENT
    PRIMARY KEY,

  given_name
    VARCHAR(30)
    NOT NULL,

  surname
    VARCHAR(30)
    NOT NULL,

  role_id
    INT
    NOT NULL,
  
  manager_id
    INT
    NULL,

  CONSTRAINT FK_role
    FOREIGN KEY (role_id)
    REFERENCES role(id),

  CONSTRAINT FK_manager
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);


-- Create views --

CREATE VIEW v_departments AS
  -- This isn't strictly necessary, but ensures column names are
  -- capitalized in the UI.
  SELECT
    ID,
    Name
  FROM
    department
;


CREATE VIEW v_roles AS
  SELECT
    r.id AS ID,
    r.title AS Title,
    r.salary AS Salary,
    d.name AS Department
  FROM
    role AS r
    INNER JOIN department AS d ON r.department_id = d.id
;


CREATE VIEW v_employees AS
  SELECT
    e.id AS ID,
    e.given_name AS 'Given Name',
    e.surname AS Surname,
    r.title AS Title,
    d.name AS Department,
    r.salary AS Salary,
    COALESCE(
      CONCAT(m.given_name, ' ', m.surname),
      '(none)')
      AS Manager
  FROM
    employee AS e
    INNER JOIN role AS r ON e.role_id = r.id
    INNER JOIN department AS d ON d.id = r.department_id
    LEFT OUTER JOIN employee AS m ON e.manager_id = m.id
;


CREATE VIEW v_salaries_by_department AS
  SELECT
    d.name AS Department,
    SUM(r.salary) AS 'Salaries Total'
  FROM
    department AS d
    INNER JOIN role AS r ON r.department_id = d.id
  GROUP BY
    d.name
;


-- Create account for connecting via Node.js --

CREATE
  USER 'bryan3023.employee_tracker'@'localhost'
  IDENTIFIED BY '1L5i%KV&^@jc7LFe5c5C'
;

GRANT
  SELECT, UPDATE, INSERT, DELETE
ON
  employee_tracker_DB . *
TO
  'bryan3023.employee_tracker'@'localhost'
;