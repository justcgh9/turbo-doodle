const express = require('express');
const port = require('./port');
const cors = require('cors');


const app = express();

const { readData, writeData} = require('./src/db');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));


app.get('/posts', (req, res) => {
    console.log("Received in posts: get /posts")

    readData('messages')
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Reading posts from DB error' });
        })
})

app.post('/posts', (req, res) => {
    const post = req.body;
    console.log("Received in posts: post / ", req.body)

    try {
        writeData('messages', post);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Writing a post to DB error' });
        return;
    }

    res.status(200).send({})
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
