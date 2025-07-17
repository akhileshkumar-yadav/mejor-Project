mapboxgl.accessToken = maptoken; // defined in the EJS template

const parsedCoordinates = coordinates; // defined in the EJS template
console.log("Parsed Coordinates:", parsedCoordinates);

// Ensure the map container exists
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // ✅ REQUIRED
  center: parsedCoordinates,
  zoom: 9,
});

const el = document.createElement('div');
el.innerHTML = '<i class="fas fa-home"></i>';
el.style.fontSize = '16px';
el.style.backgroundColor = 'white';
el.style.borderRadius = '50%';
el.style.padding = '10px';
el.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
el.style.color = 'red';

new mapboxgl.Marker({ element: el })
  .setLngLat(parsedCoordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25, className: 'my-class' })
    .setHTML(`<p3>Exact Location provided after booking</p3>`))
  .addTo(map);