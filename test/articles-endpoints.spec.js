//for testing the articles endpoints

const {expect} = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeArticlesArray } = require('./articles.fixtures')


//.only so we're only running this test file whilst working on it
describe.only('Articles Endpoints', function() {
    let db
    
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('blogful_articles').truncate())

    afterEach('cleanup', () => db('blogful_articles').truncate())

    describe(`GET /articles`, () => {
       context(`Given no articles`, () => {
            it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get('/articles')
                .expect(200, [])
            })
        })//end context `Given no articles`

        context('Given there are articles in the database', () => {
            const testArticles = makeArticlesArray()

            beforeEach('insert articles', () => {
                return db
                    .into('blogful_articles')
                    .insert(testArticles)
            })

            it('responds with 200 and all of the articles', () => {
                return supertest(app)
                    .get('/articles')
                    .expect(200, testArticles) //with supertest, the 2nd arg to expect can be the res body that we expect
            })
        }) //end context 'Given there are articles in the database'
    }) //end describe `GET /articles`    

    describe(`GET /articles/:article_id`, () => {
        context(`Given no articles`, () => {
            it(`responds with 404`, () => {
            const articleId = 123456
            return supertest(app)
                .get(`/articles/${articleId}`)
                .expect(404, { error: { message: `Article doesn't exist` } })
            })
        })//end context `Given no articles`
  
  
        context('Given there are articles in the database', () => {
            const testArticles = makeArticlesArray()

            beforeEach('insert articles', () => {
                return db
                    .into('blogful_articles')
                    .insert(testArticles)
            })

            it('responds with 200 and the specified article', () => {
                const articleId = 2
                const expectedArticle = testArticles[articleId - 1]
                return supertest(app)
                    .get(`/articles/${articleId}`)
                    .expect(200, expectedArticle)
            })
        })//end context 'Given there are articles in the database'
    })//end describe `GET /articles/:article:id`

}) //end describe 'Articles Endpoints'