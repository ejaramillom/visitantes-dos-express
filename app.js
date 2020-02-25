const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mydb', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });
// definimos el schema
const schema = new mongoose.Schema({
  count: Number,
  name: String
});
// definimos el modelo
const Visitor = mongoose.model("Visitor", schema);
// definir las rutas app
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  let name = req.query.name;
  if (!name || name.length === 0) {
    name = "Anónimo";
    count = 1;
    Visitor.create({ name: name, count: count }, function(err) {
      if (err) return console.error(err);
    });
  }
  Visitor.updateOne({ name: name}, { count: count + 1 } );
  Visitor.find(function(err, visitors){
    const visitorCount = [];
    visitors.forEach(function(visitor){
      visitorCount.push(visitor);
    });
    console.log(visitorCount);
    res.render('visitorTable', {
     visitorCount: visitorCount
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000!'));
