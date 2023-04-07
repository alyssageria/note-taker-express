const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// })

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public//notes.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })
})

app.post('/api/notes', (req, res) => {
    if (req.method === 'POST') {
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) throw err;
            const notes = JSON.parse(data);
            const newNote = req.body;
            newNote.id = uuidv4(); // generate unique ID for the new note
            notes.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
                if (err) throw err;
                res.json(newNote);
            });
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
// app.post('/api/notes', (req, res) => {

// })

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});
