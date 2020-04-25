//app.js to export the app ready for integration testing

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const { NODE_ENV } = require('./config')
const ArticlesService = require('./articles-service')


const app = express() //express instance

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet()) //Make sure to place helmet before cors in the pipeline. 17.6
app.use(cors())


app.get('/articles', (req, res, next) => {
  const knexInstance = req.app.get('db') //to read properties on the app object
  ArticlesService.getAllArticles(knexInstance)
    .then(articles => {
      res.json(articles)
    })
    .catch(next)
    //^^ passing next into .catch from the promise chain so that any errors 
    //get handled by our error handler middleware
})


app.get('/articles/:article_id', (req, res, next) => {
   const knexInstance = req.app.get('db')
   ArticlesService.getById(knexInstance, req.params.article_id)
     .then(article => {
       if(!article){
         return res.status(404).json({
           error: {message: `Article doesn't exist`}
         })
       }
       res.json(article)
     })
     .catch(next)
})


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


app.get('/', (req, res) => {
  res.send('Hello, world!')
})

module.exports = app //export the express instance



