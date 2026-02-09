const URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location = "index.html";
}


// ========================
// LOAD PROFILE
// ========================

async function loadProfile() {

  const res = await fetch(`${URL}/users/me`, {
    headers: {
      "x-auth-token": token
    }
  });

  const user = await res.json();


  // Set profile data
  document.getElementById("profileName").innerText = user.name;
  document.getElementById("profileEmail").innerText = user.email;

  document.getElementById("followersCount").innerText =
    user.followers.length;

  document.getElementById("followingCount").innerText =
    user.following.length;


  // Profile pic
  if (user.profilePic) {
    document.getElementById("profilePic").src =
      `http://localhost:5000/uploads/${user.profilePic}`;
  }

// Show avatar in post box
if (user.profilePic && document.getElementById("myAvatar")) {

  document.getElementById("myAvatar").src =
    `http://localhost:5000/uploads/${user.profilePic}`;
}

  // Load my posts
  loadMyPosts();
}


// ========================
// LOAD MY POSTS
// ========================

async function loadMyPosts() {

  const res = await fetch(`${URL}/posts`, {
    headers: {
      "x-auth-token": token
    }
  });

  const posts = await res.json();

  let html = "";

  posts.forEach(p => {

    if (
  p.user &&
  (p.user._id === getUserId() || p.user === getUserId())
) {




      html += `
  <div class="post-card">

    ${p.image ? `
      <img 
        src="http://localhost:5000/uploads/${p.image}" 
        class="post-img"
      />
    ` : ""}

    <p>${p.text}</p>

    <small>
      ❤️ ${p.likes.length} |
      💬 ${p.comments.length}
    </small>

  </div>
`;

    }

  });

  document.getElementById("myPosts").innerHTML = html;
}


// ========================
// GET USER ID FROM TOKEN
// ========================

function getUserId() {

  const payload = JSON.parse(
    atob(token.split(".")[1])
  );

  return payload.id;
}


// ========================
// UPLOAD PHOTO
// ========================

async function uploadPhoto() {

  const file = document.getElementById("photoInput").files[0];

  if (!file) {
    alert("Select image first");
    return;
  }

  const form = new FormData();
  form.append("photo", file);


  const res = await fetch(`${URL}/users/upload`, {
    method: "POST",
    headers: {
      "x-auth-token": token
    },
    body: form
  });


  if (res.ok) {
    alert("Photo uploaded!");
    loadProfile();
  }
}


// ========================
// CREATE POST (PROFILE)
// ========================

async function createPost() {

  const text = document.getElementById("postText").value;
  const image = document.getElementById("postImage")?.files[0];

  if (!text && !image) {
    return alert("Write something or upload image!");
  }

  const form = new FormData();
  form.append("text", text);

  if (image) {
    form.append("image", image);
  }

  await fetch(`${URL}/posts`, {
    method: "POST",
    headers: {
      "x-auth-token": token
    },
    body: form
  });

  document.getElementById("postText").value = "";

  if (document.getElementById("postImage")) {
    document.getElementById("postImage").value = "";
  }

  loadMyPosts();
}


// ========================
// LOGOUT
// ========================

function logout() {

  localStorage.removeItem("token");

  window.location = "index.html";
}


// ========================
// FIRST LOAD
// ========================

loadProfile();

function toggleDark() {
  document.body.classList.toggle("dark");
}
