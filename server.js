var bcrypt = require('bcryptjs');
var express= require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var middleware = require('./middleware.js')(db);

var apps = express();

var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

apps.use(bodyParser.json());

//GET todo request
apps.get('/todos', middleware.requireAuthentication, function(req, res){
	var queryParams = req.query;
	var where = {
		userId: req.user.get('id')
	};
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

//GET todos with ID
apps.get('/todos/:id', middleware.requireAuthentication, function(req, res){
	var todoId = parseInt(req.params.id, 10);
	
	db.todo.findOne({
		where: {
			userId: req.user.get('id'),
			id: todoId
		}
	}).then(function(todo){
		if(!!todo)
			res.json(todo.toJSON());
		else 
			res.status(404).send();
	}, function(e){
		res.status(500).send();
	});	
});

//Post request to Add Todo
apps.post('/todos', middleware.requireAuthentication, function(req, res){
	var body = _.pick(req.body, 'description', 'completed');		
	db.todo.create(body).then(function(todo){
		if(todo)
			req.user.addTodo(todo).then(function(){
				return todo.reload();
			}, function(){
				
			}).then(function(todo){
				res.json(todo.toJSON());
			});
			
	}, function(e){
		res.status(400).json(e);
	});
});

//Delete Todo Request
apps.delete('/todos/:id', middleware.requireAuthentication,function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var where = {};

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
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

//Update Todo Request
apps.put('/todos/:id', middleware.requireAuthentication, function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');	
	var attributes ={};
	
	var where = {
		userId: req.user.get('id'),
		id: todoId
	}
	
	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	} 
	
	if(body.hasOwnProperty('description')){
		attributes.description = body.description;
	} 	
	db.todo.findOne({where: where}).then(function(todo){
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
	var userInstance; 
	
	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		userInstance = user;
		return db.token.create({
			token: token
		});
		
	}).then(function(tokenInstance){
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function(){
		res.status(401).send({
			error: "Invalid Login"
		});
	});
		
});

//DELETE 
apps.delete('/users/login',  middleware.requireAuthentication, function(req, res){
	req.token.destroy().then(function(){
		res.status(204).send();
	}).catch(function(){
		res.status(500).send();
	});
});

//Start the server and create the database
db.sequelize.sync({force:true}).then(function(){
	apps.listen(port, function(){
	console.log('Express listening on Port ' + port);
});
});
