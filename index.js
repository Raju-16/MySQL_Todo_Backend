const express = require("express");
const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Database name ,root,password
const seq = new Sequelize("firstdb", "root", process.env.PASSWORD, {
  host: "localhost",
  //    name of database Type you are using.
  dialect: "mysql",
});

// making schema.
// Notes table you want to create.
const Notes = seq.define("Notes", {
  text: Sequelize.STRING,
});

// controller
app.get("/", async (req, res) => {
  try {
    const result = await Notes.findAll();
    res.status(200).json({ isError: false, result });
  } catch (err) {
    res.status(500).json({ message: err.message, isError: true });
  }
});

app.post("/", async (req, res) => {
  try {
    const result = await Notes.create(req.body);
    res.status(201).json({ isError: false, result });
  } catch (err) {
    res
      .status(500)
      .json({ isError: err.message, message: "error while posting.." });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const result = await Notes.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ isError: false, result });
  } catch (err) {
    res.status(500).json({ isError: true, message: "error while getting" });
  }
});

// CONNECTING TO DB WILL GIVE PROMISE.
seq.sync().then(() => {
  app.listen(5000, () => {
    console.log("listening on port 5000");
  });
});
