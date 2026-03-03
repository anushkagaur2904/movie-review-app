<h1>Movie Review Application</h1>
This is a full-stack web application that allows users to browse movies, search for specific titles, register/login, and leave reviews and ratings. It uses a Node.js/Express backend with a MySQL database and a Vanilla JavaScript frontend.

<h1>🚀 Features</h1>
<b>User Authentication:</b> Register and login functionality.

<b>Movie Management:</b> Browse a list of movies and view detailed descriptions.

<b>Reviews:</b> Users can write comments on movies.

<b>Ratings:</b> Users can rate movies, and the app calculates the average score.

<b>Search:</b> Real-time search by title or description.

<h1>🛠️ Tech Stack
</h1>
<b>Frontend:</b> HTML5, CSS3, Vanilla JavaScript (Fetch API)

<b>Backend:</b> Node.js, Express.js

<b>Database:</b> MySQL

<b>Dependencies:</b> cors, mysql2, express

<h1>🛣️ API Endpoints</h1>

| **Method** | **Endpoint**        | **Description**             |
| ---------- | ------------------- | --------------------------- |
| POST       | /register           | Create a new user account   |
| POST       | /login              | Authenticate user           |
| GET        | /movies             | Get list of all movies      |
| POST       | /movies             | Add a new movie to the DB   |
| GET        | /movies/:id         | Get specific movie details  |
| GET        | /movies/:id/reviews | Get all reviews for a movie |
| POST       | /movies/:id/rating  | Submit a star rating        |
| GET        | /search?q=...       | Search movies by query      |
