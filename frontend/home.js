const URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");


// If not logged in
if (!token) {
  window.location = "index.html";
}


async function loadStories() {

  const res = await fetch(`${URL}/users`, {
    headers: {
      "x-auth-token": token
    }
  });

  const users = await res.json();

  const storiesDiv = document.getElementById("stories");

  let html = "";

  users.forEach(u => {

    html += `
      <div class="story">

        <img 
          src="${
            u.profilePic
              ? 'http://localhost:5000/uploads/' + u.profilePic
              : 'http://localhost:5000/uploads/default.png'
          }"
        >

        <span>${u.name}</span>

      </div>
    `;
  });

  storiesDiv.innerHTML = html;
}



// Load Posts
async function loadPosts() {

  const res = await fetch(`${URL}/posts`, {
    headers: {
      "x-auth-token": token
    }
  });

  const posts = await res.json();

  let html = "";

  posts.forEach(p => {

  // Build comments
  let commentsHTML = "";

  p.comments.forEach(c => {
    commentsHTML += `
      <div class="comment">
        <b>${c.name}</b>: ${c.text}
      </div>
    `;
  });

  html += `
<div class="post-card">

  <div class="post-header">

    <img 
      src="${
        p.user?.profilePic
          ? 'http://localhost:5000/uploads/' + p.user.profilePic
          : 'http://localhost:5000/uploads/default.png'
      }"
      class="avatar"
    />

    <div>
      <h4>${p.user?.name || "User"}</h4>
      <small>${new Date(p.createdAt).toLocaleString()}</small>
    </div>

  </div>

  ${p.image ? `
    <img 
      src="http://localhost:5000/uploads/${p.image}" 
      class="post-img"
    />
  ` : ""}

  <p class="post-text">${p.text}</p>

  <div class="post-actions">
    <button onclick="likePost('${p._id}')">❤️ ${p.likes.length}</button>
  </div>

  <div class="comments">

    ${commentsHTML}

    <div class="comment-input">
      <input id="comment-${p._id}" placeholder="Write a comment..." />
      <button onclick="addComment('${p._id}')">Send</button>
    </div>

  </div>

</div>
`;

});


  document.getElementById("posts").innerHTML = html;

}



// Create Post
async function createPost() {

  const text = document.getElementById("postText").value;
  const image = document.getElementById("postImage").files[0];

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
  document.getElementById("postImage").value = "";

  loadPosts();
}




// Like Post
async function likePost(id) {

  await fetch(`${URL}/posts/like/${id}`, {
    method: "PUT",
    headers: {
      "x-auth-token": token
    }
  });

  loadPosts();

}



// Add Comment
async function addComment(postId) {

  const input = document.getElementById(`comment-${postId}`);

  const text = input.value;

  if (!text) return;

  await fetch(`${URL}/posts/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token
    },
    body: JSON.stringify({ text })
  });

  input.value = "";

  loadPosts();

}



// Logout
function logout() {

  localStorage.removeItem("token");

  window.location = "index.html";

}


// First Load

loadStories();
loadPosts();

function toggleDark() {
  document.body.classList.toggle("dark");
}
