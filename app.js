import express from 'express';

// Import mysql 
import mysql2 from 'mysql2';

//import .env class-package
import dotenv from 'dotenv';
dotenv.config();

 //Create a connection pool (bucket of db connectiom) create a bunch of connections to grab from
 const pool= mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
 }).promise();

 
const app = express();



//define a port number for server to listen on
const PORT = 3000;


//create array to store orders- eventually will store in database
const orders = [];

//enable static file serving 
app.use(express.static('public')); //grab static files from the public folder => images and styles NOT html


//Add "middleware" to Allow the app to parse form data
//Access form data through req.body
app.use(express.urlencoded({ extended: true}));

//Set new engine to EJS
app.set('view engine', 'ejs');

//create testing route for database (if you use await you have to use async) --await waits for a response from the db before code is executedd
/*app.get('/db-test', async(req,res) => {
    try{
        const [orders] = await pool.query('SELECT * FROM orders'); //[order] collects rows instead of rows and metadata
        res.send(orders);
    } catch(err){
        console.error('Database error: ', err);
        res.status(500).send('Database error occured.');
    }
});*/

//defining a default route
app.get('/', (req, res) => {
   // res.send('Welcome to Poppa\'s Pizza');
   res.render('home'); //when user accesses main page it sends the file
});

//Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

//Add a submission route to display a thank you message
/*app.get('/confirm-order', (req, res) => {
    res.render('confirm');
});*/

//Add a menu route to display menu
app.get('/menu', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/menu.html`)
});


//add an admin route
app.get('/admin', async(req, res) => {
     try{
        const [orders] = await pool.query('SELECT * FROM orders');
        console.log(orders);
        res.render('admin', {orders} );
    } catch(err){
        console.error('Database error: ', err);
        res.status(500).send('Database error occured.');
        
    }
    
});


//Add a route to process the pizza order => post = recoeving form data
app.post('/submit-order', async(req, res) => {

    //create a JSON object to store order data
    const order = req.body;
    order['timestamp'] = new Date();
    console.log(order);

    //concert toppings array to comma-delimited string
    order.toppings = Array.isArray(order.toppings)?
        order.toppings.join(", ") : "";
//define a sql query to insert the new order
const sql = `INSERT INTO orders (fname, lname, email, size, method, toppings, comment)
VALUES(?, ?, ?, ?, ?, ?, ?)`;

//CREATE AN ARRAY OD PARAMETERS FROM ORDER DATA
const params =[
    order.fname,
    order.lname,
    order.email,
    order.size,
    order.method,
    order.toppings,
    order.comment
];

//execurte query
const [result] = await pool.execute(sql, params);

order.id = result.insertId;
console.log("A new row was inserted with ID " + order.id);

   //Display confirmation page
   res.render('confirm', { order });
});

//start server on designated port
app.listen(PORT, () => {
    console.log(`Server is runnning at http://localhost:${PORT}`);
});