var crypto = require('crypto-js');
module.exports = function(db){
	
	return {
		requireAuthentication: function(req, res, next){
			
			var token = req.get('Auth') || '';
			
			db.token.findOne({
				where: {
					tokenHash: crypto.MD5(token).toString()
				}
			}).then(function(tokenIns){
				if(!tokenIns)
					throw new Error();
				
				req.token = tokenIns;
				return db.user.findByToken(token);
			}).then(function(user){
				req.user = user;
				next();
			}).catch(function(){
				res.status(401).send();
			});			
		}
	};
};