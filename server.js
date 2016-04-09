var express= require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var apps = express();

var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

apps.use(bodyParser.json());

apps.get('/todos', function(req, res){
	var queryParams = req.query;
	var filtereTodos = todos;
	
	if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'true'){
		filtereTodos = _.where(filtereTodos, {completed : true});
	} else if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'false'){
		filtereTodos = _.where(filtereTodos, {completed : false});
	}
	res.json(filtereTodos);
});

apps.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos, {id: todoId});	
	
	if(matchedToDo)
		res.json(matchedToDo);
	else
		res.status(404).send();
});

//Post request to Add
apps.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');		
	
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || _.isEmpty(body.description))
		return res.status(400).send();
	
	body.description = body.description.trim();
	todos.push({id: todoNextId, description: body.description, completed: body.completed});
	
	todoNextId++;
	res.send(body);
});

//Delete Request
apps.delete('/todos/:id',function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos, {id: todoId});	
	
	if(!matchedToDo)
		res.status(400).json({"error": "nothing found"});
	
	todos = _.without(todos, matchedToDo);	
	res.json(todos);
});

//Update Request
apps.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');	
	var validAttributes ={};
	
	if(!matchedToDo)
		return res.status(404).send();
	
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	} else {
		
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}
	
	_.extend(matchedToDo, validAttributes);
	
	res.send(todos);
});

apps.get('/', function(req, res){
	res.send('ToDo API Root');
});

apps.listen(port, function(){
	console.log('Express listening on Port ' + port);
});