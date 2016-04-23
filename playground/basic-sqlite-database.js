var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite',
	'storage': 'basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
	description:{
		type: Sequelize.STRING,
		allowNull : false,
		validate:{
			len: [1, 256]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({}).then(function(){
	console.log('Everything is synced');
	Todo.findById(3).then(function(todo){
		if(todo)
			console.log(todo.toJSON());
		else
			console.log('No Todo');
	}).catch(function(e){
		console.log(e);
	});
	/*Todo.create({
		description:'take out trash'
		
	}).then(function(todo){
		return Todo.create({
			description: 'clean office'
		});
	}).then(function(){
		//return Todo.findById(1);
		return Todo.findAll({
			where:{
				description: {
					$like: '%TRASH%'
				}
			}
		});
	}).then(function(todos){
		if(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		}else 
			console.log('No Todos found');
	}).catch(function(e){
		console.log(e);
	});*/
});