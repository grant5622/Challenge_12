const inquirer = require("inquirer");
const express = require('express');
const sqlTwo = require("mysql2");

const db = sqlTwo.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employeeTrackerDB',
    
},
console.log(`Connected to the movies_db database.`)
);

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use((req, res) => { 
    res.status(404).end();
});
const PORT = process.env.PORT || 3000;

app.listen(3306,  () => {});

employee_tracker();

function employee_tracker() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do',
        choices: ['Add Employee', 'Add Role', 'View All Employees', 'Update Employee Role', 'View All Roles', 'View All Departments', 'Add Department','Quit']

    }]).then((choice)=>{
        switch(choice.action){
            case "View All Roles":
                db.query(`SELECT * FROM role`, (error, res)=>{
                    if (error) throw error;
                    console.log("viewing all roles");
                    console.table(res);
                    employee_tracker();
                });
                break;
            case "View All Departments":
                db.query(`SELECT * FROM department`, (error, res)=>{
                    if (error) throw error;
                    console.log("Viewing All Departments");
                    console.table(res);
                    employee_tracker();
                });
                break;
            case "View All Employees":
                db.query(`SELECT * FROM employee`, (error, res)=>{
                    if (error) throw error;
                    console.log("Viewing All Employees");
                    console.table(res);
                    employee_tracker();
                });
                break;
            case "Add Department":
                inquirer.prompt([{
                    type: 'input',
                    name: 'newDepartment',
                    message: 'What is the name of the department',
                    validate: department => {
                        if (department){
                            return true;
                        
                        }
                        else{
                            console.log("you did not enter a department");
                            return false;
                        }
                    }
                }]).then((responses)=>{
                    db.query(`INSERT INTO department (name) VALUES (?)`, [responses.newDepartment], (error,res)=>{
                        if (error) throw error;
                        console.log(`added ${responses.newDepartment} to database.`);
                        employee_tracker();
                    });
                });
                break;
            case "Add Role":
                db.query(`SELECT * FROM department`, (error,res)=>{
                    if (error) throw error;
                    inquirer.prompt([{
                        type: 'input',
                        name: 'newRole',
                        message: 'What is the name of the role',
                        validate: role => {
                            if (role){
                                return true;
                                
                            }
                            else{
                                console.log("you did not enter a role");
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role',
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'choose which department',
                        choices: ()=>{
                            let choices =[];
                            for (let i=0; i<res.length; i++ /*i = i + 1; */){
                                choices.push(res[i].name);
                            }
                            //    0               1               2
                            // res: [{1, Law}, {2, Engineering}, {3, Sales}] length = 3;
                            // choices: [Law, Engineering, Sales] length = 3;
                            return choices;
                        }
                    }
                ]).then((responses)=>{
                    let id= -1;
                    for (let i=0; i<res.length; i++){
                        if (res[i].name===responses.department){
                            id = res [i].id;
                        }
                    }
                        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,  [responses.newRole,responses.salary, id] ,(error,res)=>{
                            if (error) throw error;
                            console.log(`added ${responses.newRole} to database.`);
                            employee_tracker();
                        });
                    });
                });
                break;
            case "Add Employee":
                db.query(`SELECT * FROM role`, (error,res)=>{
                    if (error) throw error;
                    inquirer.prompt([{
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the first name of the employee',
                        validate: firstName => {
                            if (firstName){
                                return true;
                                
                            }
                            else{
                                console.log("you did not enter first name");
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the last name of the employee',
                        validate: lastName => {
                            if (lastName){
                                return true;
                                
                            }
                            else{
                                console.log("you did not enter last name");
                                return false;
                            }
                        }
                    },
                    
                    {
                        type: 'list',
                        name: 'role',
                        message: 'choose which role',
                        choices: ()=>{
                            let choices =[];
                            for (let i=0; i<res.length; i++ /*i = i + 1; */){
                                choices.push(res[i].title);
                            }
                            //    0               1               2
                            // res: [{1, Law}, {2, Engineering}, {3, Sales}] length = 3;
                            // choices: [Law, Engineering, Sales] length = 3;
                            return choices;
                        }
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'who is the employees manager',
                        choices: ()=>{
                            return new Promise ((resolve, reject) => { 
                                let choice=[];
                                db.query(`SELECT * FROM employee`, (error, employee_res)=>{
                                    if(error) throw error;
                                    console.log("made it into db.query");
                                    for (let i=0; i<employee_res.length; i++ /*i = i + 1; */){
                                        choice.push(employee_res[i].first_name +" " +employee_res[i].last_name);
                                    }
                                    resolve(choice);
                                });
                            });
                        }
                    }
                    ]).then((responses)=>{
                        async function insertEmployee() { 
                            let managerId= -1;
                            let roleId= -1;
                            try { 
                                const employee = await new Promise ((resolve, reject) => { 
                                    db.query(`SELECT * FROM employee`, (error, res)=>{
                                        if(error) throw error;
                                        resolve(res);
                                    });
                                });

                                for (let i=0; i<employee.length; i++ /*i = i + 1; */){
                                    const fullName = employee[i].first_name +" " +employee[i].last_name;
                                    if (fullName===responses.manager){
                                        managerId = employee[i].id;
                                    }
                                }
                                const role = await new Promise ((resolve, reject) => { 
                                    db.query(`SELECT * FROM role`, (error, res)=>{
                                        if(error) throw error;
                                        resolve(res);
                                    });
                                });
                                for (let i=0; i<role.length; i++){
                                    if (role[i].title===responses.role){
                                        roleId = role [i].id;
                                    }
                                }
                                await new Promise ((resolve, reject) => { 
                                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,  [responses.firstName,responses.lastName,roleId, managerId] ,(error,res)=>{
                                        if (error) throw error;
                                        resolve();
                                    });
                                });

                                console.log(`added ${responses.firstName} ${responses.lastName} to database.`);
                                employee_tracker();

                            } catch (error) { 
                                console.error(error);
                            }
             
                        } 
                        insertEmployee();
                    });
                });
                break;
            case 'Update Employee Role':
                db.query(`Select * FROM employee`, (error, res)=> { 
                    inquirer.prompt([{
                        type: 'list',
                        name: 'fullName',
                        message: 'Which employee would you like to update',
                        choices: ()=>{
                            let choices = [];
                            for (let i=0; i<res.length; i++ /*i = i + 1; */){
                                const fullName = res[i].first_name + " " + res[i].last_name;
                                choices.push(fullName);
                            }
                            return choices;
                        }


                    },
                    {
                        type: 'list',
                        name: 'updatedRole',
                        message: 'which role do you want to assign the selected employee',
                        choices: ()=>{
                            return new Promise((resolve,reject)=>{
                                let choices = [];

                            db.query(`SELECT * FROM role`, (error, res)=> {
                               
                            for (let i=0; i<res.length; i++ /*i = i + 1; */){
                                const newRole = res [i].title;
                                choices.push(newRole);
                            }
                            resolve(choices);
                            });
                            });
                            
                        } 
                    }

                    ]).then((responses)=>{
                        let roleId = -1;
                        db.query(`SELECT * FROM role`, (error, res)=> {
                               
                            for (let i=0; i<res.length; i++ /*i = i + 1; */){
                                if (responses.updatedRole===res[i].title){
                                    roleId = res[i].id;
                                }
                            }
                            const splitted = responses.fullName.split(" ");
                        // responses.fullName = John Doe
                        //              0      1
                        // splitted = [John, Doe];
                        db.query(`UPDATE employee SET ? WHERE ?`, [{role_id:roleId}, {last_name:splitted[1]}], (error, res) => { 
                            if (error) throw error;
                            console.log(`updated in the database ${splitted[0]} ${splitted[1]}.`);
                            employee_tracker();
                        });
                            });
                            
                        
                    });
                });
                break;
            case 'Quit':
                db.end();
                process.exit();
                
        }
    });
}


