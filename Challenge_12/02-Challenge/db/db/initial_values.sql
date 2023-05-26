INSERT INTO department
(name)
VALUES
('engineering'),
('sales'),
('finance'),
('legal');

INSERT INTO role
(title,salary,department_id)
VALUES
('Sales Lead',100000, 2),
('Salesperson', 80000, 2),
('Lead Engineer', 150000, 1),
('Software Enginerr', 120000, 1),
('Account Manager', 160000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, 1),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, 1),
('Kevin','Tupkin', 4, 3),
('Kunal','Singh', 5, 1),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, 1),
('Tom','Allen', 8, 7);



