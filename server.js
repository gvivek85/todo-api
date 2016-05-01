var bcrypt = require('bcryptjs');
var express= require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var apps = express();

var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

apps.use(bodyParser.json());

apps.get('/todos', function(req, res){
	var queryParams = req.query;
	var where = {};
	if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'true')
		where.completed = true;
	else if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'false')
		where.completed = false;
	
	if(queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.length > 0)
		where.description = {$like : '%'+queryParams.q+'%'};
	

	db.todo.findAll({where : where}).then(function(todos){
		res.json(todos);
	}, function(e){
		res.status(500).send();
	});
});

apps.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo){
		if(!!todo)
			res.json(todo.toJSON());
		else 
			res.status(404).send();
	}, function(e){
		res.status(500).send();
	});	
});

//Post request to Add
apps.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');		
	db.todo.create(body).then(function(todo){
		if(todo)
			res.json(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});
});

//Delete Request
apps.delete('/todos/:id',function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var where = {};

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted){
		if(rowsDeleted>0)
			res.status(204).send();
		else
			res.status(404).json({
					error: 'No todo with Id'
				});
	}, function(){
		res.status(500).send();
	});	
});

//Update Request
apps.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');	
	var attributes ={};
	
	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	} 
	
	if(body.hasOwnProperty('description')){
		attributes.description = body.description;
	} 	
	db.todo.findById(todoId).then(function(todo){
		if(todo){
			todo.update(attributes).then(function(todo){
					res.json(todo.toJSON());
				}, function(e){
					res.status(400).send(e);
				});
		} else {
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();
	});
});

//---------------------USERS API's------------------//

//GET all users
apps.get('/users', function(req, res){
	db.users.findAll().then
});
//POST add user
apps.post('/users', function(req, res){
	var body = _.pick(req.body, 'email', 'password');		
	db.user.create(body).then(function(todo){
		if(todo)
			res.json(todo.toPublicJSON());
	}, function(e){
		res.status(400).json(e);
	});
});

//POST /users/login
apps.post('/users/login', function(req, res){
	var body = _.pick(req.body, 'email', 'password');
	
	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		if(token){
			res.header('Auth',token).json(user.toPublicJSON());
		} else {
			res.status(401).send({
			error: "Invalid Login"
		});
		}		
	}, function(){
		res.status(401).send({
			error: "Invalid Login"
		});
	});
		
});

//Start the server and create the database
db.sequelize.sync({force: true}).then(function(){
	apps.listen(port, function(){
	console.log('Express listening on Port ' + port);
});
});
