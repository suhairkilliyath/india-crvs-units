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

// Declared Units

// Holds visible airport features for filtering
let decalred_units = [];

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
  closeButton: false
  });

const filterEl = document.getElementById('feature-filter');
const listingEl = document.getElementById('feature-listing');

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
        popup
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

map.on('load', () => {
  map.addSource('decalred_units', {
    'type': 'vector',
    'url': 'mapbox://suhairkk.2mkggpex'
  });
  map.addLayer({
    'id': 'declared_unit',
    'source': 'decalred_units',
    'source-layer': 'declared_units-a9dcnd',
    'type': 'circle',
    'paint': {
      'circle-color': '#4264fb',
      'circle-radius': 4,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });
  map.on('movestart', () => {
    // reset features filter as the map starts moving
    map.setFilter('declared_unit', ['has', 'unit_name']);
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
      decalred_units = uniqueFeatures;
    }
  });
  map.on('mousemove', 'declared_unit', (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    // Populate the popup and set its coordinates based on the feature.
    const feature = e.features[0];
    popup
      .setLngLat(feature.geometry.coordinates)
      .setText(
        `${feature.properties.unit_name}(${feature.properties.unit_type})`
      )
      .addTo(map);
  });

  map.on('mouseleave', 'declared_unit', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
  filterEl.addEventListener('keyup', (e) => {
    const value = normalize(e.target.value);

    // Filter visible features that match the input value.
    const filtered = [];
    for (const feature of decalred_units) {
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

  // Call this function on initialization
  // passing an empty array to render an empty state
  renderListings([]);
});


// Traced Units

// Holds visible airport features for filtering
let traced_units = [];

// Create a popup, but don't add it to the map yet.
const traced_popup = new mapboxgl.Popup({
  closeButton: false
  });

const traced_filterEl = document.getElementById('feature-traced-filter');
const traced_listingEl = document.getElementById('feature-traced-listing');

function renderListings_traced(features) {
  const empty = document.createElement('p');
  // Clear any existing listings
  traced_listingEl.innerHTML = '';
  if (features.length) {
    for (const feature of features) {
      const itemLink = document.createElement('a');
      const label = `${feature.properties.formatted_address} (${feature.properties.unit_type})`;
      itemLink.textContent = label;
      itemLink.addEventListener('mouseover', () => {
        // Highlight corresponding feature on the map
        traced_popup
          .setLngLat(feature.geometry.coordinates)
          .setText(label)
          .addTo(map);
      });
      traced_listingEl.appendChild(itemLink);
    }

    // Show the filter input
    traced_filterEl.parentNode.style.display = 'block';
  } else if (features.length === 0 && traced_filterEl.value !== '') {
    empty.textContent = 'No results found';
    traced_listingEl.appendChild(empty);
  } else {
    empty.textContent = 'Drag the map to populate results';
    traced_listingEl.appendChild(empty);

    // Hide the filter input
    traced_filterEl.parentNode.style.display = 'none';

    // remove features filter
    map.setFilter('traced_unit', ['has', 'formatted_address']);
  }
  }

function getUniqueTracedFeatures(features, comparatorProperty) {
  const uniqueIds = new Set();
  const UniqueTracedFeatures = [];
  for (const feature of features) {
    const id = feature.properties[comparatorProperty];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      UniqueTracedFeatures.push(feature);
    }
  }
  return UniqueTracedFeatures;
  }

map.on('load', () => {
  map.addSource('traced_units', {
    'type': 'vector',
    'url': 'mapbox://suhairkk.70qh1v1w'
  });
  map.addLayer({
    'id': 'traced_unit',
    'source': 'traced_units',
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
    // reset features filter as the map starts moving
    map.setFilter('traced_unit', ['has', 'formatted_address']);
  });

  map.on('moveend', () => {
    const features = map.queryRenderedFeatures({
      layers: ['traced_unit']
    });

    if (features) {
      const UniqueTracedFeatures = getUniqueTracedFeatures(features, 'formatted_address');
      // Populate features for the listing overlay.
      renderListings_traced(UniqueTracedFeatures);

      // Clear the input container
      traced_filterEl.value = '';

      // Store the current features in sn `airports` variable to
      // later use for filtering on `keyup`.
      traced_units = UniqueTracedFeatures;
    }
  });
  map.on('mousemove', 'traced_unit', (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    // Populate the popup and set its coordinates based on the feature.
    const feature = e.features[0];
    traced_popup
      .setLngLat(feature.geometry.coordinates)
      .setText(
        `${feature.properties.formatted_address}(${feature.properties.unit_type})`
      )
      .addTo(map);
  });

  map.on('mouseleave', 'traced_unit', () => {
    map.getCanvas().style.cursor = '';
    traced_popup.remove();
  });
  traced_listingEl.addEventListener('keyup', (e) => {
    const value = normalize(e.target.value);

    // Filter visible features that match the input value.
    const filtered = [];
    for (const feature of traced_units) {
      const name = normalize(feature.properties.formatted_address);
      if (formatted_address.includes(value)) {
        filtered.push(feature);
      }
    }

    // Populate the sidebar with filtered results
    renderListings_traced(filtered);

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
  renderListings_traced([]);
  });
