require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Connected!", res.rows[0]);
  }
  pool.end();
});
