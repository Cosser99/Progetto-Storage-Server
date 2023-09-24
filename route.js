const {_login,ins_data,get_data,put_data,del_data}=require('./handler.js');
function serverRoutes(fastify,options,done)
{

    fastify.post('/login',_login)
    fastify.post('/data',ins_data)
    fastify.get('/data/:id',get_data)
    fastify.put('/data/:id',put_data)
    fastify.delete('/data/:id',del_data)
    done();
}

module.exports = serverRoutes;