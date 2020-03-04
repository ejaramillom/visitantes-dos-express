const express = require( "express" );
const mongoose = require( "mongoose" );
const bodyParser = require( "body-parser" );
const app = express();

mongoose.connect( process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1", { useNewUrlParser: true });
mongoose.connection.on( "error", function(e) { console.error(e); });
// definimos el schema
const schema = new mongoose.Schema({
  name: String,
  count: Number
});
// definimos el modelo
const Visitor = mongoose.model( "Visitor", schema );
// definir las rutas app
app.set( "view engine", "pug" );
app.set( "views", "views" );
app.use( bodyParser.urlencoded({ extended: false }));
app.get( "/", async ( req, res ) => {
  let name = req.query.name;
  let visitorCount = [];
  let value = await Visitor.findOne({ name: name });
  let showVisitors = async function() {
    await Visitor.find(function(err, visitors){
      visitors.forEach(function(visitor){
        visitorCount.push(visitor);
      });
    });
    res.render("visitorTable", {
     visitorCount: visitorCount
    });
  };
  
  if (!name || name.length === 0) {
    visitor = new Visitor({ name: "Anónimo", count: 1 });
    visitor.save();
    showVisitors();
  } else if ( value == null )  {
    visitor = new Visitor({ name: name, count: 1 });
    visitor.save();
    showVisitors();
  } else {
    value.count = value.count + 1;
    value.save();
    showVisitors();
  }

});

app.listen(3000, () => console.log("Listening on port 3000!"));

