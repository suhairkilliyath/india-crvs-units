const loginBtn = document.querySelector('.login-btn');
const loginForm = document.querySelector('.login-form');

loginBtn.addEventListener('click', () => {
  loginForm.classList.toggle('hidden');
});

const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (email === "" || password === "") {
    alert("Please enter both email and password.");
  } else {
    // perform login operation
    alert(`Login successful for user with email: ${email}`);
  }
});
