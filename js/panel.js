
const pop = document.querySelector('.poplog');
// Chèk si admin deja konekte
window.onload = function() {
  var storedUid = localStorage.getItem("uid");
  var storedRole = localStorage.getItem("role");

  if(storedUid && storedRole) {
    redirectUser(storedRole);
    document.getElementById("poplog").style.display = "none";
  } else {
    document.getElementById("poplog").style.display = "flex";
  }
}

function login() {
  var usernameInput = document.getElementById("username").value;
  var passwordInput = document.getElementById("password").value;


  // Admin default
  if(usernameInput === "adm" && passwordInput === "4530") {
    localStorage.setItem("uid", "4530");
    localStorage.setItem("role", "admin");
    redirectUser("admin");
    return;
  }

  // Sinon verifye RTDB
  database.ref("users").once("value").then(function(snapshot) {
    var users = snapshot.val();
    var loggedIn = false;

    for (var uid in users) {
      if (users[uid].username === usernameInput && users[uid].password === passwordInput) {
        loggedIn = true;
        var role = users[uid].role;

        localStorage.setItem("uid", uid);
        localStorage.setItem("role", role);
        redirectUser(role);
        break;
      }
    }

    if(!loggedIn) {
      alert("Username oswa modpas pa kòrèk!");
    }
  });
}

// Fonksyon pou redireksyon selon wòl
function redirectUser(role) {
  if(role === "admin") {
        pop.style.display='none';
  } else if(role === "moderator") {
    window.location.href = "moderator_panel.html";
  } else {
    window.location.href = "user_panel.html";
  }
}

window.addEventListener("load", function () {
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");

  if (uid && role) {
    // Utilisateur déjà connecté
    redirectUser(role);
  }
});

// Logout
function logout() {
  localStorage.removeItem("uid");
  localStorage.removeItem("role");
  pop.style.display='block';
}





// Ajoute itilizatè
function addUser() {
  var username = document.getElementById("newUsername").value;
  var password = document.getElementById("newPassword").value;
  var role = document.getElementById("newRole").value;

  if(!username || !password) {
    alert("Tanpri ranpli tout chan yo!");
    return;
  }

  var newUid = database.ref("users").push().key;

  database.ref("users/" + newUid).set({
    username: username,
    password: password,
    role: role
  }).then(() => {
    alert("Itilizatè ajoute avèk siksè!");
    document.getElementById("newUsername").value = "";
    document.getElementById("newPassword").value = "";
    loadUsers();
  }).catch(err => console.error(err));
}

// Chaje lis itilizatè
function loadUsers() {
  database.ref("users").once("value").then(function(snapshot) {
    var users = snapshot.val();
    var container = document.getElementById("userCards");
    container.innerHTML = "";

    for (var uid in users) {

      var roleSelect = `
        <select onchange="changeRole('${uid}', this.value)">
          <option value="admin" ${users[uid].role==='admin'?'selected':''}>Admin</option>
          <option value="moderator" ${users[uid].role==='moderator'?'selected':''}>Moderator</option>
          <option value="user" ${users[uid].role==='user'?'selected':''}>User</option>
        </select>
      `;

      var deleteBtn = `
        <button onclick="deleteUser('${uid}')">
          Delete User
        </button>
      `;

      var card = document.createElement("div");
      card.className = "user-card";

      card.innerHTML = `
        <h3>${users[uid].username}</h3>
        <p><strong>ID:</strong> ${uid}</p>
        <p><strong>Password:</strong> ${users[uid].password}</p>
        <p><strong>Role:</strong></p>
        ${roleSelect}
        ${deleteBtn}
      `;

      container.appendChild(card);
    }
  });
}

// Chanje role
function changeRole(uid, newRole) {
  database.ref("users/" + uid + "/role").set(newRole)
    .then(() => {
      console.log("Role chanje pou UID " + uid + " → " + newRole);
    })
    .catch(err => console.error(err));
}

// Delete itilizatè
function deleteUser(uid) {
  if(confirm("Eske w sèten ou vle efase itilizatè sa a?")) {
    database.ref("users/" + uid).remove()
      .then(() => {
        alert("Itilizatè efase avèk siksè!");
        loadUsers();
      })
      .catch(err => console.error(err));
  }
}

// Chaje lis itilizatè le paj chaje
window.onload = function() {
  loadUsers();
}




