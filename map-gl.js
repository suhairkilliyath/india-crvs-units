// SIDE BARS
let declared_units = [];
const popup_declared = new mapboxgl.Popup({
  closeButton: false
});
const filterEl = document.getElementById('feature-filter');
const listingEl = document.getElementById('feature-listing')

let traced_units = [];
const popup_traced = new mapboxgl.Popup({
  closeButton: false
});
const filterEltraced = document.getElementById('feature-traced-filter');
const listingEltraced = document.getElementById('feature-traced-listing');

function renderListings(features) {
  const empty = document.createElement('p');
  // Clear any existing listings
  listingEl.innerHTML = '';
  if (features.length) {
    for (const feature of features) {
      const itemLink = document.createElement('a');
      const label = `${feature.properties.unit_name} (${feature.properties.unit_type})`;
      itemLink.textContent = label;
      itemLink.addEventListener('mouseover', () => {
        // Highlight corresponding feature on the map
        popup_declared
          .setLngLat(feature.geometry.coordinates)
          .setText(label)
          .addTo(map);
      });
      listingEl.appendChild(itemLink);
    }
    // Show the filter input
    filterEl.parentNode.style.display = 'block';
  } else if (features.length === 0 && filterEl.value !== '') {
    empty.textContent = 'No results found';
    listingEl.appendChild(empty);
  } else {
    empty.textContent = 'Drag the map to populate results';
    listingEl.appendChild(empty);
    // Hide the filter input
    filterEl.parentNode.style.display = 'none';
    // remove features filter
    map.setFilter('declared_unit', ['has', 'unit_name']);
  }
}

function normalize(string) {
  return string.trim().toLowerCase();
}

function getUniqueFeatures(features, comparatorProperty) {
  const uniqueIds = new Set();
  const uniqueFeatures = [];
  for (const feature of features) {
    const id = feature.properties[comparatorProperty];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueFeatures.push(feature);
    }
  }
  return uniqueFeatures;
}

function traced_renderListings(features) {
  const traced_empty = document.createElement('q');
  // Clear any existing listings
  listingEltraced.innerHTML = '';
  if (features.length) {
    for (const feature of features) {
      const itemLink = document.createElement('a');
      const label = `${feature.properties.formatted_address} (${feature.properties.unit_type})`;
      itemLink.textContent = label;
      itemLink.addEventListener('mouseover', () => {
        // Highlight corresponding feature on the map
        popup_traced
          .setLngLat(feature.geometry.coordinates)
          .setText(label)
          .addTo(map);
      });
      listingEltraced.appendChild(itemLink);
    }
    // Show the filter input
    filterEltraced.parentNode.style.display = 'block';
  } else if (features.length === 0 && filterEltraced.value !== '') {
    traced_empty.textContent = 'No results found';
    listingEltraced.appendChild(traced_empty);
  } else {
    traced_empty.textContent = 'Drag the map to populate results';
    listingEltraced.appendChild(traced_empty);
    // Hide the filter input
    filterEltraced.parentNode.style.display = 'none';
    // remove features filter
    map.setFilter('declared_unit', ['has', 'formatted_address']);
  }
}


// HEADLINE NUMBERS
var totalUnits = 12500;
var declaredUnits = declared_units.length;

// Update the HTML elements with the calculated values
document.getElementById('total-units').textContent = totalUnits;
document.getElementById('declared-units').textContent = declaredUnits;

//  ALL MAP LAYERS
mapboxgl.accessToken = 'pk.eyJ1Ijoic3VoYWlya2siLCJhIjoiY2t3ZG5oN3hhMGxtazJucXZwc3U4ZmszbiJ9.FcdBbEoryTBwLU56AoI5qg';
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [73.8567, 20.5937],
  maxZoom: 12,
  minZoom: 1,
  zoom: 4
});
// Add RJ Districts layer
map.on('load', () => {
  map.addSource('rj_districts', {
    'type': 'vector',
    'url': 'mapbox://suhairkk.d27vf7wz'
  });
  map.addLayer({
    'id': 'rj_district',
    'type': 'line',
    'source': 'rj_districts',
    'source-layer': 'rj_districts-cvu7zr',
    'layout': {},
    'paint': {
      'line-color': '#000000',
      'line-width': 0.5
    }
  });
  // Add Declared Units layer
  map.addSource('declared_units_layer', {
    'type': 'vector',
    'url': 'mapbox://suhairkk.2mkggpex'
  });
  map.addLayer({
    'id': 'declared_unit',
    'source': 'declared_units_layer',
    'source-layer': 'declared_units-a9dcnd',
    'type': 'circle',
    'paint': {
      'circle-color': '#4264fb',
      'circle-radius': 4,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });
  // Add Traced Units layer
  map.addSource('traced_units_layer', {
    'type': 'vector',
    'url': 'mapbox://suhairkk.70qh1v1w'
  });
  map.addLayer({
    'id': 'traced_unit',
    'source': 'traced_units_layer',
    'source-layer': 'traced_units-0cngfu',
    'type': 'circle',
    'paint': {
      'circle-color': '#ffb6c1',
      'circle-radius': 4,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  map.on('movestart', () => {
    // Get the selected option from the dropdown menu
    const dropdown = document.getElementById('polygons');
    const selectedOption = dropdown.value;
    // Generate the desired filter based on the selected property
    const desiredFilter = filterPolygons(selectedOption);
    // Reset features filter as the map starts moving only if the desired filter is defined
    if (desiredFilter) {
      map.setFilter('declared_unit', desiredFilter);
    }
  });
  map.on('moveend', () => {
    const features = map.queryRenderedFeatures({
      layers: ['declared_unit']
    });
    if (features) {
      const uniqueFeatures = getUniqueFeatures(features, 'unit_name');
      // Populate features for the listing overlay.
      renderListings(uniqueFeatures);
      // Clear the input container
      filterEl.value = '';
      // Store the current features in sn `airports` variable to
      // later use for filtering on `keyup`.
      declared_units = uniqueFeatures;
    }
  });
  map.on('mousemove', 'declared_unit', (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    // Populate the popup and set its coordinates based on the feature.
    const feature = e.features[0];
    popup_declared
      .setLngLat(feature.geometry.coordinates)
      .setText(
        `${feature.properties.unit_name}(${feature.properties.unit_type})`
      )
      .addTo(map);
  });
  map.on('mouseleave', 'declared_unit', () => {
    map.getCanvas().style.cursor = '';
    popup_declared.remove();
  });
  filterEl.addEventListener('keyup', (e) => {
    const value = normalize(e.target.value);
    // Filter visible features that match the input value.
    const filtered = [];
    for (const feature of declared_units) {
      const name = normalize(feature.properties.unit_name);
      if (name.includes(value)) {
        filtered.push(feature);
      }
    }
    // Populate the sidebar with filtered results
    renderListings(filtered);
    // Set the filter to populate features into the layer.
    if (filtered.length) {
      map.setFilter('declared_unit', [
        'match',
        ['get', 'uni_name'],
        filtered.map((feature) => {
          return feature.properties.unit_name;
        }),
        true,
        false
      ]);
    }
  });
  //TRACED UNITS
  map.on('movestart', () => {
    // Get the selected option from the dropdown menu 
    const dropdown = document.getElementById('polygons');
    const selectedOption = dropdown.value;
    // Generate the desired filter based on the selected property
    const desiredFilter = filterPolygons(selectedOption);
    // Reset features filter as the map starts moving only if the desired filter is defined
    if (desiredFilter) {
      map.setFilter('traced_unit', desiredFilter);
    }
  });
  map.on('moveend', () => {
    const features = map.queryRenderedFeatures({
      layers: ['traced_unit']
    });
    if (features) {
      const UniqueTracedFeatures = getUniqueFeatures(features, 'formatted_address');
      // Populate features for the listing overlay.
      traced_renderListings(UniqueTracedFeatures);
      // Clear the input container
      filterEltraced.value = '';
      // Store the current features in sn `airports` variable to
      // later use for filtering on `keyup`.
      traced_units = UniqueTracedFeatures;
    }
  });
  map.on('mousemove', 'traced_unit', (f) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    // Populate the popup and set its coordinates based on the feature.
    const feature = f.features[0];
    popup_traced
      .setLngLat(feature.geometry.coordinates)
      .setText(
        `${feature.properties.formatted_address}(${feature.properties.unit_type})`
      )
      .addTo(map);
  });
  map.on('mouseleave', 'declared_unit', () => {
    map.getCanvas().style.cursor = '';
    popup_traced.remove();
  });
  listingEltraced.addEventListener('keyup', (f) => {
    const value = normalize(f.target.value);
    // Filter visible features that match the input value.
    const filtered = [];
    for (const feature of traced_units) {
      const name = normalize(feature.properties.formatted_address);
      if (name.includes(value)) {
        filtered.push(feature);
      }
    }
    // Populate the sidebar with filtered results
    traced_renderListings(filtered);
    // Set the filter to populate features into the layer.
    if (filtered.length) {
      map.setFilter('traced_unit', [
        'match',
        ['get', 'formatted_address'],
        filtered.map((feature) => {
          return feature.properties.formatted_address;
        }),
        true,
        false
      ]);
    }
  });
  // Call this function on initialization
  // passing an empty array to render an empty state
  renderListings([]);
  traced_renderListings([]);
});

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
  map.setFilter('rj_district', filterPolygons(selectedProperty));
  map.setFilter('traced_unit', filterPolygons(selectedProperty));
  map.setFilter('declared_unit', filterPolygons(selectedProperty));
});

dropdownChoice.addEventListener('change', function() {
  var selectedProperty = this.value;
  // Fly to selected district center
  var features = map.querySourceFeatures('rj_districts', {
    sourceLayer: 'rj_districts-cvu7zr',
    filter: ['==', 'pc11_district_id', selectedProperty]
  });
  var center = turf.center(features[0]).geometry.coordinates;
  var zoom = 6; // Set the desired zoom level here
  map.flyTo({
    center: center,
    zoom: zoom
  });
})

// TOGGLE BUTTONS
// Add a function to update the map view when layer visibility changes
function updateMap() {
  var layers = ['rj_district', 'declared_unit', 'traced_unit'];
  var visibleLayers = [];
  for (var i = 0; i < layers.length; i++) {
    if (document.getElementById(layers[i]).checked) {
      visibleLayers.push(layers[i]);
    }
  }
  map.setLayoutProperty('rj_district', 'visibility', visibleLayers.indexOf('rj_district') !== -1 ? 'visible' : 'none');
  map.setLayoutProperty('declared_unit', 'visibility', visibleLayers.indexOf('declared_unit') !== -1 ? 'visible' : 'none');
  map.setLayoutProperty('traced_unit', 'visibility', visibleLayers.indexOf('traced_unit') !== -1 ? 'visible' : 'none');
}
// listen for changes to the toggle inputs
var layer1Toggle = document.getElementById('rj-districts-toggle');
layer1Toggle.addEventListener('change', function() {
  var visibility = this.checked ? 'visible' : 'none';
  map.setLayoutProperty('rj_district', 'visibility', visibility);
});
var layer2Toggle = document.getElementById('declared-units-toggle');
layer2Toggle.addEventListener('change', function() {
  var visibility = this.checked ? 'visible' : 'none';
  map.setLayoutProperty('declared_unit', 'visibility', visibility);
});
var layer3Toggle = document.getElementById('traced-units-toggle');
layer3Toggle.addEventListener('change', function() {
  var visibility = this.checked ? 'visible' : 'none';
  map.setLayoutProperty('traced_unit', 'visibility', visibility);
});

// Attach the updateMap function to the checkboxes
document.getElementById('rj-districts-toggle').addEventListener('change', updateMap);
document.getElementById('declared-units-toggle').addEventListener('change', updateMap);
document.getElementById('traced-units-toggle').addEventListener('change', updateMap);

