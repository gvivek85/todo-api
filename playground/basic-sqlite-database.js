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

var User = sequelize.define('user',{
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({}).then(function(){
	console.log('Everything is synced');
	
	/*User.create({
		email: 'vivekg@gmail.com'
	}).then(function(){
		return Todo.create({
			description: 'Clean Yard'
		});
	}).then(function(todo){
		User.findById(1)
		.then(function(user){
			user.addTodo(todo);
		});
	});*/
	
	User.findById(1).then(function(user){
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		})
	});
});