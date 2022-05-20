require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')
const path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
const { Schema } = mongoose

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const urlSchema = new Schema({
  original_url: String,
  short_url: Number,
})

let URL = mongoose.model('URL', urlSchema)
app.use('/api/shorturl', bodyParser.urlencoded({ extended: false }))

// Basic Configuration
app.use(cors())
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.render(path.join(__dirname + '/views/index.ejs'))
})
// Your first API endpoint
app.post('/api/shorturl', (req, res) => {
  if (!req.body.url.match(/http/gi) || !req.body.url.match(/\.\w{3,}/gi)) {
    return res.json({
      error: 'invalid url',
    })
  }

  URL.find({}, (error, data) => {
    let url = new URL({
      original_url: req.body.url,
      short_url: data.length + 1 || 1,
    })

    URL.findOne({ original_url: req.body.url }, (error, data) => {
      if (data === null) {
        return saveURL()
      } else {
        return displayURL(data)
      }
    })

    function displayURL(data) {
      res.json({
        original_url: data.original_url,
        short_url: data.short_url,
      })
    }

    function saveURL() {
      url.save((err, data) => {
        if (err) {
          return console.log(error)
        } else {
          return data
        }
      })
      res.json({
        original_url: url.original_url,
        short_url: url.short_url,
      })
    }
  })
})

app.get('/api/shorturl/:short', (req, res, next) => {
  const shortURL = parseInt(req.params.short)
  URL.findOne({ short_url: shortURL }, (error, data) => {
    if (error) {
      return console.log(error)
    } else if (data === null) {
      res.json({
        message: 'No short Available',
      })
    } else {
      res.redirect(data.original_url)
      next()
    }
  })
})

const port = process.env.PORT || 5500
app.listen(port)
