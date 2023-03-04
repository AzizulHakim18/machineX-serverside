const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;



const app = express()


// middle ware
app.use(cors());
app.use(express.json())

// mongodb


const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASSWORD}@cluster0.bmvnugw.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// run func
async function run() {

    try {
        const serviceCollection = client.db('machineX').collection("services");
        const orderCollection = client.db('machineX').collection("orders");

        // all services
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        // find a services for specific users
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            // console.log(query);
            const service = await serviceCollection.findOne(query);
            res.send(service)

        })


        // orders api
        app.get('/orders', async (req, res) => {
            let query = {}

            if (req.query.email) {
                query = { email: req.query.email }
            }
            app.post('/orders', (async (req, res) => {

                const order = req.body;
                console.log(order);
                const result = await orderCollection.insertOne(order);
                console.log(result);
                res.send(result);
            }))


            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send("Hello machine X")
})

app.listen(port, () => {
    console.log(`Machine X app is running on Port ${port}`)
})