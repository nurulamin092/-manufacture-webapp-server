const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${[process.env.DB_PASS]}@cluster0.5vk1e.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('bicycle_manufacture').collection('products');
        const userCollection = client.db('bicycle_manufacture').collection('users');

        app.get('/product', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        });

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.post('/product', async (req, res) => {
            const addNewItem = req.body;
            const result = await productsCollection.insertOne(addNewItem);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Bicycle manufacture!')
})

app.listen(port, () => {
    console.log(`Bicycle Manufacture App listening on port ${port}`)
})