mapboxgl.accessToken = 'pk.eyJ1Ijoic3VoYWlya2siLCJhIjoiY2xna3JrcG5mMDJ3ejNlcWlhc3lzem53MCJ9.DRGs8WHcQgcy68JAwuKIlA';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/suhairkk/clgkrlzq3008d01pcgjozhb8m', // replace with your style ID
		center: [73.8567, 20.5937], // replace with your desired center coordinates
		zoom: 4 // replace with your desired zoom level
	});

	// listen for changes to the toggle inputs
	var layer1Toggle = document.getElementById('rj-districts-toggle');
	layer1Toggle.addEventListener('change', function() {
		var visibility = this.checked ? 'visible' : 'none';
		map.setLayoutProperty('rj-districts-cvu7zr', 'visibility', visibility);
	});

	var layer2Toggle = document.getElementById('declared-units-toggle');
	layer2Toggle.addEventListener('change', function() {
		var visibility = this.checked ? 'visible' : 'none';
		map.setLayoutProperty('declared-units-a9dcnd', 'visibility', visibility);
	});

	var layer3Toggle = document.getElementById('traced-units-toggle');
	layer3Toggle.addEventListener('change', function() {
		var visibility = this.checked ? 'visible' : 'none';
		map.setLayoutProperty('traced-units-0cngfu', 'visibility', visibility);
	});

	// Add a function to update the map view when layer visibility changes
	function updateMap() {
	    var layers = ['rj-districts-cvu7zr', 'declared-units-a9dcnd', 'traced-units-0cngfu'];
	    var visibleLayers = [];
	    for (var i = 0; i < layers.length; i++) {
		if (document.getElementById(layers[i]).checked) {
		    visibleLayers.push(layers[i]);
		}
	    }
	    map.setLayoutProperty('rj-districts-cvu7zr', 'visibility', visibleLayers.indexOf('rj-districts-cvu7zr') !== -1 ? 'visible' : 'none');
	    map.setLayoutProperty('declared-units-a9dcnd', 'visibility', visibleLayers.indexOf('declared-units-a9dcnd') !== -1 ? 'visible' : 'none');
	    map.setLayoutProperty('traced-units-0cngfu', 'visibility', visibleLayers.indexOf('traced-units-0cngfu') !== -1 ? 'visible' : 'none');
	}


	// Attach the updateMap function to the checkboxes
	document.getElementById('rj-districts-toggle').addEventListener('change', updateMap);
	document.getElementById('declared-units-toggle').addEventListener('change', updateMap);
	document.getElementById('traced-units-toggle').addEventListener('change', updateMap);


	// Define the district filter function
	function filterPolygons(property) {			
	  if (property === '') {
	    // Show all polygons if no property is selected
	    return ['!=', 'pc11_district_id', ''];
	  } else {
	    // Show only polygons with the selected property
	    var filter = ['==', 'pc11_district_id', property];
	    return filter;
	  }
	}
	// Listen for changes to the dropdown element
	var dropdownChoice = document.getElementById('polygons');
	dropdownChoice.addEventListener('change', function() {
		// Get the selected value from the dropdown
		var selectedProperty = this.value;
		// Update the filter function with the selected property
		map.setFilter('rj-districts-cvu7zr', filterPolygons(selectedProperty));
		map.setFilter('traced-units-0cngfu', filterPolygons(selectedProperty));
		map.setFilter('declared-units-a9dcnd', filterPolygons(selectedProperty));
	});	
