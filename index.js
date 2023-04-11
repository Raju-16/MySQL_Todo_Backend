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
// todo:table you want to create.
const todos = seq.define("todos", {
  text: Sequelize.STRING,
  status: Sequelize.BOOLEAN,
});

// controller
app.get("/", async (req, res) => {
  try {
    const result = await todos.findAll();
    res.status(200).json({ isError: false, result });
  } catch (err) {
    res.status(500).json({ message: "error while getting", isError: true });
  }
});

app.post("/", async (req, res) => {
  console.log("I am in post");
  try {
    const result = await todos.create(req.body);
    console.log("RESult", result);
    res.status(201).json({ isError: false, result });
  } catch (err) {
    res
      .status(500)
      .json({ isError: err.message, message: "error while posting.." });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const result = await todos.destroy({
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
