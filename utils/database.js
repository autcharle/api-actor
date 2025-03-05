import mysql from "mysql2";
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

export default pool.promise();
