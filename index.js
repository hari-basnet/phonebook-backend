require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

// custom method for logging POST request content
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// log
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

const persons = [
  {
    id: "1",
    name: "Hari Basnet",
    number: "0407407800",
  },
  {
    id: "2",
    name: "Muna Thapa Basnet",
    number: "0407407801",
  },
];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    console.log(persons);
    response.json(persons);
    mongoose.connection.close();
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const result = persons.find((person) => person.id === id);

  if (!result) {
    response.status(404).send("Not found");
  }
  response.json(result);
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const result = persons.filter((person) => person.id !== id);
  response.send(`Person with id ${result.id} has been successfully deleted!`);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p></br><p>${currentDate.toString()}</p>`
  );
});

app.listen(PORT, () => {
  console.log("App listening in port", PORT);
});
