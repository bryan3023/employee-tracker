USE employee_tracker_DB;

INSERT INTO department
  (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal')
;

SELECT @salesID := id FROM department WHERE name = 'Sales';
SELECT @engineeringID := id FROM department WHERE name = 'Engineering';
SELECT @financeID := id FROM department WHERE name = 'Finance';
SELECT @legalID := id FROM department WHERE name = 'Legal';

INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Sales Lead', 100000, @salesID),
  ('Salesperson', 75000, @salesID),
  ('Lead Engineer', 150000, @engineeringID),
  ('Software Engineer', 120000, @engineeringID),
  ('Accountant', 125000, @financeID),
  ('Legal Team Lead', 250000, @legalID),
  ('Lawyer', 150000, @legalID)
;


SELECT @salesLeadID := id FROM role WHERE title = 'Sales Lead';
SELECT @salespersonID := id FROM role WHERE title = 'Salesperson';
SELECT @leadEngineeerID := id FROM role WHERE title = 'Lead Engineer';
SELECT @softwareEngineerID := id FROM role WHERE title = 'Software Engineer';
SELECT @accountantID := id FROM role WHERE title = 'Accountant';
SELECT @LegalTeamLeadID := id FROM role WHERE title = 'Legal Team Lead';
SELECT @lawyerID := id FROM role WHERE title = 'Lawyer';

INSERT INTO employee
  (given_name, surname, role_id)
VALUES
  ('John', 'Doe', @salesLeadID),
  ('Mike', 'Chan', @salespersonID),
  ('Ashley', 'Rodriguez', @leadEngineeerID),
  ('Kevin', 'Tupik', @softwareEngineerID),
  ('Malia', 'Brown', @accountantID),
  ('Sarah', 'Lourd', @LegalTeamLeadID),
  ('Tom', 'Allen', @lawyerID)
;

SELECT @arodriguezID := id FROM employee WHERE surname = 'Rodriguez';
SELECT @jdoeID := id FROM employee WHERE surname = 'Doe';
SELECT @slourdID := id FROM employee WHERE surname = 'lourd';
SELECT @mchanID := id FROM employee WHERE surname = 'Chan';

UPDATE employee
SET
  manager_id = @arodriguezID
WHERE
  surname = 'Doe'
  OR surname = 'Tupik';

UPDATE employee
SET
  manager_id = @jdoeID
WHERE
  surname = 'Chan';

UPDATE employee
SET
  manager_id = @slourdID
WHERE
  surname = 'Allen';


select * from department;
select * from role;
select * from employee;
select * from employee_summary;
