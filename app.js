import express from 'express';

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

//defining a default route
app.get('/', (req, res) => {
   // res.send('Welcome to Poppa\'s Pizza');
   res.sendFile(`${import.meta.dirname}/views/home.html`); //when user accesses main page it sends the file
});

//Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/contact.html`)
});

//Add a submission route to display a thank you message
app.get('/confirm-order', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/confirm.html`)
});

//Add a menu route to display menu
app.get('/menu', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/menu.html`)
});


//add an admin route
app.get('/admin', (req, res) => {
    res.send(orders);
});


//Add a route to process the pizza order => post = recoeving form data
app.post('/submit-order', (req, res) => {

    //create a JSON object to store order data
    const order = req.body;
    order['timestamp'] = new Date();
    console.log(order);
   //add order object to orders array
   orders.push(order);
   console.log(orders);

   //Display confirmation page
   res.sendFile(`${import.meta.dirname}/views/confirm.html`)
});

//start server on designated port
app.listen(PORT, () => {
    console.log(`Server is runnning at http://localhost:${PORT}`);
});