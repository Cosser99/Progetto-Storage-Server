// Moduli
const fastify = require('fastify')({ logger: true })
const jwt=require('jsonwebtoken');
const fs=require('fs');
//Variabili
var Token;
var schema_obj ={
		response: {
		  200: {
			type: 'object',
			properties: {
			  hello: { type: 'string' }
			}
		  }
		}
	  }
//Funzioni
	function log(color,string) //Serve per colorare in console.log (cosi almeno si capisce)
	{
		console.log(`\x1b${color}${string}\x1b[0m`);
	}
	function find_data(fs,id,func)		//Funzione per trovare l'id dell'informazione ed esegurie la funzione func
	{
		try{
			let data=fs.readFileSync("data.txt",'utf8');
			if(data=="")return false;
			let obj=data.trim();
			obj=obj.split("\n");
			for(let row of obj)
			{
				log("[31m",row);
				let parsed=JSON.parse(row);
				if(parsed.id==id)
				{
					return func(row);
				}
			}
			return false;
		}catch(err){log("[34m",err);return err;};
	}
	function reWrite(fs,id,func)		//Funzione per riscrivere il file data ed esegurie la funzione func
	{
		try{
			let arr=[];
			let data=fs.readFileSync("data.txt",'utf8');
			if(data=="")return false;
			let obj=data.trim();
			obj=obj.split("\n");
			for(let row of obj)
			{
				log("[31m",row);
				let parsed=JSON.parse(row);
				if(parsed.id==id)
				{
					func(arr);
				}
				else
				{
					arr.push(row);
				}
			}
			fs.writeFileSync("data.txt",arr.join("\n"));
			return false;
		}catch(err){log("[34m",err);return err;};
	}
	function CheckToken(request)	//Controlla se è valido il token
	{
		try
		{
			Token=request.headers.authorization.split(" ")[1];
			jwt.verify(Token,"Chiave");
		}
		catch(error)
		{return reply.status(401).send(error);}
	}
// Routes Options oggetto
	const get_data = {
	  schema: schema_obj,
	  handler: function(request,reply)
		{	//controllo il token
			CheckToken(request);
			//Trova il dato nel file
			let id=request.params.id;
			let data=find_data(fs,id,(param)=>
			{
				return param;
			});
			log("[34m","Found: "+data);
			if(data==false)return reply.send("Dato non trovato");
			else return reply.send(data);
			
		}
	}
	const ins_data = {
	  schema: schema_obj,
	  handler: function(request,reply)
		{	
			//Controllo il token
			CheckToken(request);
			//Verifica la correttezza dei dati ed inserisci
			let body=request.body;
			if(body.id==null) return reply.send("Campo ID vuoto");
			if(body.data==null) return reply.send("Campo dati vuoto");
			//Se non è presente inserimento dato nel file
			let esiste=false;
			esiste=find_data(fs,body.id,(param)=>{return true});
			if(esiste==true) return reply.send("ID già esistente");
			else if(esiste==false)
			{
				let towrite=JSON.stringify({id:body.id,data:body.data},"")+'\n';
				fs.appendFile('data.txt',towrite,
				(err)=>{if(err)throw err; log("[33m","Saved");});
			}
			return reply.send("Inserito con successo");
		}
	}
	const del_data=
	{
		schema:schema_obj,
		handler: function(request,reply)
		{
			//Controllo token
			CheckToken(request);
			//Trovo il dato
			let id=request.params.id;
			if(find_data(fs,id,(param)=>{return param})==false) return reply.send("Id non trovato");
			reWrite(fs,id,(param)=>{return;});
			return reply.send(`Risorsa eliminata con successo`);
		}
	}
	const put_data=
	{
		schema:schema_obj,
		handler: function(request,reply)
		{
			//Controllo token
			CheckToken(request);
			//Trovo il dato
			let id=request.params.id;
			let aggiornato=request.body.data;
			log("[33m",aggiornato.id);
			log("[33m",id);
			if(id!=request.body.id) return reply.send("Parametro e id non combaciano");
			reWrite(fs,id,(param) => {param.push(JSON.stringify({"id":Number(id),"data":aggiornato},""))});
			return reply.send(`Risorsa aggiornata con successo`);
		}
	}
	const _login = 
	{
	  schema: schema_obj,
	  handler: function(request,reply)
		{
			let x=request.body;
			log("[32m","User:"+x.username);
			log("[32m","Pass:"+x.password);
			
			//Leggo il file e controllo se è presente l'utente
			try{
				let users=fs.readFileSync("users.txt",'utf8');
				let obj=users.split("\n");
				for(let row of obj)
				{
					row=JSON.parse(row);
					if(row.username==x.username)
					{
						if(row.password==x.password)
						{
							Token=jwt.sign(x,"Chiave",{expiresIn:'1d'});		//Scadenza per motivi di sicurezza
							return reply.send(Token);
						}
						else
						{
							return reply.send("Password non valida");
						}
					}
				}
				return reply.send("Utente non trovato");
			}catch(err)
			{reply.send(console.log(err))};
			
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
  log("[32m","Listening");
})




/* Per rispondere con post (IN WINDOWS)
curl -i -X POST -d "{\"username\": \"admin\", \"password\": \"admin\"}" http://localhost:3000/login -H "Content-Type: application/json"
*/