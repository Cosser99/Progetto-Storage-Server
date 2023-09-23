// Moduli
const fastify = require('fastify')({ logger: true })
const jwt=require('jsonwebtoken');
const fs=require('fs');
const func=require('./func');
const schemi=require('./file_schema');
//Variabili

// Routes Options oggetto
	const get_data = {
	  schema: schemi.sGetData,
	  handler: function(request,reply)
		{	try {
			//controllo il token
			let verified = func.CheckToken(request);
			if (verified != true) {
				return reply.code(401).send(verified)
			};
			//Trova il dato nel file
			let id = request.params.id;
			let data = func.find_data(fs, id, (param) => {
				return param!=undefined?param:false;
			});
			func.log("[34m", "Found: " + data);
			if (data == false) return reply.code(400).send({message:"Dato non trovato"});
			return reply.send(data);
		}catch(error){func.log("[31m",error);return reply.send(error);};
			
		}
	}
	const ins_data = {
	  schema:schemi.sInsert,
	  handler: function(request,reply)
		{	try{
			//Controllo il token
			let verified=func.CheckToken(request);
			if(verified!=true){return reply.send(verified)};
			let body=request.body;
			//Se non è presente inserimento dato nel file
			let esiste=false;
			esiste = func.find_data(fs, body.id, (param) => {
				return param!=undefined?true:false});
			if(esiste==true) return reply.code(200).send({message:"ID già esistente"});
			else
			{
				let data=fs.readFileSync('data.json','utf8');
				let jsonData=JSON.parse(data);
				jsonData.data.push({id:Number(body.id),data:body.data});
				fs.writeFileSync('data.json', JSON.stringify(jsonData));
			}
			}catch(error){func.log("[31m",error);return reply.send(error);};
			return reply.code(201).send({message:"Inserito con successo"});
		}
	}
	const del_data=
	{
		schema:schemi.sDelData,
		handler: function(request,reply)
		{
			try{
			//Controllo token
			let verified=func.CheckToken(request);
			//Trovo il dato
			let id=request.params.id;
			if (func.find_data(fs, id, (param) => {
				return param!=undefined?param:false
			}) == false) return reply.code(400).send({message:"Id non trovato"});
			func.reWrite(fs,id,(param,data,arr)=>{return data.filter((element)=>element.id!==param.id)});
			}catch(error){return reply.send(error)};
			return reply.code(200).send({message:"Risorsa eliminata con successo"});
		}
	}
	const put_data=
	{
		schema:schemi.sPutData,
		handler: function(request,reply)
		{
			let id=request.params.id;
			let aggiornato=request.body.data;
			//Controllo token
			let verified=func.CheckToken(request);
			if(verified!=true){return reply.send(verified)};
			//Trovo il dato
			let data=func.find_data(fs,id,(param)=>{return param!=undefined?true:false});
			if(data==false)return reply.code(404).send({message:"ID non trovato!"});
			//Effettuo l'aggiornamento
			let obj={id:id,data:aggiornato};
			try {
				func.reWrite(fs, id, (param,data) => {
					return data.map((element)=>{
					if(element.id===param.id)
					{return {...element,data:aggiornato};}
					return element;
				})
				});
			}catch(err)
			{
				console.log(func.log("[31m","Errore riscrittura: "+err));
			}
			return reply.code(201).send({message:"Risorsa aggiornata con successo"});
		}
	}
	const _login = 
	{
		schema:schemi.sLogin,
	  handler: function(request,reply)
		{
			try{
			let x=request.body;
			func.log("[32m","User:"+x.username);
			func.log("[32m","Pass:"+x.password);
			//Leggo il file e controllo se è presente l'utente
			if(!fs.existsSync('users.json'))
				fs.writeFileSync('users.json','{"users":[]}','utf8');
			let users=fs.readFileSync('users.json','utf8');
			users=JSON.parse(users);
			for(let row of users.users)
			{
				if(row.username==x.username)
				{
					if(row.password==x.password)
					{
						let Token=jwt.sign(x,"Chiave",{expiresIn:'30d'});
						return reply.code(200).send(Token);
					}
					else
					{
						return reply.code(401).send({message:"Password non valida"});
					}
				}
			}
			return reply.code(404).send({message:"Utente non trovato"});
			}catch(error){func.log("[31m",error);return reply.send(error);};
		}
	}
// API CRUD

fastify.post('/login',_login)
fastify.post('/data',ins_data)
fastify.get('/data/:id',get_data)
fastify.put('/data/:id',put_data)
fastify.delete('/data/:id',del_data)
// Server listen
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  func.log("[32m","Listening");
})