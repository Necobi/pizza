import express from 'express';

const app = express();

//define a port number for server to listen on
const PORT = 3000;

//enable static file serving 
app.use(express.static('public')); //grab static files from the public folder => images and styles NOT html

//defining a default route
app.get('/', (req, res) => {
   // res.send('Welcome to Poppa\'s Pizza');
   res.sendFile(`${import.meta.dirname}/views/home.html`); //when user accesses main page it sends the file
});

//start server on designated port
app.listen(PORT, () => {
    console.log(`Server is runnning at http://localhost:${PORT}`);
});