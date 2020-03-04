const express = require( "express" );
const mongoose = require( "mongoose" );
const bodyParser = require( "body-parser" );
const app = express();

mongoose.connect( process.env.MONGODB_URL || "mongodb://localhost:27017/dataone", { useNewUrlParser: true });
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
  let value = await Visitor.findOne({ name: name });

  if (!name || name.length === 0) {
    visitor = new Visitor({ name: "Anónimo", count: 1 });
    visitor.save();
  } else if ( value == null )  {
    visitor = new Visitor({ name: name, count: 1 });
    visitor.save();
  } else {
    value.count = value.count + 1;
    value.save();
  }
  
  let visitorCount = await Visitor.find();

  res.render( "visitorTable", {
   visitorCount: visitorCount
  });

});

app.listen(3000, () => console.log( "Listening on port 3000!" ));
