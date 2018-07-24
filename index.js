
const express = require('express');
const app = express();


const mongo_lab = 'mongodb://<dbuser>:<dbpassword>@ds247141.mlab.com:47141/lg_dev';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello MapsLab.io');
});





const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Listening on ${port} ...`);
});


/*
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./logger');

app.use(helmet());
app.use(morgan('combined'));

app.use(logger);

app.use(function (req, res, next) {
    console.log('Authenticating ...');
    next();
});

const courses = [
    {id:1, name: 'c1'},
    {id:2, name: 'c2'},
    {id:3, name: 'c3'}
]

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.send('404')
    }
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const course = {
        id: courses.length +1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});


app.get('/api/ltrack/:year/:month/:day/:hour', (req, res) => {
    res.send(req.query);
});

*/
