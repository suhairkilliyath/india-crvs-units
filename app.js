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



		
// highlight districts in blue
// Add a new layer for the selected polygon with fill color
map.addLayer({
'id': 'selected-polygon',
'type': 'fill',
'source': 'rj-districts-cvu7zr',
'paint': {
    'fill-color': 'lightblue',
    'fill-opacity': 0.5
},
'filter': ['==', 'id', selectedPolygon.properties.id]
});

		// Get the center of the selected polygon
		var bounds = selectedPolygon.geometry.coordinates.reduce(function(bounds, coord) {
		    return bounds.extend(coord);
		}, new mapboxgl.LngLatBounds(selectedPolygon.geometry.coordinates[0], selectedPolygon.geometry.coordinates[0]));
		// Fit the map view to the bounds of the selected polygon
		map.fitBounds(bounds, { padding: 20 });

