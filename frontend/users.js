const URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location = "index.html";
}

// Load all users
async function loadUsers() {

  const res = await fetch(`${URL}/users`, {
    headers: {
      "x-auth-token": token
    }
  });

  const users = await res.json();

  let html = "";

  users.forEach(u => {
    html += `
  <div class="user-card">
    <h4>${u.name}</h4>

    <div class="user-actions">
      <button class="btn" onclick="follow('${u._id}')">
        Follow
      </button>

      <button class="btn outline" onclick="unfollow('${u._id}')">
        Unfollow
      </button>
    </div>
  </div>
`;

  });

  document.getElementById("users").innerHTML = html;
}

// Follow
async function follow(id) {

  await fetch(`${URL}/users/follow/${id}`, {
    method: "PUT",
    headers: {
      "x-auth-token": token
    }
  });

  alert("Followed!");
}

// Unfollow
async function unfollow(id) {

  await fetch(`${URL}/users/unfollow/${id}`, {
    method: "PUT",
    headers: {
      "x-auth-token": token
    }
  });

  alert("Unfollowed!");
}

loadUsers();
function filterUsers() {

  const input = document
    .getElementById("searchUser")
    .value
    .toLowerCase();

  const cards = document.querySelectorAll(".user-card");

  cards.forEach(card => {

    const name = card.innerText.toLowerCase();

    if (name.includes(input)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }

  });
}

function toggleDark() {
  document.body.classList.toggle("dark");
}
