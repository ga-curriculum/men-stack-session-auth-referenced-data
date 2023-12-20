const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const authController = require('./controllers/auth.js');
const locationsController = require('./controllers/locations.js')

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  if(req.session.user){
    res.redirect(`/locations`)
  }else{
    res.render('index.ejs', {
      user: null
    });
  }
});

app.use('/auth', authController);

app.use('/locations', (req, res, next)=>{
  if(req.session.user) {
    res.locals.user = req.session.user;
    next()
  }else{
    res.redirect('/')
  }
}, locationsController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
