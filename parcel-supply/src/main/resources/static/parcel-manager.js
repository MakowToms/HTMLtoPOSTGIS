var cpanel;
var map;
var tmpMarker;

window.addEventListener('DOMContentLoaded', () => {
    cpanel = document.getElementsByClassName("control-panel")[0];
    initializeMap();
    setDefaultControlPanel();
    putParcelsOnMap();
})

function initializeMap() {
    map = L.map('mapid').setView([52.2217826, 21.0055107], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    	maxZoom: 18,
    	id: 'mapbox.streets',
    	accessToken: 'pk.eyJ1IjoiZG9tZXNieiIsImEiOiJjazJyeDJoODIwczk1M2xwN3RscmtnOXRnIn0.tpvAN_64Xs2Y2NWePPhQlg'
    }).addTo(map);
}

async function putParcelsOnMap() {
    var parcels = await tryGettingParcels();
    for(var i = 0; i < parcels.length; i++) {
        var parcel = parcels[i];
        L.marker([parcel.lat, parcel.lng]).addTo(map);
    }
}

function setDefaultControlPanel() {
    while (cpanel.firstChild) {
        cpanel.removeChild(cpanel.firstChild);
    }
    var btn = document.createElement("button");
    btn.classList.add("big-button");
    btn.innerHTML = "Add new parcel";
    btn.addEventListener("click", setNewParcelPanel)
    cpanel.appendChild(btn);

    btn = document.createElement("button");
    btn.classList.add("big-button");
    btn.innerHTML = "Browse all parcels";
    btn.addEventListener("click", setAllParcelsPanel)
    cpanel.appendChild(btn);
}

function setNewParcelPanel() {
    while (cpanel.firstChild) {
        cpanel.removeChild(cpanel.firstChild);
    }
    cpanel.textContent = "Select point on the map and insert size of the package, then click 'Add parcel'"
    //var form = createFormToAddParcel()
    //cpanel.appendChild(form);
    btn = document.createElement("button");
    btn.classList.add("big-button");
    btn.innerHTML = "Add new parcel";
    map.addEventListener("click", putMarker);
    btn.addEventListener("click", handleAddNewParcelClick);
    cpanel.appendChild(btn);
}

function setAllParcelsPanel() {
}

/*
function createFormToAddParcel() {
    var form = document.createElement("form");
    form.classList.add("add-parcel-form");
    form.appendChild(document.createElement("label"))
}*/

function putMarker(e) {
    if (tmpMarker == null) {
        tmpMarker = L.marker(e.latlng)
        	.addTo(map);
    } else {
        tmpMarker
            .setLatLng(e.latlng)
            .update();
    }
}

function handleAddNewParcelClick(e) {
    if (tmpMarker == null) {
        alert("You need to select place for delivery first!")
    } else {
        tryPostingParcel('http://0.0.0.0:8080/api/parcel',
            {lat: tmpMarker._latlng.lat,
             lng: tmpMarker._latlng.lng,
             length: 10,
             width: 10,
             height: 20});
        tmpMarker = null;
        map.removeEventListener("click", putMarker);
        setDefaultControlPanel();
    }
}