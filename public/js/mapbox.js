mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Create a marker and add it to the map.
new mapboxgl.Marker({
    id: 'marker',
    color: '#FF0000',
})
    .setLngLat(camp.geometry.coordinates).addTo(map)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h5>${camp.title}</h5><p>${camp.location}</p>`)
    )
    .addTo(map);
