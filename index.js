const express = require("express")
const cors = require("cors")
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express()
const port = process.env.PORT || 5000

let db_url =
"mongodb+srv://Bib92:8095762@chucky-gtnbt.mongodb.net/Foodtracker?retryWrites=true&w=majority"
const client = new MongoClient(db_url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json())
app.use(cors())

app.use(express.json())
app.use(cors())

//get all foodies
app.get('/foodies', (req, res) => {
  client.connect (err => {
    if (!err) {
      const collection = client.db("Foodtracker").collection("foodies");
      const results = collection.find({}).toArray((err, docs) => {
        console.log(docs);
        res.send(docs);
      });
    } else {
      console.log(err);
    }
    client.close();
  });
});


//get foodies by search, using two path params
app.get("/foodies/:key/:value", (req, res) => {
  client.connect(err => {
    if (!err) {
      const collection = client.db("Foodtracker").collection("foodies");
      const results = collection
        .find({ [req.params.key]: req.params.value }) 
        .toArray((err, docs) => {
          console.log(docs);
          res.send(docs);
        });
    } else {
      console.log(err);
    }
    client.close();
  });
});

app.post("/foodie", (req, res) => {
    const body = req.body;
    client.connect(async err => {
      if(!err) {
        const collection = client.db("Foodtracker").collection("foodies");
        const results = await collection.insertOne(body);
        res.send(results.insertedId);
      }else {
        console.log(err)
      }
      
      client.close();
    });
});

app.post("/foodies", (req, res) => {
    const body = req.body;
    client.connect(async err => {
      if (!err) {
        const collection = client.db("Foodtracker").collection("foodies");
        const results = await collection.insertMany(body);
        res.send(results);
      } else {
        console.log(err);
      }
      client.close();
    });
});

app.put("/foodies/:ID", (req, res) => {
  const body = req.body;
  client.connect(async err => {
    if (!err) {
      const collection = client.db("Foodtracker").collection("foodies");
      const results = await collection.updateOne(
        { _id: ObjectId(req.params.ID) },
        { $set: body }
      );
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});

//delete lead by ID
app.delete("/foodies/:ID", (req, res) => {
  client.connect(async err => {
    if (!err) {
      const collection = client.db("Foodtracker").collection("foodies");
      // perform actions on the collection object
      const results = await collection.deleteOne({
        _id: ObjectId(req.params.ID)
      });
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});


app.listen(port,() => {console.log(`Listening on port ${port}`)})
