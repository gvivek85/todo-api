var express= require('express');
var apps = express();

var port = process.env.PORT || 3000;

apps.get('/', function(req, res){
	res.send('ToDo API Root');
});

apps.listen(port, function(){
	console.log('Express listening on Port ' + port);
});