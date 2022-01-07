const express = require('express');
const res = require('express/lib/response');
const fs = require('fs');
const path = require('path');
let db = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

// GET route to read and return db.json file as JSON
app.get('/api/notes', (req, res) =>
    res.json(db)
);

// POST route will save new note, add to db.json file, then return it to client
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uuid(),
    };
    db.push(newNote)
    fs.writeFile('./db/db.json', JSON.stringify(db), () => {
        console.log('db is here')
        res.json(newNote)
    })
});

app.delete('/api/notes/:id', (req, res) => {
    const updatedDb = db.filter((note) => {
        return note.id != req.params.id
    })
    fs.writeFile('./db/db.json', JSON.stringify(updatedDb), () => {
        console.log('db is here')
        res.json(updatedDb)
    })
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
