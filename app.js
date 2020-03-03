const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/dbsix", { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });
// definimos el schema
const schema = new mongoose.Schema({
  count: Number,
  name: String
});
// definimos el modelo
const Visitor = mongoose.model("Visitor", schema);
// definir las rutas app
app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {

  let name = req.query.name;
  let count = 1;
  let existVisitor =[];

  Visitor.find( function(err, visitors){
    let visitorCount = [];
    visitors.forEach( function(visitor){
      visitorCount.push(visitor);
    });
    if ( visitorCount.length == 0){
      visitorCount = [{ id: "", name: "", count: ""}];
      res.render( "visitorTable", {
       visitorCount: visitorCount
      });
    } else {
      res.render( "visitorTable", {
       visitorCount: visitorCount
      });
    }
  });

  Visitor.findOne({ name: name }, function( err, value ) {
     if (err) return console.error( err );
     existVisitor.push( name );

       if (!name || name.length === 0) {
         name = "Anónimo";
         Visitor.create({ name: name, count: count }, function( err ) {
           if (err) return console.error( err );
         });
         res.render( "visitorTable" );
       } else if ( value == null )  {
         Visitor.create({ name: name, count: count }, function( err ) {
           if (err) return console.error( err );
         });
         res.render( "visitorTable" );
       } else {
         value.count = value.count + 1;
         value.save(function(err) {
           if (err) return console.error(err);
         });
         res.render( "visitorTable" );
       }
   });
});

app.listen(3000, () => console.log("Listening on port 3000!"));
