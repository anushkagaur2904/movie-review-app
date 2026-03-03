const API = "http://localhost:3000";
let currentUser = null;

// Load all movies on start
window.onload = () => loadMovies();

/* ---------------------------------------------------------
    ✅ REGISTER USER
--------------------------------------------------------- */
document.getElementById("registerBtn").onclick = async function () {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    document.getElementById("register-status").textContent = data.message;
};

/* ---------------------------------------------------------
    ✅ LOGIN
--------------------------------------------------------- */
document.getElementById("loginBtn").onclick = async function () {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
        document.getElementById("login-status").textContent =
            "Login failed!";
        return;
    }

    currentUser = data.user;

    document.getElementById("login-status").textContent =
        "Logged in as " + currentUser.name;
};

/* ---------------------------------------------------------
    ✅ LOAD MOVIES
--------------------------------------------------------- */
async function loadMovies() {
    const res = await fetch(`${API}/movies`);
    const movies = await res.json();

    const list = document.getElementById("movies-list");
    

    list.innerHTML = "";
    

    movies.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = `${movie.title} (${movie.release_year})`;
        li.onclick = () => loadDetails(movie.movie_id);
        list.appendChild(li);
    });
}

/* ---------------------------------------------------------
    ✅ ADD MOVIE
--------------------------------------------------------- */
document.getElementById("addMovieBtn").onclick = async () => {
    const body = {
        title: document.getElementById("title").value,
        release_year: document.getElementById("year").value,
        description: document.getElementById("description").value
    };

    await fetch(`${API}/movies`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    alert("Movie added!");
    loadMovies();
};

/* ---------------------------------------------------------
    ✅ MOVIE DETAILS
--------------------------------------------------------- */
async function loadDetails(movieId) {
    document.getElementById("details-section").style.display = "block";

    const res = await fetch(`${API}/movies/${movieId}`);
    const movie = await res.json();

    document.getElementById("movie-title").textContent = movie.title;
    document.getElementById("movie-description").textContent = movie.description;

    // clear old content
    document.getElementById("reviews-list").innerHTML = "";
    document.getElementById("avg-rating").textContent = "";

    loadReviews(movieId);
    loadAvgRating(movieId);

    document.getElementById("addReviewBtn").onclick = () => addReview(movieId);
    document.getElementById("addRatingBtn").onclick = () => addRating(movieId);
}

/* ---------------------------------------------------------
    ✅ LOAD REVIEWS
--------------------------------------------------------- */
async function loadReviews(movieId) {
    const res = await fetch(`${API}/movies/${movieId}/reviews`);
    const reviews = await res.json();

    const list = document.getElementById("reviews-list");
    list.innerHTML = "";

    if (reviews.length === 0) {
        list.innerHTML = "<li>No reviews yet</li>";
        return;
    }

    reviews.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.user_name}: ${r.comment}`;
        list.appendChild(li);
    });
}

/* ---------------------------------------------------------
    ✅ ADD REVIEW
--------------------------------------------------------- */
async function addReview(movieId) {
    if (!currentUser) return alert("Please login!");

    const comment = document.getElementById("review-comment").value;

    await fetch(`${API}/movies/${movieId}/reviews`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user_id: currentUser.user_id, comment })
    });

    loadReviews(movieId);
}

/* ---------------------------------------------------------
    ✅ ADD RATING
--------------------------------------------------------- */
async function addRating(movieId) {
    if (!currentUser) return alert("Please login!");

    const rating = document.getElementById("rating-value").value;

    await fetch(`${API}/movies/${movieId}/rating`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user_id: currentUser.user_id, rating })
    });

    loadAvgRating(movieId);
}

/* ---------------------------------------------------------
    ✅ AVERAGE RATING
--------------------------------------------------------- */
async function loadAvgRating(movieId) {
    const res = await fetch(`${API}/movies/${movieId}/rating`);
    const data = await res.json();

    let avg = data.average;

    // ✅ Convert string to number
    if (avg !== null) {
        avg = parseFloat(avg);
        document.getElementById("avg-rating").textContent =
            avg.toFixed(1) + " / 5";
    } else {
        document.getElementById("avg-rating").textContent = "No rating yet";
    }
}
/* ---------------------------------------------------------
    ✅ SEARCH MOVIES
--------------------------------------------------------- */
document.getElementById("searchBtn").onclick = async () => {
    const q = document.getElementById("search-input").value;

    const res = await fetch(`${API}/search?q=${q}`);
    const movies = await res.json();

    const list = document.getElementById("movies-list");
    list.innerHTML = "";

    movies.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        li.onclick = () => loadDetails(movie.movie_id);
        list.appendChild(li);
    });
};