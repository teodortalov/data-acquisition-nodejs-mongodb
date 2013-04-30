const http = require('http'),
	config = require('config'),
	mongoose = require('mongoose'),
	readingsModel = require('./models/readings.js').ReadingsModel;

mongoose.connect(config.Db.address);

mongoose.connection.on('error', function(err){
    throw err;
});

var number = 31000;

function randomReading(){
    var v = Math.round( Math.random() * 5000 );
	var data = {time:new Date(), no: number++, voltage1: v};
    writeToDb( data );
}


function writeToDb( data ){
    var model = new readingsModel(data);
    console.log( model );
	model.save(function(err){
        if(err) throw err;
    });
}

setInterval(randomReading, config.Fetcher.timePeriod);
