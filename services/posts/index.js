const express = require('express');
const port = require('./port');
const cors = require('cors');


const app = express();

const { readData } = require('./src/db');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));


app.get('/', (req, res) => {
    res.status(200).send('Messages API');
})

app.get('/posts', (req, res) => {
    console.log("Received in posts /posts")

    readData('messages')
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Reading posts from DB error' });
        })
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
