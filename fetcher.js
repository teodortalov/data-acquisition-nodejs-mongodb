const http = require('http'),
	config = require('config'),
	mongoose = require('mongoose'),
	readingsModel = require('./models/readings.js').ReadingsModel;

  config = JSON.stringify(config);
  mongoose.connect(config.Db.address);

  mongoose.connection.on('error', function(err){
    throw err;
  });

function fetch(){
 
	http.get(config.Fetcher.url, fetchResult).on('error', function(e) {
//	  console.log("Got error: " + e.message)
	});
}

function fetchResult( res ){
	res.setEncoding('UTF-8');
	data = '';
	res.on('data', function (chunk) {
	 data += chunk;

	});
	res.on('end', function (res) {

   writeToDb( data );
//   res.end();
  });

}

function remapColumns( d ){
  var dbMapping = JSON.parse(config.Db.mapping);
	for( var k in d.vals ){
		var value = d.vals[k],
			name = dbMapping[k];
		d[name] = value;
	}
	delete d.vals;
}

function writeToDb(data){
// var data = JSON.parse(data);

	for( var k in data.data ){

	 var d = data.data[k];
		d.time = new Date();
		remapColumns( d );

		var model = new readingsModel(d);
		model.save(function(err){
		 
		  readingsModel.ensureIndexes(function(){
//		      console.log('ensure index');
		  });
//		  console.log(d);
		  if(err) throw err;
		});
	}
}

setInterval(fetch, config.Fetcher.timePeriod);
