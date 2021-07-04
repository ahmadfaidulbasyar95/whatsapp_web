var CONFIG = require('./config.json');
var http   = require("http");

var options = {
	host: CONFIG.HOST,
	port: 80,
	path: CONFIG.URI + CONFIG.URI_DATA,
	method: 'POST'
};

function AUTO_SEND_MESSAGE_RUN(data, index = 0) {
	if (data.length != index) {
		console.log("sendMessage\n" + data[index].phone + "@c.us\n" + data[index].text + "\n");
		// client.sendMessage(data[index].phone + '@c.us', data[index].text);
		index++;
		setTimeout(function() {
			AUTO_SEND_MESSAGE_RUN(data, index);
		}, CONFIG.DELAY_MESSAGE);
	}
}

function AUTO_SEND_MESSAGE() {
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			var data = JSON.parse(chunk);
			if (data.length) {
				AUTO_SEND_MESSAGE_RUN(data)
			}
			setTimeout(function() {
				AUTO_SEND_MESSAGE();
			}, CONFIG.DELAY);
		});
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		setTimeout(function() {
			AUTO_SEND_MESSAGE();
		}, CONFIG.DELAY);
	});

	req.end();
}

AUTO_SEND_MESSAGE();