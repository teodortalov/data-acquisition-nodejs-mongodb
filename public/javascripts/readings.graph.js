(function(){
    const LINKS = {
                    oneMinute: {range:60 * 1000, timeout: 1000},
                    tenMinutes: {range:10 * 60 * 1000, timeout: 1000},
                    thirtyMinute: {range:30 * 60 * 1000, timeout: 1000},
                    oneHour: {range:60 * 60 * 1000, timeout: 1000},
                    twelveHours: {range:12 * 60 * 60 * 1000, timeout: 1000},
                    oneDay: {range:24 * 60 * 60 * 1000, timeout: 1000},
                    oneWeek: {range:7 * 24 * 60 * 60 * 1000, timeout: 1000 },
                    oneMonth: {range:30 * 24 * 60 * 60 * 1000, timeout: -1},
                    oneYear: {range:365 * 24 * 60 * 60 * 1000, timeout: -1},
                  };

	var readings = {
	    fetch: function(from,to, cb){
			from = Math.round( from / 1000 );
			to = Math.round( to / 1000 );
			console.log('/readings/'+from+'/'+to);
            $.getJSON('/readings/'+from+'/'+to, cb);
		},
		getSerieData: function(data, column){
			var serieData = [];
			for( var k in data ){
				var v = data[k];
				serieData.push({x:new Date(v.time).getTime(),y:v[column]});
			}
			return serieData;
		},
		now: function(){
			return new Date().getTime();
		},
		initialLink: LINKS.oneMinute
	},
    currentLink = null,
    // Used to store currently displayed points, to make sure we don't add duplicates
    pointsDisplayed = {},
    refreshInterval = null,
    refreshRunning = false,
    stackedFunctionsAfterRefresh = [],
    graph;


    function stop(){
        stopRefresh();
        if( refreshRunning ){
            stackedFunctionsAfterRefresh.push( stop );
            ensureStopRan();
            return false;
        }else{
            currentLink = null;
            graph = null;
            pointsDisplayed = {};
            refreshRunning = false;
            stackedFunctionsAfterRefresh = [];
            $('#graph').children().remove();
            $('#legend').children().remove();
            return true;
        }
    }

    function ensureStopRan(){
        if( stackedFunctionAfterRefresh != null ){
            if( refreshRunning )
                setTimeout( ensureStopRan , 20 );
            else
                for( var i = 0 ; i < stackedFunctionsAfterRefresh.length ; i++ )
                    stackedFunctionsAfterRefresh[i]();
        }
    }

    function start(link){
        var now = readings.now(),
            from = link.range,
            to = 0;
        currentLink = link;
	    readings.fetch(from, to, function(initialData){
            initialData = readings.getSerieData(initialData, 'voltage1');
            initialData = addData( initialData );
		    console.log('Initial fetch', initialData.length);
            // TODO: length == 0 : No data loaded, don't create graph, but write message
		    graph = new Rickshaw.Graph({
		      element: document.querySelector('#graph'),
		      series: [
		        {
		          color: 'steelblue',
                  name: 'Voltage 1',
		          data: initialData
		        }
		      ],
              stroke: true
		    });

		    graph.render();

            var legend = new Rickshaw.Graph.Legend({
                graph: graph,
                element: document.querySelector('#legend')
            });

            var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                graph: graph,
                xFormatter: function(x) { var d = new Date(); d.setTime( x ); return d.toString(); },
                yFormatter: function(y) { return y + ' mV'; }
            });

            //var xAxis = new Rickshaw.Graph.Axis.Time({
            //    graph: graph
            //});
            //xAxis.render();

            var yAxis = new Rickshaw.Graph.Axis.Y({
                graph: graph
            });
            yAxis.render();

            startStopRefresh();
	    });
    }


    function startRefresh(){
        refreshInterval = setInterval( fetchNewData, currentLink.timeout );
    }


    function stopRefresh(){
        if( refreshInterval != null && currentLink.timeout != -1 ){
            clearInterval( refreshInterval );
            refreshInterval = null;
        }
    }


    function startStopRefresh(){
        console.log('Refresh checked', $('#refresh').is(':checked'));
        if($('#refresh').is(':checked'))
            startRefresh();
        else
            stopRefresh();
    }


    function addData( data ){
        var filteredData = [], v;
        for( var k in data ){
            v = data[k];
            if( !( v.x in pointsDisplayed )){
                filteredData.push( v );
                pointsDisplayed[ v.x ] = v;
            }
        }
        return filteredData;
    }


    function removeData( data ){
        for( var k in data ){
            var v = data[k];
            if( v.x in pointsDisplayed )
                delete data[k];
        }
    }


	function fetchNewData(){
		refreshRunning = true;
		readings.fetch( currentLink.timeout , 0, function(serieData){
			var gData = graph.series[0].data,
                minX = gData[ gData.length - 1 ].x - currentLink.range,
                toRemove;

			serieData = readings.getSerieData( serieData , 'voltage1' );
            serieData = addData( serieData );

			for( var x = 0 ; x < serieData.length ; x++ )
				gData.push( serieData[x] );
			if( gData.length > 0 && gData[0].x < minX ){
				var i = 0, sliceIndex = -1;
				for( ; i < gData.length && sliceIndex == -1; i++ )
					if( gData[i].x >= minX )
						sliceIndex = i;
				if( sliceIndex != -1 ){
					graph.series[0].data = gData.splice( sliceIndex );
                    toRemove = gData.splice( 0, sliceIndex );
                }
			}
			graph.update();
            if( toRemove )
                removeData( toRemove );
		});
        refreshRunning = false;
	}


    function bind(){
        $('#refresh').click( startStopRefresh );
        for( var linkName in LINKS ){
            var link = LINKS[ linkName ];
            $('#'+linkName).click( bindPeriodLink( link ) );
        }
    }


    function bindPeriodLink(link){
        return function(e){
            e.preventDefault();
            if( stop() )
                start( link );
            else
                stackedFunctionsAfterRefresh.push( function(){
                    start( link );
                });
        };
    }


    // Init
    bind();
	start( readings.initialLink );

})();
