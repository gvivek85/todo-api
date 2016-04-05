var express= require('express');
var apps = express();

var port = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet Friends for Lunch',
	completed: false
},{
	id: 2,
	description: 'Go to Market',
	completed: false
}, {
	id: 3,
	description: 'Feed the dog',
	completed: true
}];

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

apps.get('/', function(req, res){
	res.send('ToDo API Root');
});

apps.listen(port, function(){
	console.log('Express listening on Port ' + port);
});