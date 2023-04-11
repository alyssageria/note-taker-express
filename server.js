// packages needed for the application
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const { v4: uuidv4 } = require('uuid');

// express app and port variable
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// reads json file and returns content as an array of notes
const getNotes = () => {
    return readFile("db/db.json", "utf-8").then(notes => [].concat(JSON.parse(notes)))
}

// get the html files for the home and notes page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// return an array of notes in json format
app.get('/api/notes', (req, res) => {
    getNotes().then(notes => res.json(notes)).catch(err => res.json(err))
})

// adds new notes to json file
app.post('/api/notes', ({ body }, res) => {
    getNotes().then(oldNotes => {
        const newNotes = [...oldNotes, { title: body.title, text: body.text, id: uuidv4() }]
        writeFile("db/db.json", JSON.stringify(newNotes)).then(() => res.json({ msg: "okay" })).catch(err => res.json(err));
    })
});

// route to delete notes
app.delete('/api/notes/:id', (req, res) => {
    getNotes().then(oldNotes => {
        const newNotes = oldNotes.filter(note => note.id !== req.params.id)
        writeFile("db/db.json", JSON.stringify(newNotes)).then(() => res.json({ msg: "okay" })).catch(err => res.json(err));
    })
})

//catch all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

// server listener
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});
