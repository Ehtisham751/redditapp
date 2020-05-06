const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
searchForm.addEventListener("submit", (e) => {
  document.getElementById(
    "results"
  ).innerHTML = `<h2 class="" >Loading please Wait...</h2>`;
  // Get search term
  const searchTerm = searchInput.value;
  // Get sort
  const sortBy = document.querySelector("input[name=sortby]:checked").value;
  // Get Limit
  const searchLimit = document.getElementById("limit").value;
  console.log(searchLimit);

  // Check Input
  if (searchTerm === "") {
    showMessage("Please add a  search term", "alert-danger");
  }
  // Clear Input
  searchInput.value = "";
  // Search Reddit
  search(searchTerm, searchLimit, sortBy).then((results) => {
    let output = '<div class="card-columns">';

    results.forEach((post) => {
      // Check for image
      let image = post.preview
        ? post.preview.images[0].source.url
        : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
      output += `
    <div class="card">
      <img src="${image}" class="card-img-top" alt="">
      <div class="card-body">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${truncateText(post.selftext, 100)}</p>
        <a href=${
          post.url
        }" target="_blank" class="btn btn-primary">Read more</a>
        <hr>
        <span class="badge badge-secondary">
        Subreddit: ${post.subreddit}
        </span>
        <span class="badge badge-secondary">
        Score: ${post.score}
        </span>
      </div>
    </div>`;
    });
    output += "</div>";
    document.getElementById("results").innerHTML = output;
  });

  e.preventDefault();
});

// Show message
function showMessage(message, className) {
  // Create a div
  const div = document.createElement("div");
  div.className = `alert ${className}`;
  // ADD text
  div.appendChild(document.createTextNode(message));
  // Get Parent
  const searchContainer = document.getElementById("search-container");
  const search = document.getElementById("search");

  // Insert Message
  searchContainer.insertBefore(div, search);

  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
}

// Truncate Text
function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);
  if (shortened === -1) return text;
  return text.substring(0, shortened);
}
function search(searchTerm, searchLimit, sortBy) {
  return fetch(
    `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
  )
    .then((res) => res.json())
    .then((data) => data.data.children.map((data) => data.data))

    .catch((err) => console.log(err));
}
