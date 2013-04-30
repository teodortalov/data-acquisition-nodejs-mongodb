const config = require('config'),
    rdp = require('../helpers/ramerDouglasPeucker.js'),
    mongoose = require('mongoose'),
    readingsModel = require('../models/readings.js').ReadingsModel,
    REMOVE_UNSIGNIFICANT_POINTS = true,
    RDP_LIMIT = 10000,
    ATTRIBUTES = ['time','voltage1'];

exports.list = function(req, res){

    mongoose.connect(config.Db.address);
    mongoose.connection.on('error', function(err){
        throw err;
    });

	var from = req.params.from,
		to   = req.params.to;


	var now = new Date().getTime();

	mongoose.connection.once('open', send);
    function send(){
        console.log('sent');
        readingsModel.find()
        .where('time').gt(new Date( now - from*1000)).lt(new Date( now - to*1000))
        .select('time voltage1')
        .exec(function(err, data){
            if(err)
                throw err;
            console.log('Data length', data.length );
            if( REMOVE_UNSIGNIFICANT_POINTS ){
                var rdpRan = 0, rdpStart = new Date().getTime();
                while( data.length > RDP_LIMIT ){
                    data = rdp.rdp(data, ATTRIBUTES, 0.000001);
                    rdpRan++;
                }
                console.log('Data length after '+rdpRan+' RDP', data.length, 'in '+(new Date().getTime() - rdpStart)+' ms');
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
            mongoose.disconnect();
        });
    };
};

exports.index = function(req,res){
	  res.render('readings');
}
