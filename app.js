const express = require('express');
const app = express();
const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });
// el resto del código
// definimos el schema
const schema = mongoose.Schema({
  id: ObjectId,
  name: String,
});
// definimos el modelo
const Visitor = mongoose.model("Visitor", schema);

Visitor.create({ title: "Artículo 2", body: "Cuerpo del artículo" }, function(err) {
  if (err) return console.error(err);
});
app.listen(3000, () => console.log('Listening on port 3000!'));
