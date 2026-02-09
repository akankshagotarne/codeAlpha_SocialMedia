const URL = "http://localhost:5000/api";


// Show Register
function showRegister() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("registerBox").classList.remove("hidden");
}


// Show Login
function showLogin() {
  document.getElementById("registerBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}



// Register
async function register() {

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!name || !email || !password) {
    return alert("All fields required!");
  }

  const res = await fetch(`${URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered successfully!");
    showLogin();
  } else {
    alert(data.msg || "Registration failed");
  }
}



// Login
async function login() {

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    return alert("All fields required!");
  }

  const res = await fetch(`${URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {

    localStorage.setItem("token", data.token);

    window.location = "home.html";

  } else {
    alert(data.msg || "Login failed");
  }

}
