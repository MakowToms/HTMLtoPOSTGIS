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
      const response =  await fetch("http://0.0.0.0:8080/api/parcel/all")
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error:', error);
    }
}

