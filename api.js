// setup database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:'); // database will be stored in RAM only
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS phone_book (id INTEGER PRIMARY KEY, name TEXT, number TEXT)");
    db.run("INSERT INTO phone_book (name, number) VALUES (?, ?)", "Bob", "+381641234567");
    db.run("INSERT INTO phone_book (name, number) VALUES (?, ?)", "Alice", "+38163122333");
    db.run("INSERT INTO phone_book (name, number) VALUES (?, ?)", "Lee", "+381628000111");
});



let x;
// db.each('SELECT rowid AS md, name, max(id) AS id FROM phone_book', function (err, row) {
//     console.log(row.id + ': ' + row.name)
//     x=row.id;

//   })

  
// define api object
const express = require('express')
var cors = require('cors')
const api = express();

api.use(cors())

var bodyParser = require('body-parser');
api.use(bodyParser.json()); // support json encoded bodies
api.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//define API endpoints
api.get('/:id', (req, res) => {
    const id = req.params['id'];

    db.each('SELECT rowid AS md, name, max(id) AS id FROM phone_book', function (err, row) {
        console.log(row.id + ': ' + row.name)
        x=row.id;
    
      })


    db.get("SELECT id, name, number FROM phone_book WHERE id=(?)", id, function(err, row){
        
        res.json({ "name" : row.name, "number" : row.number, "id" : row.id, "maxid" : x });
        
    });

  })



api.get('/', function (req, res) {
    const id = req.params['id'];

    db.all("SELECT * FROM phone_book",id, function(err, rows) {

        // res.json({ "name" : row.name, "number" : row.number, "id" : row.id, "maxid" : x });
        console.log(rows);
        res.json({rows});
    });

   
   
    // res.send('about')
  })

// api.post('/', function (req, res) {
//     res.send('Got a POST request')
//   })
// let y=x+1;
// api.post('/:y', function(req, res){
    
 
//     db.run("INSERT INTO phone_book (name, number) VALUES (?, ?)", "Ooooooo", "+38160000000");
    
//     db.each('SELECT rowid AS md, name, max(id) AS id FROM phone_book', function (err, row) {
//         console.log(row.id + ': ' + row.name)
//         x=row.id;
    
//       })

     

//     });

api.delete('/:id', function (req, res) {
    const id = req.params['id'];
    db.run("DELETE FROM phone_book WHERE id=(?)", id, function(err) {
        if(err){
            console.log(err)
        }
        else{
            console.log("Successful");
        }
   
      }) 
      db.each('SELECT rowid AS md, name, max(id) AS id FROM phone_book', function (err, row) {
        console.log(row.id + ': ' + row.name)
        x=row.id;
    
      })
    })    
  
// api.get('/random', function (req, res) {
//     res.send('random.text')
//   })

api.get('/getnumber/:name', (req, res) => {
    const name = req.params['name'];

    db.each('SELECT rowid AS md, name, max(id) AS id FROM phone_book', function (err, row) {
        console.log(row.id + ': ' + row.name)
        x=row.id;
    
      })


    db.get("SELECT id, name, number FROM phone_book WHERE name=(?)", name, function(err, row){
        
        res.json({ "name" : row.name, "number" : row.number, "id" : row.id, "maxid" : x });
        
    });

  })




  
api.post('/add', urlencodedParser, function(req, res){
    if (!req.body) return res.sendStatus(400)
    console.log("opa", req.body)
    var name = req.body.name;
    var number = req.body.number;
 
    db.run("INSERT INTO phone_book (name, number) VALUES (?, ?)", name, number);
    
    db.each('SELECT rowid AS md, name, max(id) AS id FROM phone_book', function (err, row) {
        console.log(row.id + ': ' + row.name)
        x=row.id;
    
      })

     

    });





api.listen(3000, () => console.log('Example app listening on port 3000!'))
