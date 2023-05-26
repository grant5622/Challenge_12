const sqlTwo = require("mysql2");
const db = sqlTwo.createConnection({
    host: "localHost",
    user: "root",
    password: "",
    database: "employeeTrackerDB",
});
module.export = db;
