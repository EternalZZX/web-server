var crud = {
    insert:'INSERT INTO user(name) VALUES(?)',
	listwhitelist: 'SELECT * FROM whitelist',
	searchwhitelist: 'SELECT mcnick FROM whitelist WHERE mcnick=?',
	insertwhitelist: 'INSERT INTO whitelist(mcnick, invite_code, add_date) VALUE(?, ?, now())',
	searchinvitecode: 'SELECT invite_code, status FROM code WHERE invite_code=?',
	usedinvitecode: 'UPDATE code SET status=2, used_date=now() WHERE invite_code=?',
	releaseinvitecode: 'UPDATE code SET status=1, release_date=now() WHERE invite_code=?',
	getinvitecode: 'SELECT invite_code FROM code WHERE status=0 LIMIT 1',
	insertinvitecode: 'INSERT INTO code(invite_code, status) VALUES(?, ?)',
	searchip: 'SELECT ip FROM getIP WHERE ip=?',
	insertip: 'INSERT INTO getIP(ip, time, operation) VALUES(?, now(), ?)',
	insertsuggestion: 'INSERT INTO suggestion(ip, suggestion, time) VALUES(?, ?, now())'
};

module.exports = crud;
