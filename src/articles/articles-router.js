const path = require('path') //one of Node's internal modules that supports a method called .join to calculate a valid path without any double slashes
const express = require('express')
const xss = require('xss') //tool that sanitizes strings of content

const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const jsonParser = express.json()

const serializeArticle = article => ({
    id: article.id,
    style: article.style,
    title: xss(article.title), //sanitize title
    content: xss(article.content), //sanitize content
    date_published: article.date_published
})

articlesRouter
    .route('/') // -------------------------------------------------------------// route('/')
    //GET
    .get((req, res, next) => {
        ArticlesService.getAllArticles(
            req.app.get('db')
        )
            .then(articles => {
                res.json(articles.map(serializeArticle))
            })
            //passing next into .catch from the promise chain so that any errors 
            //get handled by our error handler middleware
            .catch(next)
    })  
    //POST
    .post(jsonParser, (req, res, next) => {
        const { title, content, style } = req.body
        const newArticle = { title, content, style}
        
        for(const [key, value] of Object.entries(newArticle)){
            if(value == null){
                return res
                    .status(400)
                    .json({error: {message: `Missing '${key}' in request body`}})
            }
        }
 
        ArticlesService.insertArticle(
            req.app.get('db'),
            newArticle
        )
        .then(article => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl `/${article.id}`)) //as windows paths are \ rather than /, we will use posix variant of the join method to create a web valid path
                .json(serializeArticle(article))
        })
        .catch(next)
    })

articlesRouter
    .route('/:article_id') // -------------------------------------------------------------// route('/:article_id')
    //ALL
    //the .all() handler triggers for all methods (GET, DELETE, etc.)
    .all((req,res,next) => {
        ArticlesService.getById(
            req.app.get('db'),
            req.params.article_id
        )
            .then(article => {
                if(!article) {
                    return res.status(404).json({
                        error: {message: `Article doesn't exist`}
                    })
                }
                res.article = article //save the article for the next middleware
                next() //don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    //GET
    .get((req, res, next) => {
        res.json({
            id: res.article.id,
            style: res.article.style,
            title: xss(res.article.title), //sanitize title
            content: xss(res.article.content), //sanitize content
            date_published: res.article.date_published,
        })
    })
    //DELETE
    .delete((req,res,next) => {
        ArticlesService.deleteArticle(
            req.app.get('db'),
            req.params.article_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    //PATCH
    .patch(jsonParser, (req, res, next) => {
       const { title, content, style } = req.body
       const articleToUpdate = { title, content, style }

       const numberOfValues = Object.values(articleToUpdate).filter(Boolean).length
       if (numberOfValues === 0) {
         return res.status(400).json({
           error: {
             message: `Request body must contain either 'title', 'style' or 'content'`
           }
         })
       }

       ArticlesService.updateArticle(
         req.app.get('db'),
         req.params.article_id,
         articleToUpdate
       )
         .then(numRowsAffected => {
           res.status(204).end()
         })
         .catch(next)
    })




module.exports = articlesRouter

