//
const jwt=require('jsonwebtoken');
//
function log(color,string) //Serve per colorare in console.log (cosi almeno si capisce)
	{
		console.log(`\x1b${color}${string}\x1b[0m`);
	}
	function find_data(fs,id,func)		//Funzione per trovare l'id dell'informazione ed esegurie la funzione func
	{
		try{
			if(!fs.existsSync('data.json')){fs.writeFileSync('data.json','{"data":[]}','utf8');}
			let data=fs.readFileSync("data.json",'utf8');
			data=JSON.parse(data);
			let x= data.data.find((element)=>element.id==id);
			return func(x);
		}catch(err){log("[31m",err);throw err;}
	}
	function reWrite(fs,id,func)		//Funzione per riscrivere il file data ed esegurie la funzione func
	{
		try{
			let data=fs.readFileSync("data.json",'utf8');
			data=JSON.parse(data);
			let x= data.data.find((element)=>element.id==id);
			log("[33m",x.id);
			data.data=func(x,data.data);
			fs.writeFileSync("data.json", JSON.stringify(data));
			return false;
		}catch(err){log("[34m",err);throw err;};
	}
	function CheckToken(request)	//Controlla se è valido il token
	{
		try
		{
			if(request.headers.authorization==undefined) return {message:"Nessun token inserito"};
			let Token=request.headers.authorization.split(" ")[1];
			let verified=jwt.verify(Token,"Chiave");
			log("[32m","Token Verificato");
			return true;
		}
		catch(error)
		{throw error}
	}
	
module.exports.find_data=find_data;	
module.exports.CheckToken=CheckToken;
module.exports.reWrite=reWrite;
module.exports.log=log;