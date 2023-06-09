window.onload = () => {
    let places = staticLoadPlaces();
    renderPlaces(places);
};

function staticLoadPlaces() {
   return [
       {
           name: 'Magnemite',
           location: {
               lat: 35.293371,
               lng: -120.652708,
           }
       },
       {
        name: 'Magnemite',
        location: {
            lat: 35.298734,
            lng: -120.660032,
        }
    },
    {
        name: 'Magnemite',
        location: {
            lat: 35.300180,
            lng: -120.662005,
        }
    },
    {
        name: 'Magnemite',
        location: {
            lat:35.298992,
            lng: -120.660192,
        }
    },

   ];
}

function renderPlaces(places) {
   let scene = document.querySelector('a-scene');

   places.forEach((place) => {
       let latitude = place.location.lat;
       let longitude = place.location.lng;

       let model = document.createElement('a-entity');
       model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
       model.setAttribute('gltf-model', './assets/magnemite/scene.gltf');
       model.setAttribute('rotation', '0 180 0');
       model.setAttribute('animation-mixer', '');
       model.setAttribute('scale', '0.5 0.5 0.5');

       model.addEventListener('loaded', () => {
           window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
       });

       scene.appendChild(model);
   });
}