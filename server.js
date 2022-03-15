require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')
var mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Basic Configuration
app.use(cors())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.render('index')
})

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

const port = process.env.PORT || 5500
app.listen(port)
