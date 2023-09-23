//Schemas
const schema_obj ={			//Schema di debugging non usato
		response: {
		  200: {
			type: 'object',
			properties: {
			  message: { type: 'string' }
			}
		  }
		 
		}
	  }
const schema_login={
	type:'object',

	body:
	{
		type:'object',
		properties:
		{
			username:{type:'string'},
			password:{type:'string'}
		},
		required:['username','password']
	},
	response: {
	  200: {
		type: 'object',
		properties: {
		  message: { type: 'string' }
		}
	  },
	  401:{
		  type:'object',
		  properties:
			  {message:{type: 'string'}}
	  },
	  404:{type:'object',
		properties:
			{message:{type: 'string'}}
		}

	}
  }
const schema_insert={
	type:'object',
	body:
	{
		type:'object',
		properties:
		{
			id:{type:'integer'},
			data:{type:'string'}
		},
		required:['id','data']
	},
	headers:
	{
		type:'object',
		properties:{
			'bearer token':{type:'string'}
		},
	},
	response: {
	  200: {
		type: 'object',
		properties: {
		  message: { type: 'string' }
		}
	  },
	  201:{
		  type: 'object',
		  properties: {
			  message: { type: 'string' }
		  }
	  },
		401:{
			type:'object',
			properties:
				{message:{type: 'string'}}
		}
	}
  }
const schema_getdata={
	type:'object',
	headers:
	{
		type:'object',
		properties:{
			'bearer token':{type:'string'}
		},
	},
	response: {
	  200: {
		type: 'object',
		properties: {
		  	message: { type: 'string' },
			id:{type:'number'},
			data:{type:'string'}

		}
	  },
		401:{
			type:'object',
			properties:
				{message:{type: 'string'}}
		}
	}
  }
const schema_delData={
	type:'object',
	headers:
		{
			type:'object',
			properties:{
				'bearer token':{type:'string'}
			},
		},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' }
			}
		},
		401:{
			type:'object',
			properties:
				{message:{type: 'string'}}
		}
	}
}
const schema_putData={
	type:'object',
	body:
		{
			type:'object',
			properties:
				{
					data:{type:'string'}
				},
			required:['data']
		},
	headers:
		{
			type:'object',
			properties:{
				'bearer token':{type:'string'}
			},
		},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' }
			}
		}
	}
}
	  
module.exports.sLogin =schema_login;
module.exports.sInsert=schema_insert;
module.exports.sGetData=schema_getdata;
module.exports.sPutData=schema_putData;
module.exports.sDelData=schema_delData;
module.exports.norm=schema_obj;
