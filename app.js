const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
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
  let count = 1;
  let existVisitor = Visitor.findOne({ "name": name }, function(err, value) {
    if (err) return console.error(err);
    console.log( "El visitante " + value + " existe" );
  });

  if (!name || name.length === 0) {
    name = "Anónimo";
    Visitor.create({ name: name, count: count }, function(err) {
      if (err) return console.error(err);
    });
  } else if ( Visitor.findOne({ "name": name }) != null ) {
    Visitor.findOne({ name: name}, function(err, article) {
      if (err) return console.error(err);
      console.log(article.count);
      article.count = article.count + 1;
      article.save(function(err) {
        if (err) return console.error(err);
      });
    });
  } else {
    Visitor.create({ name: name, count: count }, function(err) {
      if (err) return console.error(err);
    });
  }

  Visitor.find( function(err, visitors){
    let visitorCount = [];
    visitors.forEach( function(visitor){
      visitorCount.push(visitor);
    });
    console.log( visitorCount );
    res.render( 'visitorTable', {
     visitorCount: visitorCount
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000!'));


