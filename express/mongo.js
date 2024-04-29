const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

// Middleware for CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

const uri = 'mongodb+srv://alialsaedi2000:oZr5OxC2Memjmhl3@alicluster.k0stykf.mongodb.net/?retryWrites=true&w=majority&appName=alicluster';
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        app.listen(3000, () => {
            console.log(`running on http://localhost:3000`);
        });
    } catch (e) {
        console.error(e);
    }
}

const db = client.db('books');
const books = db.collection('rick books');

// get the books

app.get('/books', async (req, res) => {
    const { avail } = req.query;
    let query = {};
    if (avail !== undefined) {
        query.avail = (avail === 'true');
    }
    try {
        const booksList = await books.find(query).toArray();
        booksList.forEach(book => res.write(JSON.stringify(book) + '\n'));
        res.end();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//get book by id

app.get('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const book = await books.findOne({ id: id });
        if (!book) {
            res.status(404).json({ error: 'book doesnt exist' });
        } else {
            res.json(book);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get books by avliblity 

app.get('/books/avail/:avail', async (req, res) => {
    const avail = req.params.avail === 'true';  
    try {
        const booksList = await books.find({ avail: avail }).toArray();
        res.json(booksList);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//adiing a book via json

app.post('/books', async (req, res) => {
    const id = parseInt(req.body.id); 
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }
    try {
        const existingBook = await books.findOne({ id: id });
        if (existingBook) {
            return res.status(403).json({ error: 'book with this ID already exists' });
        }

        req.body.id = id;  
        const result = await books.insertOne(req.body);
        const book = await books.findOne({ id: id });
        res.status(201).json(book);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// adding a book by id

app.put('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id); 
    if (isNaN(id)) {
        return res.status(404).json({ error: 'Invalid book ID' });
    }

    try {
        const existingBook = await books.findOne({ id: id });

        if (!existingBook) {
            return res.status(404).json({ error: 'book doesnt exist' });
        }
        const result = await books.findOneAndUpdate(
            { id: id },
            { $set: req.body},
            { returnOriginal: false }  
        );
        console.log(result);
        res.json(result.value);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//delteting a book by id

app.delete('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await books.deleteOne({ id: id });
        if (result.deletedCount === 0 || !result) {
            res.status(204).json({ error: 'book doesnt exist' });
        } else {
            res.status(200).json({ message: 'book deleted' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


main().catch(console.error);