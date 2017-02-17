function pathHover(obj) {
 	var loc_name = $(obj).attr("loc_name");
	console.log("loc_name > " + loc_name);
}

/* function drawLegend(scale) {
	  var legend = d3.legend.color()
	    .labelFormat(d3.format(',.0f'))
	    .cells(9)
	    .scale(scale);

	  var div = d3.select('#map').append('div')
	    .attr('class', 'legend');

	  var svg = div.append('svg');

	  svg.append('g')
	    .attr('class', 'legendQuant')
	    .attr('transform', 'translate(20,20)');

	  svg.select('.legendQuant')
	    .call(legend);
	}; */


// start drawMap()
function drawMap() {
	$("#map").empty();
	var width = 500,
      height = 600;

    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height);

    var projection = d3.geo.mercator()
            .center([128, 36])
            .scale(5000)
            .translate([width/2, height/2]);

    var path = d3.geo.path()
            .projection(projection);

    var quantize = d3.scale.quantize()
            .domain([0, 300])
            .range(d3.range(9).map(function(i) { return "p" + i; }));

    queue()
            .defer(d3.json, "./resources/municipalities-topo-simple.json")
            //.defer(d3.json, "./resources/kor_map_simple_topo2.json")
            //.defer(d3.json, 'http://128.199.128.104:3001/nabi')
            .defer(d3.json, "./resources/nabi.json")
            .await(ready);

    function ready(error, kor, powerData) {

        var values = d3.map();
        powerData.forEach(function(d) {
            values.set(d.local_sub, d.usage_5min_MWh);
        });

        var features = topojson.feature(kor, kor.objects["municipalities-geo"]).features;
        features.forEach(function(d) {
            var x = values.get(d.properties.name);
            if (x) {
                d.properties.usage_5min_MWh = x;
            }
        });

        svg.selectAll("path")
                .data(features)
                .enter().append("path")
                .attr("loc_name", function(d) {
                	return d.properties.name;
                })
                .attr("onclick", "pathHover(this)")
                .attr("class", function(d) {
                    return "municipality "+quantize(values.get(d.properties.name));
                })
                .attr("d", path)
                .append("title")
                .text(function(d) {
                    return d.properties.name;
                });
        /* svg.append("path")
		.datum(topojson.meshArcs(data, data.objects["sido"], function(a, b) { return a !== b; }))
		.attr("class", "sido")
		.attr("d", path);  */

 		/* svg.append("path")
		.datum(topojson.meshArcs(data3, data3.objects["provinces-geo"], function(a, b, c) { return b !== c; }))
		.attr("class", "sido")
		.attr("d", path);  */

        svg.selectAll("text")
          .data(features.filter(function(d) { return d.properties.name.endsWith("시"); }))
          .enter().append("text")
          .attr("transform", function(d) {
              return "translate(" + path.centroid(d) + ")";
          })
          .attr("dy", ".35em")
          .attr("class", "region-label")
          .text(function(d) {
              return d.properties.usage_5min_MWh + 'MWh';
          });

		/* drawLegend(function(d) {
			return quantize(values.get(d.properties.name));
		}); */

		// svg.call(tip);

    }
} // end of drawMap();

drawMap();
window.setInterval(function () {
	console.log("timer start");
	drawMap();
	}, 60000*5);
/*
$(document).ready(function()  {
	var legendSVG = d3.select("#maplegend").append("svg") ;
	var counties ;
	// set colors for the ranges
	var outageThresholds = [ 400, 800, 1200, 1600, 2000 ];
	var thresholdColors = ['rgb(253,208,162)','rgb(253,174,107)','rgb(253,141,60)','rgb(241,105,19)','rgb(217,72,1)','rgb(140,45,4)'];
	outColor = d3.scale.threshold()
                 .domain(outageThresholds)
                 .range(thresholdColors);
	tip = d3.tip()
	 .attr('class', 'd3-tip')
	 .offset([-10, 0])
	 .html(function(d) {
		 if (d.properties.withoutPower > 0) {
		   return "<center><span style='color:white'>" + d.id + " County</span><br/><span style='color:red'>" + commasFormatter(d.properties.withoutPower) + " w/o power</span><br/><span style='color:yellow'>Select for details</span></center>";
		 } else {
		   return "<center><span style='color:white'>" + d.id + " County</span><br/><span style='color:yellow'>Select to  report an outage</span></center>";

		 }
	 })
}); */
