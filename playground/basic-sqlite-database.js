var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			len: [1, 250]			
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false	
	}
});

sequelize.sync().then(function(){
	
	Todo.findById(3).then(function(todo){
		if(todo){
			console.log(todo.toJSON());
		} else {
			console.log('Nothing found');
		}
	});
	/*
	console.log('everything is synched');
	
	Todo.create({
	description: 'Kill the Dog'}).then(function(todo){
		console.log('Finished Saving object');
		console.log(todo);
	}).then(function(todo){
		return Todo.create({
			description: 'Shit the dog'
		})
	}).then(function(){
		return Todo.findAll({
			where: {
				description: {
					$like: '%the%'
				}
			}
		});
	}).then(function(todos){
		if(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		} else {
			console.log('No Todo Found');
		}
	}).catch(function (err){
		console.log(err);
	});*/
});
