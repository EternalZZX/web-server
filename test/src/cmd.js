var exec = require('child_process').exec;
var cmdStr = '/home/server/serverCommand ';

module.exports = {
	addMoney: function (req, res, next) {
		 var cmd = "eco give ",
		     mcnick = "Frozen__Elsa ";
		     money = 0;
	     if(typeof req.body.money == 'string') {
			money = parseInt(req.query.money);
		 } else {
			money = req.query.money;
		 }
		 if(money > 100000) {
			money = 100000;
		 }
		 if(money > 0) {
			exec(cmdStr + cmd + mcnick + money, function(err,stdout,stderr) {
				if (err) {
					res.send("Add money error: " + err);
				} else {
					res.send("Add money $" + money + " success!");
				}
			});
		 } else {
			res.send("Add money with wrong number!");
		 }
	}
}
