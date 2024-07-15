  const socket = io ();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-Location', { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map("map").setView([0, 0], 10);

// Add the tile layer
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTO(map);


const markers ={};

socket.on("receive-location",(data)=>{
    const {id, longitude, latitude} = data;
    map.setview([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    } else {
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
    console.log("User disconnected");
});
