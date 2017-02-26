var mysql = require('mysql');
var rf = require('fs'); 
var exec = require('child_process').exec;
var $config = require('../setting/config.js');
var $crud = require('../src/crud.js');
var $base = require('../src/base.js');

var ADD_WHITELIST_CMD = '/home/server/addWhitelist ',
	SERVER_PATH = '/home/server/mcserver/';

var pool = mysql.createPool($config.mysql);

var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

module.exports = {
	addUser: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			var param = req.query || req.params;
			connection.query($crud.insert, [param.name], function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg:'增加成功'
					};    
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},

    regist: function (req, res, next) {
		if(!$base.validate(req.body.mcnick) || !$base.validate(req.body.code)) {
			console.log("invalidate input!");
			res.send("-1");
			return;
		}
		pool.getConnection(function(err, connection) {
			console.log("add whitelist " + req.body.mcnick + ":");
			connection.query($crud.searchwhitelist, [req.body.mcnick], function(err, result) {
				if (result) {
					if (result != "") {	
						console.log(req.body.mcnick + " already exist!");
						res.send("0");
					} else {
						var code = req.body.code.replace(/-/g, "");
						connection.query($crud.searchinvitecode, [code], function(err, result) {
							if (result) {
								if (result == "") {
									console.log("invite code not exist!");
									res.send("3");
								} else {
									if (result[0].status == 1 || result[0].status == 0) {
										exec(ADD_WHITELIST_CMD + req.body.mcnick, function(err, stdout, stderr) {
											if (err) {
												console.log('add whitelist ' + req.body.mcnick + ' error: ' + stderr);
												res.send("-1");
											} else {
												rf.readFile(SERVER_PATH + "whitelist.json", 'utf-8', function(err,data) {  
												    if (err) {  
												        console.log('read whitelist file error: ' + err);
												        res.send("-1"); 
												    } else { 
												    	var whitelist = JSON.parse(data);
												        for (i in whitelist) {
												        	if (whitelist[i].name.toLowerCase() == req.body.mcnick.toLowerCase()) {
												        		connection.query($crud.insertwhitelist, [req.body.mcnick, code], function(err, result) {
																	if (!result) {
																		console.log("SQL insert whitelist " + req.body.mcnick + ' error: ' + err);
																	}
																});
																connection.query($crud.usedinvitecode, [code], function(err, result) {
																	if(!result) {
																		console.log("SQL change invite code " + code + " status error: " + err);
																	}
																});
																console.log('add whitelist ' + req.body.mcnick + ' finish!');
																res.send("1");
																return;
												        	}
												        }
												        console.log('add whitelist ' + req.body.mcnick + ' with network delay!');
														res.send("4");
												    }  
												});
											}
										});
									} else {
										console.log("invite code already used!");
										res.send("2");
									}
								}
							} else {
								console.log('SQL search invite code error: ' + err);
								res.send("-1");
							}
						});	
					}
				} else {
					console.log('SQL search whitelist error: ' + err);
					res.send("-1");
				}
				connection.release();
			});
		});
	},

	getInvitecode: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			var ip = $base.getClientIP(req);
			connection.query($crud.searchip, [ip], function(err, result) {
				if(result) {
					if(result == "") {
						connection.query($crud.getinvitecode, function(err, result) {
							if(result) {
								if(result == "") {
									console.log('invite code already exhausted!');
									res.json({"status": "0"});
								} else {
									var code = result[0].invite_code,
										codeArr = code.split(""),
										codeStr = "";
									for(var j = 0; j < codeArr.length; j += 4) {
										for(var i = j; i < j + 4; i++) {
											codeStr += codeArr[i];
										}
										if(j < codeArr.length-4) {
											codeStr += "-";
										}
									}
									connection.query($crud.releaseinvitecode, [code], function(err, result) {
										if(!result) {
											console.log('SQL update invite code error: ' + err);
											res.json({"status": "-1"});
										} else {
											connection.query($crud.insertip, [ip, 'Get invite code'], function(err, result) {
												if(!result) {
													console.log('SQL insert ip error: ' + err);
													res.json({"status": "-1"});
												} else {
													console.log('release invite code: ' + code);
													res.json({"status": "1", "code": codeStr});
												}
											});
										}
									});
								}
							} else {
								console.log('SQL search invite code error: ' + err);
								res.json({"status": "-1"});
							}
						});
					} else {
						console.log("already get invite code today!");
						res.json({"status": "2"});
					}
				} else {
					console.log("SQL search ip errot: " +err);
					res.json({"status": "-1"});
				}
			});
			connection.release();
		});
	},

	addInvitecode: function (req, res, next) {
		var num = parseInt(req.query.num);
		if(num > 100) {
			num = 100;
		}
		pool.getConnection(function(err, connection) {
			var chars = 'ABDEFGHJKLMNPQRSTUVWXYZ23456789',
				len = 20,
		        maxPos = chars.length;
			for (var j = 0; j < num; j++) {
				var code = "";
				for (var i = 0; i < len; i++) {
					code += chars.charAt(Math.floor(Math.random() * maxPos));
				}
				console.log('add code: ' + code);
				connection.query($crud.insertinvitecode, [code, 0], function(err, result) {
					if(!result) {
						console.log('SQL add invite code error: ' + err);
					}
				});
			}
			connection.release();
		});
	},

	suggest: function (req, res, next) {
		var sug = $base.replaceSign(req.body.suggestion),
		    ip = $base.getClientIP(req);
		pool.getConnection(function(err, connection) {
			connection.query($crud.insertsuggestion, [ip, sug], function(err, result) {
				if(result) {
					console.log('recive suggestion success!');
					res.send("0");
				} else {
					console.log('SQL insert suggestion error: ' + err);
					res.send("-1");
				}
				connection.release();
			});
		});
	}
};
