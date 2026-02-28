const axios = require('axios');
axios.post('http://localhost:3000/api/chat', { message: "My heart rate is 120 bpm" })
    .then(res => console.log(JSON.stringify(res.data, null, 2)))
    .catch(err => {
        if (err.response) {
            console.error("HTTP Error:", err.response.status);
            console.error(JSON.stringify(err.response.data, null, 2));
        } else {
            console.error(err.message);
        }
    });
