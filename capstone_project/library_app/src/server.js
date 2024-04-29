/*
MONGO DB ASSIGNMENT
*/
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

const uri = 'mongodb+srv://alialsaedi2000:oZr5OxC2Memjmhl3@alicluster.k0stykf.mongodb.net/?retryWrites=true&w=majority&appName=alicluster'
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        app.listen(3001, () => {
            console.log(`Server is running on http://localhost:3001`);
        });
    } catch (e) {
        console.error(e);
    }
}

const db = client.db('books');
const books = db.collection('rick books');

/*               */
/* GET REQUESTS  */ 
/*               */
// GET all books 
app.get('/books', async (req, res) => {
    const { avail } = req.query;
    let query = {};
    if (avail !== undefined) {
        query.avail = (avail === 'true');
    }
    try {
        const booksList = await books.find(query).toArray();
        res.json(booksList);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

// GET book by id
app.get('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await books.findOne({ id: id });

    if (!book) {
        res.status(404).json({ error: 'Book does not exist' });
    } else {
        res.status(200).json(book);
    }
});

// GET available books
app.get('/books/avail/:avail', async (req, res) => {
    const avail = req.params.avail === 'true';  // Convert path parameter to boolean

    try {
        const booksList = await books.find({ avail: avail }).toArray();
        res.status(200).json(booksList);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

/*                */
/* POSt REQUESTS  */ 
/*                */
// POST new book
app.post('/books', async (req, res) => {
    const id = parseInt(req.body.id);  // Convert id to an integer
    if (isNaN(id)) {
        return res.status(404).json({ error: 'Invalid book ID' });
    }

    const existingBook = await books.findOne({ id: id });
    if (existingBook) {
        return res.status(403).json({ error: 'Book with this ID already exists' });
    }

    req.body.id = id;  // Make sure the id in the body is also an integer
    const result = await books.insertOne(req.body);
    const book = await books.findOne({ id: id });
    return res.status(200).json(book);

});

/*               */
/* PUT REQUESTS  */ 
/*               */
// PUT update book by id
app.put('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);  // Ensure ID is parsed as an integer
    if (isNaN(id)) {
        return res.status(404).json({ error: 'Invalid book ID' });
    }

    const existingBook = await books.findOne({ id: id });

    if (!existingBook) {
        return res.status(404).json({ error: 'Book does not exist' });
    }
    const result = await books.findOneAndUpdate(
        { id: id },
        { $set: req.body},
        { returnOriginal: false }  // Use returnOriginal set to false to get the updated document
    );
    return res.status(200).json(result);
  
});

/*                  */
/* DELETE REQUESTS  */ 
/*                  */
// DELETE book by id
app.delete('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await books.deleteOne({ id: id });

    if (result.deletedCount === 0 || !result) {
        res.status(204).json({ error: 'No content' });
    } else {
        res.status(200).json({ message: 'Book deleted' });
    }

});


main().catch(console.error);
