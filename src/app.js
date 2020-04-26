//app.js to export the app ready for integration testing

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const { NODE_ENV } = require('./config')
const articlesRouter = require('./articles/articles-router')

const app = express() //express instance

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet()) //Make sure to place helmet before cors in the pipeline. 17.6
app.use(cors())

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})


app.use('/articles', articlesRouter)

/*
//for demonstration of xss attack (17.16, p. 15-18)
app.get('/xss', (req,res) => {
  res.cookie('secretToken', '1234567890');
  res.sendFile(__dirname + '/xss-example.html');
})
*/

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

module.exports = app //export the express instance



