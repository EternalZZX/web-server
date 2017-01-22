module.exports = {
	validate: function(str) {
		re = /drop|insert|select|update|delete|exec|count|\\|\/|\'|\"|=|;|>|<|%/i;
		if (re.test(str.toLowerCase())) {
			return false;
		} else {
			return true;
		}
	},

	replaceSign: function(str) {
		return str.toLowerCase().replace(/drop|insert|select|update|delete|exec|count|script|\"|\'|\\|\/|=|;|>|<|%/g, "");
	},

	getClientIP: function(req) {
		var ipAddress;
		var headers = req.headers;
		var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
		forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
		if (!ipAddress) {
			ipAddress = req.connection.remoteAddress;
		}
		return ipAddress;
	}
};
