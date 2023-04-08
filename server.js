const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const getNotes = () => {
    return readFile("db/db.json", "utf-8").then(notes => [].concat(JSON.parse(notes)))
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    getNotes().then(notes => res.json(notes)).catch(err => res.json(err))
})

app.post('/api/notes', ({ body }, res) => {
    getNotes().then(oldNotes => {
        const newNotes = [...oldNotes, { title: body.title, text: body.text, id: uuidv4() }]
        writeFile("db/db.json", JSON.stringify(newNotes)).then(() => res.json({ msg: "okay" })).catch(err => res.json(err));
    })
});

app.delete('/api/notes/:id', (req, res) => {
    getNotes().then(oldNotes => {
        const newNotes = oldNotes.filter(note => note.id !== req.params.id)
        writeFile("db/db.json", JSON.stringify(newNotes)).then(() => res.json({ msg: "okay" })).catch(err => res.json(err));
    })
})

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// })

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});
