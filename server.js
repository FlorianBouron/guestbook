let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    Message = require('./models/message');;

// Templates
app.set('view engine', 'ejs');

// Middleware
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'f5sd64987hds5',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(require('./middlewares/flash'));

// Routes
app.get('/', (request, response) => {
    Message.all(function (messages) {
        response.render('pages/index', {messages: messages});
    });
});

app.post('/', (request, response) => {
   if(request.body.message === undefined || request.body.message === ''){
       request.flash('error', "You didn't write any message");
       response.redirect('/');
   } else {
       Message.create(request.body.message, function () {
           request.flash('success', "Thank you!");
           response.redirect('/');
       });
   }
});

app.get('/message/:id', (request, response)=> {
   Message.find(request.params.id, function (message) {
       response.render('messages/show', {message: message});
   }) 
});

app.listen(8080);