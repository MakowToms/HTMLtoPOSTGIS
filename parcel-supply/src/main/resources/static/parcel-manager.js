var cpanel;
var dpanel;
var map;
var tmpMarker;
var layerGroup;

window.addEventListener('DOMContentLoaded', () => {
    cpanel = document.getElementsByClassName("control-panel")[0];
    initializeMap();
    setDefaultControlPanel();
    putParcelsOnMap();
});

function initializeMap() {
    map = L.map('mapid').setView([52.2217826, 21.0055107], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZG9tZXNieiIsImEiOiJjazJyeDJoODIwczk1M2xwN3RscmtnOXRnIn0.tpvAN_64Xs2Y2NWePPhQlg'
    }).addTo(map);
    layerGroup = L.layerGroup().addTo(map);
}

async function putParcelsOnMap() {
    var parcels = await tryGettingParcels();
    for(var i = 0; i < parcels.length; i++) {
        var parcel = parcels[i];
        L.marker([parcel.lat, parcel.lng]).addTo(layerGroup);
    }
}

function setDefaultControlPanel() {
    while (cpanel.firstChild) {
        cpanel.removeChild(cpanel.firstChild);
    }
    var btn = document.createElement("button");
    btn.classList.add("big-button");
    btn.innerHTML = "Add new parcel";
    btn.addEventListener("click", setNewParcelPanel);
    cpanel.appendChild(btn);

    dpanel = document.createElement("div");
    dpanel.classList.add("details-panel");
    cpanel.appendChild(dpanel);
    addParcelBrowser();
}

function setNewParcelPanel() {
    while (cpanel.firstChild) {
        cpanel.removeChild(cpanel.firstChild);
    }
    var txt = document.createElement("a");
    txt.classList.add("insert-text");
    txt.textContent = "Select point on the map and insert size of the package, then click 'Accept'";
    cpanel.appendChild(txt);

    var form = createFormToAddParcel()
    cpanel.appendChild(form);

    btn = document.createElement("button");
    btn.classList.add("big-button");
    btn.innerHTML = "Accept";
    map.addEventListener("click", putMarker);
    btn.addEventListener("click", e => {
        handleAddNewParcelClick(form);
    });
    cpanel.appendChild(btn);
}

function createFormToAddParcel() {
    var frm = document.createElement("form");
    frm.classList.add("update-form");

    var lbl, inpt;

    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "length");
    lbl.innerText = "Length";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "length");
    frm.appendChild(inpt);

    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "width");
    lbl.innerText = "Width";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "width");
    frm.appendChild(inpt);


    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "height");
    lbl.innerText = "Height";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "height");
    frm.appendChild(inpt);

    return frm;
}

async function addParcelBrowser() {
    var brwsr = document.createElement("div");
    brwsr.classList.add("parcel-browser");

    var parcels = await tryGettingParcels();
    for (var i = 0; i < parcels.length; i++) {
        var prclBar = createParcelBar(parcels[i]);
        brwsr.appendChild(prclBar);
    }

    cpanel.insertBefore(brwsr, dpanel);
}

function createParcelBar(parcel) {
    var bar = document.createElement("div");
    bar.classList.add("parcel-bar");
    bar.innerHTML = "<b>ID: " + parcel.parcelId + "</b><br><b>Latitude: </b>" + parcel.lat +
        "<br><b>Longitude: </b>" + parcel.lng;
    bar.addEventListener("click", e =>{
        openParcelDetailsPanel(parcel);
    });
    return bar;
}

function openParcelDetailsPanel(parcel) {
    while (dpanel.firstChild) {
        dpanel.removeChild(dpanel.firstChild);
    }

    var headerBar = document.createElement("a");
    headerBar.classList.add("parcel-details-header-bar")
    headerBar.textContent = "Parcel ID: " + parcel.parcelId;

    var showBtn = document.createElement("button");
    showBtn.classList.add("big-button");
    showBtn.innerText = "Show on the map";
    showBtn.addEventListener("click", e => jumpToParcel(parcel));

    var updateForm = createUpdateForm(parcel);

    var updateBtn = document.createElement("button");
    updateBtn.classList.add("big-button");
    updateBtn.innerText = "Update details of this parcel";
    updateBtn.addEventListener("click", async (e) => {
        await updateParcel(parcel, updateForm)
        layerGroup.clearLayers();
        putParcelsOnMap();
        parcel = updateParcelJSON(updateForm, parcel);
        setDefaultControlPanel();
        openParcelDetailsPanel(parcel);
    });

    var deleteBtn = document.createElement("button");
    deleteBtn.classList.add("big-button");
    deleteBtn.innerText = "Delete this parcel";
    deleteBtn.addEventListener("click", async e => {
        await deleteParcel(parcel)
        layerGroup.clearLayers();
        putParcelsOnMap();
        setDefaultControlPanel();
    });


    dpanel.appendChild(headerBar);
    dpanel.appendChild(showBtn);
    dpanel.appendChild(updateForm);
    dpanel.appendChild(updateBtn);
    dpanel.appendChild(deleteBtn);
}

function updateParcelJSON(updateForm, parcel) {
    var psVals = ["lat", "lng", "length", "width", "height"];
        var dict = {};
        for (var i = 0; i < 5; i++) {
            if (updateForm[i].value != null) {
                parcel[psVals[i]] = updateForm[i].value;
            }
        }
    return parcel;
}


function createUpdateForm(parcel) {
    var frm = document.createElement("form");
    frm.classList.add("update-form");

    var lbl, inpt;

    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "lat");
    lbl.innerText = "Latitude";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "lat");
    inpt.value = parcel.lat;
    frm.appendChild(inpt);

    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "lng");
    lbl.innerText = "Longitude";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "lng");
    inpt.value = parcel.lng;
    frm.appendChild(inpt);

    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "length");
    lbl.innerText = "Length";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "length");
    inpt.value = parcel.length;
    frm.appendChild(inpt);


    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "width");
    lbl.innerText = "Width";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "width");
    inpt.value = parcel.width;
    frm.appendChild(inpt);


    lbl = document.createElement("label");
    lbl.classList.add("parameter-label");
    lbl.setAttribute("for", "height");
    lbl.innerText = "Height";
    frm.appendChild(lbl);

    inpt = document.createElement("input");
    inpt.classList.add("parameter-input");
    inpt.setAttribute("type", "text");
    inpt.setAttribute("name", "height");
    inpt.value = parcel.height;
    frm.appendChild(inpt);

    return frm;
}


function putMarker(e) {
    if (tmpMarker == null) {
        tmpMarker = L.marker(e.latlng)
            .addTo(layerGroup);
    } else {
        tmpMarker
            .setLatLng(e.latlng)
            .update();
    }
}

function handleAddNewParcelClick(frm) {
    if (tmpMarker == null || frm[0].value == null || frm[1].value == null || frm[2].value == null) {
        alert("You need to select place for delivery and size of the parcel first!")
    } else {
        tryPostingParcel('http://0.0.0.0:8080/api/parcel',
            {lat: tmpMarker._latlng.lat,
                lng: tmpMarker._latlng.lng,
                length: frm[0].value,
                width: frm[1].value,
                height: frm[2].value})
            .then(result => {
                tmpMarker = null;
                map.removeEventListener("click", putMarker);
                setDefaultControlPanel();
        });
    }
}

function jumpToParcel(parcel) {
    map.flyTo([parcel.lat, parcel.lng]);
}