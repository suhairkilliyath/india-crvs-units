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

		// show district labels
		map.on('load', function() {
		  map.addLayer({
		    id: 'district-labels',
		    type: 'symbol',
		    source: 'rj_districts-cvu7zr',
		    layout: {
		      'text-field': ['get', 'district_name'], // replace 'name' with the name of the field containing the labels
		      'text-size': 12,
		      'text-anchor': 'center'
		    },
		    paint: {
		      'text-color': '#FFFF00'
		    }
		  });
		});
