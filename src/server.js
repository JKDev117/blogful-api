//server.js to start our server on an appropriate port
//place knex instance in server.js so that connection is explicit rather than implicit (17.15, p. 11)

const knex = require('knex')
const app = require('./app')

const { PORT, DB_URL } = require('./config')

//knex instance
const db = knex({
  client: 'pg',
  connection: DB_URL
})

//app.set('property-name', 'property-value')
//set a property called 'db' and set the knex instance as the value
//attach the knex instance to the app as a property
//any request handling middleware can now read the 'db' property on the app to get the knex instance
app.set('db', db) 


//tells app to start listening on a port number
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})



