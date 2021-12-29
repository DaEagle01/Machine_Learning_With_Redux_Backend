const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dngm2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("machineLearning");
    const learnings = database.collection("learnings");
    const solutionCollecton = database.collection("solutions");

    // get all the soloutions
    app.get("/solutions", async (req, res) => {
      const result = await solutionCollecton.find({}).toArray();
      res.json(result);
      res.send(result);
    });

    // get specific soluiton using id query
    app.get("/solutions/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const result = await solutionCollecton.findOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
