const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const app = express();
let PORT = process.env.PORT;
app.set('view engine', ejs);
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));

//set the mongoDB connection
mongoose.connect('mongodb://localhost:27017/wikiAPI', err => {
  if (!err) {
    console.log('Database connected');
  }
});

const wikiSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const WIKI = mongoose.model('airtcle', wikiSchema);

//set the routes
app
  .route('/airtcle')
  .get((req, res) => {
    WIKI.find({}, (err, items) => {
      res.send(items);
    });
  })
  .post((req, res) => {
    const newTitle = req.body.title;
    const newContent = req.body.content;
    const newAirtcle = new WIKI({
      title: newTitle,
      content: newContent,
    });
    newAirtcle.save(err => {
      if (!err) {
        res.redirect('/airtcle');
      }
    });
  })
  .delete((req, res) => {
    WIKI.deleteMany({}, err => {
      if (!err) {
        res.send('Deleted all data');
      } else {
        res.send(err);
      }
    });
  });

app
  .route('/airtcle/:topic')

  .get((req, res) => {
    const topic = req.params.topic;
    WIKI.find({title: topic}, (err, result) => {
      if (result) {
        res.send('Sucess');
      } else {
        console.log(err);
      }
    });
  })

  .put((req, res) => {
    WIKI.updateOne(
      {title: req.params.title},
      {
        title: req.body.title,
        content: req.body.content,
      },
      err => {
        if (!err) {
          res.send('Data updated sucessfully!');
        } else {
          res.send(err);
        }
      },
    );
  })

  .patch((req, res) => {
    WIKI.updateOne(
      {title: req.params.title},
      {$set: req.body},
      (err, results) => {
        if (!err) {
          res.send('Udpated the data');
        } else {
          res.send(err);
        }
      },
    );
  })

  .delete((req, res) => {
    WIKI.deleteOne({title: req.params.topic}, (err, results) => {
      if (!err) {
        res.send('Data Delted successfully');
      }
    });
  });

if (PORT == '' || PORT == null) {
  PORT = 3000;
}
app.listen(PORT, err => {
  if (!err) {
    console.log('Server Online at port ' + PORT);
  }
});
