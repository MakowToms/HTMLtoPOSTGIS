window.addEventListener('DOMContentLoaded', () =>
    tryPostingData('http://0.0.0.0:8080/api/parcel',
                { lat: 10, lng: 10, height: 10, width: 10, length: 10 }))

async function tryPostingData(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      console.log('Success:', JSON.stringify(json));
    } catch (error) {
      console.error('Error:', error);
    }
}
const url = 'https://example.com/profile';
const data = { username: 'example' };

