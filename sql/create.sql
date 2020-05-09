DROP DATABASE IF EXISTS employee_tracker_DB;
CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;


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


CREATE VIEW employee_summary AS
  SELECT
    e.id AS ID,
    e.given_name AS 'Given Name',
    e.surname AS Surname,
    r.title AS Title,
    d.name AS Department,
    r.salary AS Salary,
    CONCAT(m.given_name, ' ', m.surname) AS Manager
  FROM
    employee AS e
    INNER JOIN role AS r ON e.role_id = r.id
    INNER JOIN department AS d ON d.id = r.department_id
    LEFT OUTER JOIN employee AS m ON e.manager_id = m.id
;

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