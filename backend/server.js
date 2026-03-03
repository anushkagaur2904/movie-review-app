import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "1234",  // your MySQL password
  database: "movie_db",
  port: 3306
});

// ✅ Test API
app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

/* ---------------------------------------------------------
    ✅ REGISTER NEW USER
--------------------------------------------------------- */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // check if email already exists
  const [exists] = await pool.query(
    "SELECT email FROM users WHERE email = ?",
    [email]
  );

  if (exists.length > 0) {
    return res.json({ success: false, message: "Email already registered" });
  }

  const sql = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(sql, [name, email, password]);

  res.json({
    success: true,
    user_id: result.insertId,
    message: "Registration successful"
  });
});

/* ---------------------------------------------------------
    ✅ LOGIN USER
--------------------------------------------------------- */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT user_id, name, email 
    FROM users 
    WHERE email = ? AND password = ?
  `;

  const [rows] = await pool.query(sql, [email, password]);

  if (rows.length === 0) {
    return res.json({ success: false, message: "Invalid email or password" });
  }

  res.json({ success: true, user: rows[0] });
});

/* ---------------------------------------------------------
    ✅ MOVIE APIS
--------------------------------------------------------- */

// Get all movies
app.get("/movies", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM movies ORDER BY movie_id DESC"
  );
  res.json(rows);
});

// Add movie
app.post("/movies", async (req, res) => {
  const { title, release_year, description } = req.body;

  const sql = `
    INSERT INTO movies (title, release_year, description)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    title, release_year, description
  ]);

  res.json({ success: true, movie_id: result.insertId });
});

// Movie details
app.get("/movies/:id", async (req, res) => {
  const movieId = req.params.id;

  const [rows] = await pool.query(
    "SELECT * FROM movies WHERE movie_id = ?",
    [movieId]
  );

  res.json(rows[0]);
});

/* ---------------------------------------------------------
    ✅ REVIEWS
--------------------------------------------------------- */

app.get("/movies/:id/reviews", async (req, res) => {
  const movieId = req.params.id;

  const [rows] = await pool.query(
    `SELECT r.review_id, r.comment, r.created_at, u.name AS user_name
     FROM reviews r
     LEFT JOIN users u ON r.user_id = u.user_id
     WHERE r.movie_id = ?
     ORDER BY r.review_id DESC`,
    [movieId]
  );

  res.json(rows);
});

app.post("/movies/:id/reviews", async (req, res) => {
  const movieId = req.params.id;
  const { user_id, comment } = req.body;

  const sql = `
    INSERT INTO reviews (movie_id, user_id, comment)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(sql, [movieId, user_id, comment]);

  res.json({ success: true, review_id: result.insertId });
});

/* ---------------------------------------------------------
    ✅ RATINGS
--------------------------------------------------------- */

app.post("/movies/:id/rating", async (req, res) => {
  const movieId = req.params.id;
  const { user_id, rating } = req.body;

  const sql = `
    INSERT INTO ratings (movie_id, user_id, rating)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(sql, [movieId, user_id, rating]);

  res.json({ success: true, rating_id: result.insertId });
});

app.get("/movies/:id/rating", async (req, res) => {
  const movieId = req.params.id;

  const [rows] = await pool.query(
    "SELECT AVG(rating) AS average FROM ratings WHERE movie_id = ?",
    [movieId]
  );

  res.json({ average: rows[0].average });
});

/* ---------------------------------------------------------
    ✅ SEARCH
--------------------------------------------------------- */
app.get("/search", async (req, res) => {
  const q = req.query.q || "";

  const [rows] = await pool.query(
    "SELECT * FROM movies WHERE title LIKE ? OR description LIKE ?",
    [`%${q}%`, `%${q}%`]
  );

  res.json(rows);
});

/* ---------------------------------------------------------
    ✅ START SERVER
--------------------------------------------------------- */
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});