// Moduli
const fastify = require('fastify')({ logger: true })
const func=require('./func');
// API CRUD
fastify.register(require('./route.js'));
// Server listen
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  func.log("[32m","Listening");
})