// window.onload = () => {
//     let places = staticLoadPlaces();
//     renderPlaces(places);
// };

// function staticLoadPlaces() {
//    return [
       
//        {
//            name: 'Magnemite',
//            location: {
//                lat: 35.142719,
//                lng: -120.639167,
//            }
//        },
//     {
//         name: 'Magnemite',
//         location: {
//             lat: 35.142618,
//             lng: -120.639039,
//         }
//     },
//     {
//         name: 'Magnemite',
//         location: {
//             lat:35.142544,
//             lng: -120.638920,
//         }
//     },

//    ];
// }

// function renderPlaces(places) {
//    let scene = document.querySelector('a-scene');

//    places.forEach((place) => {
//        let latitude = place.location.lat;
//        let longitude = place.location.lng;

//        let model = document.createElement('a-entity');
//        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
//        model.setAttribute('gltf-model', './assets/magnemite/scene.gltf');
//        model.setAttribute('rotation', '0 180 0');
//        model.setAttribute('animation-mixer', '');
//        model.setAttribute('scale', '0.5 0.5 0.5');

//        model.addEventListener('loaded', () => {
//            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
//        });

//        scene.appendChild(model);
//    });
// }




// getting places from APIs
function loadPlaces(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'CYNDJC1U5EWZGGQ0JQSWLYDSUR3FEM25QDTWNRYBOLF12VCH',
        clientSecret: 'XQEEO3BROVMAVTWAFAI2Y0WYPNRN0KMXOEAOBCZSPLT0MNYT',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API (limit param: number of maximum places to fetch)
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=30 
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const placeText = document.createElement('a-link');
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    placeText.setAttribute('title', place.name);
                    placeText.setAttribute('scale', '15 15 15');
                    
                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeText);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
