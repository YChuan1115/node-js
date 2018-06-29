
var SerialPort = require('serialport');
var express = require('express');
var bodyParser = require('body-parser');  //used for handling POST Data Parser 
var app = express();

app.use('/www', express.static(__dirname + '/public'));  //used for static file(html,jpg,txt,...)
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
const Readline = SerialPort.parsers.Readline;
var port = new SerialPort('COM30',  
        {baudRate: 115200,
        // parser: new SerialPort.parsers.Readline('\n')         
        });


// Read the port data

var sensor={"Acc_X":0,"btn_A":0,"btn_B":0}
	
port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
 
  // Because there's no callback to write, write errors will be emitted on the port:
  //port.write('main screen turn on');
});
 
// The open event is always emitted

port.on('open', function() {
  // open logic
  
		  // Switches the port into "flowing mode"
       s=''
		port.on('data', function (data) {
	
		 // console.log(data);
		  s+=data
		  if (data[0]==0xd && data[1]==0xa) {
			  s=s.trim();
			  //console.log(s)
			  if (s.split(':')[0] == 'acc') {
			     sensor.Acc_X=parseInt(s.split(':')[1]);
				  console.log(sensor.Acc_X)
			  } else if (s.split(':')[0] == 'btn_A') {
			     sensor.btn_A=parseInt(s.split(':')[1]);
				  console.log(sensor.btn_A)
			  } else if (s.split(':')[0] == 'btn_B') {
			     sensor.btn_B=parseInt(s.split(':')[1]);
				  console.log(sensor.btn_B)
			  }
			  s=''
			  
		  }

		});

		// Read data that is available but keep the stream from entering "flowing mode"

		

})



app.get('/sensor', function(req, res) {
	
    res.writeHead(200, {'Content-Type': 'application/json',"Access-Control-Allow-Origin":"*"});
	var json=JSON.stringify(sensor);
	console.log(json);
    res.end(json);
  
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
