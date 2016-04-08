var express= require('express');
var bodyParser = require('body-parser');
var apps = express();

var port = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

apps.use(bodyParser.json());

apps.get('/todos', function(req, res){
	res.json(todos);
});

apps.get('/todos/:id', function(req, res){
	var todoId = req.params.id;
	var matchedToDo;
	todos.forEach(function(item){
		if(item.id == todoId){
			matchedToDo = item;
		} 
	});
	if(matchedToDo)
		res.json(matchedToDo);
	else
		res.status(404).send();
});

apps.post('/todos', function(req, res){
	var body = req.body;	
	todos.push({id: todoNextId, description: body.description, completed: body.completed});
	
	todoNextId++;
	res.send(body);
});

apps.get('/', function(req, res){
	res.send('ToDo API Root');
});

apps.listen(port, function(){
	console.log('Express listening on Port ' + port);
});