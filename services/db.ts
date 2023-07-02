import mysql from "mysql";
import colors from "colors";

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(
      colors.red("[DB] Error connecting to MySQL:"),
      err.sqlMessage
    );
    return;
  }

  console.log(colors.green("[DB] Connected to MySQL."));
});


export default db;
