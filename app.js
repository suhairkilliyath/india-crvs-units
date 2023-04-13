let users = [];

function registerUser(email, password) {
  if (users.some(user => user.email === email)) {
    return [false, "Email already exists"];
  }
  
  users.push({ email: email, password: password });
  return [true, "Registration successful"];
}

function getPassword() {
  let passwordCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += passwordCharacters[Math.floor(Math.random() * passwordCharacters.length)];
  }
  return password;
}

function loginUser(email, password) {
  let user = users.find(user => user.email === email);
  if (!user) {
    return [false, "Email does not exist"];
  } else if (user.password !== password) {
    return [false, "Incorrect password"];
  } else {
    return [true, "Login successful"];
  }
}

function renderRegisterPage() {
  let email = "";
  let password = "";
  
  document.querySelector("#content").innerHTML = `
    <h1>User Registration</h1>
    <div>
      <label for="email">Email:</label>
      <input type="text" id="email" value="${email}">
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" value="${password}">
    </div>
    <div>
      <button id="register-button">Register</button>
    </div>
  `;
  
  document.querySelector("#register-button").addEventListener("click", () => {
    email = document.querySelector("#email").value;
    password = document.querySelector("#password").value;
    
    if (email === "" || password === "") {
      alert("Please enter both email and password");
      return;
    }
    
    let [success, message] = registerUser(email, password);
    if (success) {
      alert(message);
    } else {
      alert(message);
    }
  });
}

function renderLoginPage() {
  let email = "";
  let password = "";
  
  document.querySelector("#content").innerHTML = `
    <h1>User Login</h1>
    <div>
      <label for="email">Email:</label>
      <input type="text" id="email" value="${email}">
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" value="${password}">
    </div>
    <div>
      <button id="login-button">Login</button>
    </div>
  `;
  
  document.querySelector("#login-button").addEventListener("click", () => {
    email = document.querySelector("#email").value;
    password = document.querySelector("#password").value;
    
    if (email === "" || password === "") {
      alert("Please enter both email and password");
      return;
    }
    
    let [success, message] = loginUser(email, password);
    if (success) {
      alert(message);
    } else {
      alert(message);
    }
  });
}

function renderHomePage() {
  let email = localStorage.getItem("email");
  
  document.querySelector("#content").innerHTML = `
    <h1>Welcome ${email}!</h1>
    <div>
      <button id="logout-button">Logout</button>
    </div>
  `;
  
  document.querySelector("#logout-button").addEventListener("click", () => {
    localStorage.removeItem("email");
    renderLoginPage();
  });
}

function renderPage() {
  let page = localStorage.getItem("page");
 
}
