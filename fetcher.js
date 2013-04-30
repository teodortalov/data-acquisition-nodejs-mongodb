const http = require('http'),
	config = require('config'),
	dbMapping = JSON.parse( config.Db.mapping ),
	mongoose = require('mongoose'),
	readingsModel = require('./models/readings.js').ReadingsModel;

  mongoose.connect(config.Db.address);

  mongoose.connection.on('error', function(err){
    throw err;
  });

function fetch(){
	http.get(config.Fetcher.url, fetchResult).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function fetchResult( res ){
	res.setEncoding('UTF-8');
	res.on('data', function (data) {
		data = JSON.parse(data);
		writeToDb( data );
	});
}

function remapColumns( d ){
	for( var k in d.vals ){
		var value = d.vals[k],
			name = dbMapping[k];
		d[name] = value;
	}
	delete d.vals;
}

function writeToDb( data ){
	for( var k in data.data ){
		var d = data.data[k];
		d.time = new Date();
		remapColumns( d );

		var model = new readingsModel(d);
		model.save(function(err){
		  readingsModel.ensureIndexes(function(){
		      console.log('ensure index');
		  });
		  console.log(d);
		  if(err) throw err;
		});
	}
}

setInterval(fetch, config.Fetcher.timePeriod);
