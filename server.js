const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//process.env is an object that stores all of our environment variables
//as key value pairs. We are looking for one that heroku is going to set called PORT
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

//middleware lets you configure how your express application works
//express usually works like this but use it like this instead
//app.use takes the middleware function you want to use
//if express doesn't do something you would like it to do and teach it how to do it
//this is an middleware function that i created
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append to server.log')
    }
  });
  next(); //won't move on until next is called (handlers wont't run)
})

//next is not called so the handlers at the bottom dont get called
app.use((req, res, next) => {
  res.render('maintenance.hbs', {
  })
})

//build in middleware function
//teach middleware to read from a static directory
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

//setup a handler for a http get request
app.get('/', (req, res) => {
  // res.send('<h1>Hello Express</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'you have visited the home page',
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage : 'Unable to handle request'
  });
})

app.listen(port, ()=> {
  console.log(`Server is up on ${port}`);
});
