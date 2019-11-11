async function tryPostingParcel(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
         'Content-Type': 'application/json'
        }
      });
      const status = await response.status;
      console.log('Success - status:', status);
    } catch (error) {
      console.error('Error:', error);
    }
}

async function tryGettingParcels() {
    try {
      const response =  await fetch("http://0.0.0.0:8080/api/parcel/all");
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error:', error);
    }
}

async function updateParcel(parcel, updateForm) {
    var data = getValuesToUpdate(updateForm);
    try {
        const response = await fetch("http://0.0.0.0:8080/api/parcel/" + parcel.parcelId, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
             'Content-Type': 'application/json'
            }
        });
        const status = await response.status;
        console.log('Success - status:', status);
    } catch (error) {
        console.error('Error:', error);
    }
}

function getValuesToUpdate(updateForm) {
    var psVals = ["lat", "lng", "length", "width", "height"];
    var dict = {};
    for (var i = 0; i < 5; i++) {
        if (updateForm[i].value != null) {
            dict[psVals[i]] = updateForm[i].value;
        }
    }
    return dict;
}

async function deleteParcel(parcel) {
    try {
        const response = await fetch("http://0.0.0.0:8080/api/parcel/" + parcel.parcelId, {
            method: 'DELETE',
        });
        const status = await response.status;
        console.log('Success - status:', status);
    } catch (error) {
        console.error('Error:', error);
    }
}