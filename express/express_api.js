const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3000;

// Connection URI for MongoDB Atlas
//mongodb+srv://alialsaedi2000:<password>@alicluster.k0stykf.mongodb.net/
//const uri = 'mongodb+srv://alialsaedi2000:oZr5OxC2Memjmhl3@alicluster.k0stykf.mongodb.net/?retryWrites=true&w=majority&appName=alicluster';
const uri = 'mongodb+srv://alialsaedi2000:oZr5OxC2Memjmhl3@alicluster.k0stykf.mongodb.net/'

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB Atlas database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB ");
  } catch (err) {
    console.error("Error connecting to MongoDB :", err);
  }
}

connectToDatabase();


// Middleware for CORS
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

// Custom middleware to parse JSON bodies
app.use(function(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });
    req.on('end', () => {
      req.body = JSON.parse(data);
      next();
    });
  } else {
    next();
  }
});

// Define the 'books' collection in the MongoDB Atlas database
let booksCollection;

// Connect to the 'library' database and 'books' collection
client.connect().then(() => {
  const db = client.db('books');
  booksCollection = db.collection('rick books');
}).catch(err => console.error("Error connecting to database:", err));

app.get('/books', async (req, res) => {
    try {
        const books = await booksCollection.find({}, { projection: { _id: 0 } }).toArray();
        console.log("Books:", books); // Log the retrieved books for debugging
        
        // Send each book object individually
        books.forEach(book => {
            res.write(JSON.stringify(book) + '\n');
        });
        res.end();
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await booksCollection.findOne({ id: parseInt(req.params.id) });
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
        } else {
            res.json(book);
        }
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/books', async (req, res) => {
  try {
    const newBook = req.body;
    const existingBook = await booksCollection.findOne({ id: newBook.id });
    if (existingBook) {
      res.status(403).json({ error: 'Book already exists' });
    } else {
      await booksCollection.insertOne(newBook);
      res.status(201).json(newBook);
    }
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Other routes for updating and deleting books...

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
