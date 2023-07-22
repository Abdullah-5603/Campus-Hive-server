const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
// const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jjaqgwq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbConnect = async () => {
    try {
        await client.db("admin").command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error.message)
    }
}
dbConnect()

const usersCollection = client.db('CampusHive').collection('users')
const collegeCollection = client.db('CampusHive').collection('colleges')
const candidateCollection = client.db('CampusHive').collection('candidates')

// users api

app.post('/all-users', async (req, res) => {
    const user = req.body;
    const query = { email: user?.email }
    const existingUser = await usersCollection.findOne(query);
    if (existingUser) {
        return res.send({})
    }
    const result = await usersCollection.insertOne(user)
    res.send(result)
})

app.get('/all-users', async (req, res) => {
    const result = await usersCollection.find().toArray()
    res.send(result)
})

app.get('/current-user', async (req, res) => {
    const email = req.query.email;
    const query = { email: email }
    const result = await usersCollection.findOne(query)
    res.send(result)
})

// candidates api

app.post('/candidates', async (req, res) => {
    const candidate = req.body;
    const result = await candidateCollection.insertOne(candidate)
    res.send(result)
})

// college api

app.get('/all-colleges', async (req, res) => {
    const result = await collegeCollection.find().toArray()
    res.send(result)
})

app.get('/all-colleges/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await collegeCollection.findOne(query)
    res.send(result);
})

app.get('/', (req, res) => {
    res.send('Campus Hive is Running')
})

app.listen(port, (req, res) => {

})