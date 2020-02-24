const express = require('express');
const app = express();
const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mydatabase', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });
// definimos el schema
const schema = new mongoose.Schema({
  count: Number,
  name: String
});
// definimos el modelo
const Visitor = mongoose.model("Visitor", schema);
const visitorTable = {};

app.get('/', (req, res) => {
  let name = req.query.name;
  if (!name || name.length === 0) {
    name = "Anónimo";
  }

  Visitor.create({ name: name }, function(err) {
    if (err) return console.error(err);
  });

  Visitor.find(function(err, visitors){
    visitors.forEach(function(visitor){
      visitorTable[visitor] = visitor;
    });
    console.log(visitorTable);
  });

  res.send (visitorTable);
});

app.listen(3000, () => console.log('Listening on port 3000!'));
