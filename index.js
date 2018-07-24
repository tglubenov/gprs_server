const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');

const mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://lg:TGL2018!!@ds247141.mlab.com:47141/lg_dev', function (error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var JsonSchema = new Schema({
    name: String,
    type: Schema.Types.Mixed
});

// Mongoose Model definition
var Json = mongoose.model('JString', JsonSchema, 'layer_collection');




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/* Get Home Page */
//app.get('/');

app.get('/hello', (req, res) => {
    res.send('Hello MapsLab.io');
});


app.get('/about', (req, res) => {
    res.render('about.hbs');
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on ${port} ...`);
});

/*
https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61

https://blogs.scientificamerican.com/doing-good-science/the-quest-for-underlying-order-inside-the-frauds-of-diederik-stapel-part-1/

https://blogs.scientificamerican.com/doing-good-science/reluctance-to-act-on-suspicions-about-fellow-scientists-inside-the-frauds-of-diederik-stapel-part-4/

https://www.nytimes.com/2013/04/28/magazine/diederik-stapels-audacious-academic-fraud.html?pagewanted=all&_r=0

https://www.rethinkdb.com/docs/guide/javascript/

https://www.mkyong.com/mongodb/mongodb-allow-remote-access/

https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93

https://codeburst.io/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054

https://stackoverflow.com/questions/18251128/why-am-i-suddenly-getting-a-blocked-loading-mixed-active-content-issue-in-fire



*/