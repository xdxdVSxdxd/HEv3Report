var styles = [
      {
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" }
        ]
      },{
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#222222" }
        ]
      },{
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#333333" }
        ]
      },{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#353535" }
        ]
      },{
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#404040" }
        ]
      },{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#424242" }
        ]
      }
    ];

    var styledMap = new google.maps.StyledMapType(styles, {name: "HEMap"});


var aed1,aed2,aed3,aed4,aed5,aed6,aed7,aed8,aed9;


$( document ).ready(function() {
 
	$.getJSON("report-number_users_and_messages.json",function(data){
		//console.log(data);

		$(".replaceMonthName").text(data.month);
		$(".replaceYear").text(data.year);
		$(".replaceFromDate").text(data.fromdate);
		$(".replaceToDate").text(data.todate);
		$(".replaceUsersNumber").text(data.nusers);
		$(".replaceMessageNumber").text(data.nmessages);


    aed1 = new Medium({
        element: document.getElementById('aed1'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed2 = new Medium({
        element: document.getElementById('aed2'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed3 = new Medium({
        element: document.getElementById('aed3'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed4 = new Medium({
        element: document.getElementById('aed4'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed5 = new Medium({
        element: document.getElementById('aed5'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed6 = new Medium({
        element: document.getElementById('aed6'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed7 = new Medium({
        element: document.getElementById('aed7'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed8 = new Medium({
        element: document.getElementById('aed8'),
        mode: Medium.richMode,
        placeholder: ''
    });

    aed9 = new Medium({
        element: document.getElementById('aed9'),
        mode: Medium.richMode,
        placeholder: ''
    });


		getBasicMap();


		getSentiment();

		getEmotions();

    getTopUsers();

    getTopics();

    getDistrictVenues();

    getClusters();

	});
 
});







var styles = [
      {
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" }
        ]
      },{
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#222222" }
        ]
      },{
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#333333" }
        ]
      },{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#353535" }
        ]
      },{
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#404040" }
        ]
      },{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#424242" }
        ]
      }
    ];



var map1;
var heatmaps1;
var legend1;
var markers1;
function getBasicMap(){
	
    markers1 = new Array();

    var mapOptions = {
        center: new google.maps.LatLng(45.466667, 9.183333),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        backgroundColor: '#FFFFFF',
        mapTypeControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: false,
        streetViewControl: false,
        zoomControl: true
    };

    $("#map1").height(300);

    map1 = new google.maps.Map(document.getElementById("map1"), mapOptions);

    map1.mapTypes.set('map_style', styledMap);
    map1.setMapTypeId('map_style');

    legend1 = new Object();
    legend1["all"] = "#00FF00";

    heatmaps1 = new Object();
    heatmaps1["all"] = new google.maps.visualization.HeatmapLayer({ map: map1 });
    heatmaps1["all"].setOptions( {radius: 20, opacity: 0.7, dissipating: true });

    $.getJSON("report-geo_distribution.json")
    .done(function(data){

    			//console.log(data);

                var datas = new Object();
                datas["all"] = new google.maps.MVCArray();

                for(var i = 0; i<data.data.length; i++){
                	if(parseFloat(data.data[i].lat)!=0 && parseFloat(data.data[i].lat)!=999 && parseFloat(data.data[i].lat)!=-999 ){
                  		datas[  "all"  ].push(  { location: new google.maps.LatLng(  parseFloat(data.data[i].lat) , parseFloat(data.data[i].lng)   ) , weight: parseFloat(data.data[i].c) } );
                  	}
                }

                heatmaps1["all"].set('data' , datas["all"]);
        
    })
    .fail(function( jqxhr, textStatus, error ){
        //fare qualcosa in caso di fallimento
    });
}









var sentimentseriesOptions = [],
    sentimentseriesCounter = 0,
    sentimentnames = ['positive', 'negative', 'neutral'];

function getSentiment(){


	$.getJSON("report-sentiment_percent.json" )
    .done(function(data){

    	//console.log(data);

        var positive = +data.positive;
        var negative = +data.negative;
        var neutral = +data.neutral;
            
        var total = positive + neutral + negative;

        var perc_positive = 0;
        var perc_negative = 0;
        var perc_neutral = 0;  

        if(total!=0){
            perc_positive = 100*positive/total;
            perc_negative = 100*negative/total;
            perc_neutral = 100*neutral/total;
        }

        $("#positive").text(   perc_positive.toFixed(2)  + "%");
        $("#neutral").text(   perc_neutral.toFixed(2)  + "%");
        $("#negative").text(   perc_negative.toFixed(2)  + "%");
        
    })
    .fail(function( jqxhr, textStatus, error ){
        //fare qualcosa in caso di fallimento
    });



    var cont = "";

    
        $.getJSON("report-sentiment_timeline.json", function(data){

        	//console.log(data);

            for(var k = 0; k<data.positive.length; k++){
                data.positive[k][0] = parseFloat( data.positive[k][0] ) * 1000;
                data.positive[k][1] = parseFloat( data.positive[k][1] );
            }

            for(var k = 0; k<data.negative.length; k++){
                data.negative[k][0] = parseFloat( data.negative[k][0] ) * 1000;
                data.negative[k][1] = parseFloat( data.negative[k][1] );
            }

            for(var k = 0; k<data.neutral.length; k++){
                data.neutral[k][0] = parseFloat( data.neutral[k][0] ) * 1000;
                data.neutral[k][1] = parseFloat( data.neutral[k][1] );
            }

            sentimentseriesOptions[0] = {
                name: 'positive',
                data: data.positive
            };

            sentimentseriesOptions[1] = {
                name: 'negative',
                data: data.negative
            };

            sentimentseriesOptions[2] = {
                name: 'neutral',
                data: data.neutral
            };

            sentimentseriescreateChart();
        });
    
}

function sentimentseriescreateChart(){
    Highcharts.stockChart('sentiment-timeline', {

            rangeSelector: {
                enabled: false
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value ;
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'value',
                    connectNulls: true,
                    showInNavigator: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },

            legend: {
            	enabled: true
            },

            credits: {
            	enabled: false
            },

            navigator: {
            	enabled: false
            },

            scrollbar: {
            	enabled: false
            },

            series: sentimentseriesOptions
        });
}


var emotionsLegendData;

function getEmotions(){


	$.getJSON("report-emotion_list.json", function(data){


		emotionsLegendData = data;

		var content = "";

		content = content + "<table class='table'>";

		content = content + "<tr>";
		content = content + "<th>Quadrante (Comfort/Energia)</th><th>Colore</th>";
		content = content + "</tr>";

		content = content + "<tr>";
		content = content + "<td>Positivo/Positivo</td><td><span class='legendblock' style='background-color: rgb(" + data.CPositiveEPositive.r + "," + data.CPositiveEPositive.g + "," + data.CPositiveEPositive.b + ")'></span></td>";
		content = content + "</tr>";

		content = content + "<tr>";
		content = content + "<td>Positivo/Negativo</td><td><span class='legendblock' style='background-color: rgb(" + data.CPositiveENegative.r + "," + data.CPositiveENegative.g + "," + data.CPositiveENegative.b + ")'></span></td>";
		content = content + "</tr>";

		content = content + "<tr>";
		content = content + "<td>Negativo/Negativo</td><td><span class='legendblock' style='background-color: rgb(" + data.CNegativeENegative.r + "," + data.CNegativeENegative.g + "," + data.CNegativeENegative.b + ")'></span></td>";
		content = content + "</tr>";

		content = content + "<tr>";
		content = content + "<td>Negativo/Positivo</td><td><span class='legendblock' style='background-color: rgb(" + data.CNegativeEPositive.r + "," + data.CNegativeEPositive.g + "," + data.CNegativeEPositive.b + ")'></span></td>";
		content = content + "</tr>";

		content = content + "</table>";


		// content = content + "<table class='table'>";

		// content = content + "<tr>";
		// content = content + "<th>Emozione</th><th>Colore</th>";
		// content = content + "</tr>";

		content = content + "<div class='floatcontainer'>";

		for(var k = 0; k<data.emotions.length; k++){

			//console.log(data.emotions[k]);

			content = content + "<div class='legendelement'>";
			content = content + "" + data.emotions[k].label + "<span class='legendblock' style='background-color: rgb(" + data.emotions[k].r + "," + data.emotions[k].g + "," + data.emotions[k].b + ")'></span>";
			content = content + "</div>";	
		}

		content = content + "</div>";
		


		// content = content + "</table>";

		$("#emotions-legend").html(content);


		getEmotionsMap();

	});

}










var emotionmap;
var emotionheatmaps;
var emotionlegend;
var emotionmarkers;
function getEmotionsMap(){
    //var styledMap = new google.maps.StyledMapType(styles, {name: "HEMap"});

    $("#emotions-map").height(400);

    emotionmarkers = new Array();

    var mapOptions = {
        center: new google.maps.LatLng(45.466667, 9.183333),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        backgroundColor: '#FFFFFF',
        mapTypeControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: false,
        streetViewControl: false,
        zoomControl: true
    };

    emotionmap = new google.maps.Map(document.getElementById("emotions-map"), mapOptions);

    emotionmap.mapTypes.set('map_style', styledMap);
    emotionmap.setMapTypeId('map_style');

    emotionlegend = new Array();

    emotionheatmaps = new Object();
    

    var detectedEmotions = new Array();

    $.getJSON("report-emotions_geoPoints.json")
    .done(function(data){

                //console.log(data);

                data.data.forEach(function(d){

                  var found = false;
                  for(var i = 0; i<detectedEmotions.length && !found; i++){
                    if(detectedEmotions[i]==d.label){
                      found = true;
                    }
                  }
                  if(!found){
                    detectedEmotions.push(d.label);
                  }

                });

                //console.log(detectedEmotions);

                var datas = new Object();


                var huestep = 1/(detectedEmotions.length+1);

                var i = 0;

                detectedEmotions.forEach(function(d){
                  datas[d] = new google.maps.MVCArray();
                  emotionheatmaps[d] = new google.maps.visualization.HeatmapLayer({ map: emotionmap });
                  emotionheatmaps[d].setOptions( {radius: 20, opacity: 0.7, dissipating: true });

                  var hue = i*huestep;

                  var r = 0;
                  var g = 0;
                  var b = 0;
                  var found = false;
                  //console.log("search:" + d);
                  //console.log("in:");
                  //console.log(emotionsLegendData.emotions);
                  for(var kk = 0; kk<emotionsLegendData.emotions.length && !found; kk++){
                  	if(emotionsLegendData.emotions[kk].label==d){
                  		found = true;
                  		r = emotionsLegendData.emotions[kk].r;
                  		g = emotionsLegendData.emotions[kk].g;
                  		b = emotionsLegendData.emotions[kk].b;
                  	}
                  }

                  
                  var gradient = new Array();
                  gradient.push( 'rgba(' + r + ',' + g + ',' + b + ',0)'  );
                  gradient.push( 'rgba(' + r + ',' + g + ',' + b + ',1)'  );

                  //console.log(d);
                  //console.log(gradient);

                  var o = new Object();
                  o.label = d;
                  o.color = 'rgba(' + r + ',' + g + ',' + b + ',1)';

                  emotionlegend.push(o);

                  emotionheatmaps[d].set('gradient',  gradient);

                  i++;

                });


                

                for(var i = 0; i<data.data.length; i++){
                  datas[  data.data[i].label  ].push(  { location: new google.maps.LatLng(  parseFloat(data.data[i].lat) , parseFloat(data.data[i].lng)   ) , weight: parseFloat(data.data[i].c) } );
                }

                detectedEmotions.forEach(function(d){
                  emotionheatmaps[d].set('data' , datas[d]);
                });

                getEmotionsPie();

        
    })
    .fail(function( jqxhr, textStatus, error ){
        //fare qualcosa in caso di fallimento
    });
}


function getEmotionsPie(){
  $.getJSON("report-emotions.json", function(data){

    //console.log(data);

    var serie = [{
      name: "Emotions",
      colorByPoint: true,
      data: [
      ]
    }];

    data.data.forEach(function(d){
      var o = new Object();
      o.name = d.label;
      o.y = +d.value;


                  var r = 0;
                  var g = 0;
                  var b = 0;
                  var found = false;
                  //console.log("search:" + d);
                  //console.log("in:");
                  //console.log(emotionsLegendData.emotions);
                  for(var kk = 0; kk<emotionsLegendData.emotions.length && !found; kk++){
                    if(emotionsLegendData.emotions[kk].label==d.label){
                      found = true;
                      r = emotionsLegendData.emotions[kk].r;
                      g = emotionsLegendData.emotions[kk].g;
                      b = emotionsLegendData.emotions[kk].b;
                    }
                  }


      o.color = "rgb(" + r + "," + g + "," + b + ")";
      serie[0].data.push(o);
    });

    Highcharts.chart('emotion-pie', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: null
    },
    credits: {
      enabled: false
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    },
    series: serie
});



    getEmotionsDistribution();
  });
}


function getEmotionsDistribution(){

  $.getJSON("report-energy_comfort_distribution.json", function(data){

    //console.log(data);

    var serie = [];

    data.data.forEach(function(d){
      var o = new Object();
      o.x = +d.comfort;
      o.y = +d.energy;
      o.z = +d.c;

      o.color = "rgb(0,0,0)";

      if(o.x>=0 && o.y>=0){

        var r = emotionsLegendData.CPositiveEPositive.r;
        var g = emotionsLegendData.CPositiveEPositive.g;
        var b = emotionsLegendData.CPositiveEPositive.b;

        o.color = "rgb(" + r + "," + g + "," + b + ")";

      } else if(o.x>=0 && o.y<0){

        var r = emotionsLegendData.CPositiveENegative.r;
        var g = emotionsLegendData.CPositiveENegative.g;
        var b = emotionsLegendData.CPositiveENegative.b;

        o.color = "rgb(" + r + "," + g + "," + b + ")";

      } else if(o.x<0 && o.y<0){
        var r = emotionsLegendData.CNegativeENegative.r;
        var g = emotionsLegendData.CNegativeENegative.g;
        var b = emotionsLegendData.CNegativeENegative.b;

        o.color = "rgb(" + r + "," + g + "," + b + ")";
      } else if(o.x<0 && o.y>=0){
        var r = emotionsLegendData.CNegativeEPositive.r;
        var g = emotionsLegendData.CNegativeEPositive.g;
        var b = emotionsLegendData.CNegativeEPositive.b;

        o.color = "rgb(" + r + "," + g + "," + b + ")";
      }

      serie.push( o );

    });


    Highcharts.chart('emotion-distrib', {

    chart: {
        type: 'bubble',
        plotBorderWidth: 1,
        zoomType: 'xy'
    },

    legend: {
        enabled: false
    },

    title: {
        text: null
    },

    credits: {
      enabled: false
    },

    xAxis: {
        gridLineWidth: 1,
        title: {
            text: 'Comfort'
        }
    },

    yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
            text: 'Energy'
        },
        maxPadding: 0.2
    },

    tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: 
            '<tr><th>Comfort:</th><td>{point.x}</td></tr>' +
            '<tr><th>Energy:</th><td>{point.y}</td></tr>' +
            '<tr><th>Quantity:</th><td>{point.z}</td></tr>',
        footerFormat: '</table>',
        followPointer: true
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.z}'
            }
        }
    },

    series: [{
        data: serie
    }]

});


    getEmotionsTimeline();

  });

}


function getEmotionsTimeline(){

  $.getJSON("report-emotions_timelines.json", function(data){
    //console.log(data);

    var emotionsOptions = [];

    for(var em in data){
      //console.log(em);


                  var r = 0;
                  var g = 0;
                  var b = 0;
                  var found = false;
                  for(var kk = 0; kk<emotionsLegendData.emotions.length && !found; kk++){
                    if(emotionsLegendData.emotions[kk].label==em){
                      found = true;
                      r = emotionsLegendData.emotions[kk].r;
                      g = emotionsLegendData.emotions[kk].g;
                      b = emotionsLegendData.emotions[kk].b;
                    }
                  }


      data[em].forEach(function(d){
        d[0] = parseFloat(d[0])*1000;
        d[1] = parseFloat(d[1]);
      });
      //console.log(data[em]);
      var o = {
        name: em,
        data: data[em],
        color: "rgb(" + r + "," + g + "," + b + ")"
      };
      emotionsOptions.push( o );
    }


    Highcharts.stockChart('emotion-time', {

            rangeSelector: {
                enabled: false
            },

            credits: {
              enabled: false
            },

            navigator: {
              enabled: false
            },

            scrollbar: {
              enabled: false
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value ;
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'value',
                    connectNulls: true,
                    showInNavigator: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },

            series: emotionsOptions
        });


    getMaxEmotions();

  });

}






function getMaxEmotions(){

  $.getJSON("report-max_emotions.json", function(data){
    //console.log(data);
  
    var cont = "<table class='table'>";
    cont = cont + "<tr><th>Emozione</th><th>Messaggio</th><th>Quando</th></tr>";
    for(var em in data){
      data[em].forEach(function(d){
        cont = cont + "<tr><td>" + d.emotion + "</td><td>" + d.content + "</td><td>" + d.created_at + "</td></tr>";
      });
    }

    cont = cont + "</table>";

    $("#top-emotions").html(cont);

  });

}



function getTopUsers(){

  $.getJSON("report-top_users.json", function(data){
    //console.log(data);
  
    
    var cont = "<h4>Reach</h4><table class='table'>";
    cont = cont + "<tr><th>User</th><th>Reach</th></tr>";
      data.reach.forEach(function(d){
        cont = cont + "<tr><td>" + d.name + "[" + d.nick + "]" + "</td><td>" + d.reach + "</td></tr>";
      });


    cont = cont + "</table>";

    $("#top-users-reach").html(cont);


    cont = "<h4>Ratio</h4><table class='table'>";
    cont = cont + "<tr><th>User</th><th>Engagement/Post Ratio</th></tr>";
      data.ratio.forEach(function(d){
        cont = cont + "<tr><td>" + d.name + "[" + d.nick + "]" + "</td><td>" + d.ratio + "</td></tr>";
      });

    cont = cont + "</table>";

    $("#top-users-ratio").html(cont);
    

  });

}


function getTopics(){

  $.getJSON("report-topics.json", function(data){
    
    $(".replaceNumTopics").text(data.stats.numtopics);
    $(".replaceTopTopic").text(data.stats.toptopic);
    $(".replaceTopTopicNumUsers").text(data.stats.toptopicn);


    $("#topics").height(800);


    var svg = d3.select("#topics").append("svg")
      .style("width",  "100%" )
      .style("height",  d3.select("#topics").style("height") );
      //.style("width",  d3.select("#scroller3").style("width") )
      //.style("height",  d3.select("#scroller3").style("height") );

    
    var margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = +svg.style("width").replace("px","") - margin.left - margin.right,
    height = +svg.style("height").replace("px","") - margin.top - margin.bottom;

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var topiclist = [];
    for(tp in data.topics){
      var o = new Object();
      o.name = tp;
      o.number = data.topics[tp];
      topiclist.push(o);
    }

    data2 = { children: topiclist  };
    
    var bubble = d3.pack(data2)
            .size([width, height])
            .padding(1.5);

    var nodes = d3.hierarchy(data2)
      .sum(function(d) { return d.number; });

    var node = g.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

      node.append("title")
            .text(function(d) {
              //console.log(d);
                return d.data.name;
            });

      node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", "#111122");

    node.append("text")
      .attr("class","bubbletext")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .style("fill","#FFFFFF")
            .text(function(d) {
                return d.data.name;
            })
            .style("font-size", function(d){
              var res = Math.floor(2*d.r/d.data.name.length) + "px";
              return res;
            });
    



    var cont = "<h4>Top Topics</h4><table class='table'>";
    cont = cont + "<tr><th>Topic</th><th>Message</th></tr>";
      data.hitparade.forEach(function(d){
        cont = cont + "<tr><td>" + d.topic + "[" + d.n + "]" + "</td><td>" + d.content + "</td></tr>";
      });

    cont = cont + "</table>";

    $("#toptopics").html(cont);



  });

}









var JSONPolygons = ["Distretti.geojson"];
var JSONLayers = ["Arene-piazze-parchi.geojson", "teatri-sale-concerto.geojson", "venues.geojson"];

var limit = 500;

var total = 0;
var totalPoly = 0;

var GEOJSONDATA,GEOJSONDATAPOLY;

    var venuesmap;


    var venuesmarkers;

    var venuespolygons;

var maxSizePoly = 0;
var howmanyPoly = 0;


function getDistrictVenues(){


  $("#distrettivenues").height(600);

  GEOJSONDATA = new Array();
  GEOJSONDATAPOLY = new Array();


    venuesmarkers = new Array();

    venuespolygons = new Array();

    var mapOptions = {
        center: new google.maps.LatLng(45.466667, 9.183333),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        backgroundColor: '#EEEEEE',
        mapTypeControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: true,
        streetViewControl: false,
        zoomControl: false
    };

    venuesmap = new google.maps.Map(document.getElementById("distrettivenues"), mapOptions);

    
    venuesmap.mapTypes.set('map_style', styledMap);
    venuesmap.setMapTypeId('map_style');

  $.getJSON("report-geo_points_and_polys.json", function(data){

    //console.log(data);

    //polys
    for(var i=0; i<data.polys.length; i++){
      GEOJSONDATAPOLY[i]= data.polys[i] ;
      totalPoly = totalPoly + data.polys[i].features.length;

          for(var j =0; j<data.polys[i].features.length; j++){
            //console.log(data.polys[i].features[j]);

            var nome = data.polys[i].features[j].Name;
            //console.log("Name:" + nome);
            var search = data.polys[i].features[j].search;
            var keywords = search.split(",");

            //
                data.polys[i].features[j].results[0].c = +data.polys[i].features[j].results[0].c;
                data.polys[i].features[j].results[0].comfort = +data.polys[i].features[j].results[0].comfort;
                data.polys[i].features[j].results[0].energy = +data.polys[i].features[j].results[0].energy;

                var siz = 2 + data.polys[i].features[j].results[0].c;

                if(maxSizePoly<siz){ maxSizePoly = siz; }

                var coords = new Array();

                for(var k = 0; k<GEOJSONDATAPOLY[i].features[j].geometry.coordinates.length; k++){
                  for(var kk = 0; kk<GEOJSONDATAPOLY[i].features[j].geometry.coordinates[k].length; kk++){
                    coords.push(  
                        {
                          lat: GEOJSONDATAPOLY[i].features[j].geometry.coordinates[k][kk][1],
                          lng: GEOJSONDATAPOLY[i].features[j].geometry.coordinates[k][kk][0]
                        }
                    );
                  }
                }


                var poly = new google.maps.Polygon({
                  paths: coords,
                  strokeColor: GEOJSONDATAPOLY[i].color,
                  strokeOpacity: 0.6,
                  strokeWeight: 2,
                  fillColor: GEOJSONDATAPOLY[i].color,
                  fillOpacity: 0.35,
                  title: GEOJSONDATAPOLY[i].features[j].Name + "(" + data.polys[i].features[j].results[0].c + ")"
                });

                poly.c = data.polys[i].features[j].results[0].c;

                venuespolygons.push( poly );


                howmanyPoly++;

            //

          }

    }

    for(var i = 0; i<venuespolygons.length; i++){
      venuespolygons[i].fillOpacity = 1*venuespolygons[i].c/maxSizePoly;
      venuespolygons[i].setMap( venuesmap );
    }
    //polys



    //points
    for(var i=0; i<data.points.length; i++){


          GEOJSONDATA[i]= data.points[i] ;

          total = total + data.points[i].features.length;

          for(var j =0; j<data.points[i].features.length; j++){

            var nome = data.points[i].features[j].Name;
            var search = data.points[i].features[j].search;
            var keywords = search.split(",");

            
            data.points[i].features[j].results[0].c = +data.points[i].features[j].results[0].c;
            data.points[i].features[j].results[0].comfort = +data.points[i].features[j].results[0].comfort;
            data.points[i].features[j].results[0].energy = +data.points[i].features[j].results[0].energy;


            var siz = 2 + data.points[i].features[j].results[0].c;

            if(maxSizePoly<siz){ maxSizePoly = siz; }

            var marker = new google.maps.Marker({
              position: {lat: parseFloat(GEOJSONDATA[i].features[j].geometry.coordinates[1]), lng: parseFloat(GEOJSONDATA[i].features[j].geometry.coordinates[0])},
              map: null,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: siz,
                fillColor: GEOJSONDATA[i].color,
                fillOpacity: 0.8,
                strokeColor: 'rgba(255,255,255,0.3)',
                strokeWeight: 1
              },
              title: GEOJSONDATA[i].features[j].Name
            });

            venuesmarkers.push( marker );

          }
    }
    for(var i = 0; i<venuesmarkers.length; i++){
      venuesmarkers[i].icon.scale = 1 + 20*venuesmarkers[i].icon.scale/maxSizePoly;
      venuesmarkers[i].setMap( venuesmap );
    }
    //points



    var cont = "<table class='table'>";
    cont = cont + "<tr><th>Distretto</th><th>Quantità</th><th>Emozione</th></tr>";
    for(var i=0; i<data.polys.length; i++){
      for(var j =0; j<data.polys[i].features.length; j++){

        var co = "#000000";

        if(data.polys[i].features[j].results[0].comfort>=0 && data.polys[i].features[j].results[0].energy>=0){
          co = "rgb(" + emotionsLegendData.CPositiveEPositive.r + "," + emotionsLegendData.CPositiveEPositive.g + "," + emotionsLegendData.CPositiveEPositive.b + ")";
        } else if(data.polys[i].features[j].results[0].comfort>=0 && data.polys[i].features[j].results[0].energy<0){
          co = "rgb(" + emotionsLegendData.CPositiveENegative.r + "," + emotionsLegendData.CPositiveENegative.g + "," + emotionsLegendData.CPositiveENegative.b + ")";
        } else if(data.polys[i].features[j].results[0].comfort<0 && data.polys[i].features[j].results[0].energy<0){
          co = "rgb(" + emotionsLegendData.CNegativeENegative.r + "," + emotionsLegendData.CNegativeENegative.g + "," + emotionsLegendData.CNegativeENegative.b + ")";
        } else if(data.polys[i].features[j].results[0].comfort<0 && data.polys[i].features[j].results[0].energy>=0){
          co = "rgb(" + emotionsLegendData.CNegativeEPositive.r + "," + emotionsLegendData.CNegativeEPositive.g + "," + emotionsLegendData.CNegativeEPositive.b + ")";
        }

        cont = cont + "<tr><td>" + data.polys[i].features[j].Name + "</td><td>" + data.polys[i].features[j].results[0].c + "</td><td><div class='legendblock' style='background-color:"  + co + ";'></div></td></tr>";
      }
    }
    cont = cont + "</table>";



    $("#polyemotions").html( cont  );


    var venues = new Array();
    for(var i=0; i<data.points.length; i++){
      for(var j =0; j<data.points[i].features.length; j++){
        var o = new Object();
        o.name = data.points[i].features[j].Name;
        o.n = data.points[i].features[j].results[0].c;
        o.comfort = data.points[i].features[j].results[0].comfort;
        o.energy = data.points[i].features[j].results[0].energy;

        venues.push( o );

      }
    }


    // venues più discusse
    venues.sort(function(a, b) {
        return parseFloat(b.n) - parseFloat(a.n);
    });
    //console.log(venues);
    cont = "<table class='table'>";
    cont = cont + "<tr><th>Venue</th><th>Quantità</th><th>Emozione</th></tr>";
    for(var i=0; i<venues.length && i<3; i++){

        var co = "#000000";

        if(venues[i].comfort>=0 && venues[i].energy>=0){
          co = "rgb(" + emotionsLegendData.CPositiveEPositive.r + "," + emotionsLegendData.CPositiveEPositive.g + "," + emotionsLegendData.CPositiveEPositive.b + ")";
        } else if(venues[i].comfort>=0 && venues[i].energy<0){
          co = "rgb(" + emotionsLegendData.CPositiveENegative.r + "," + emotionsLegendData.CPositiveENegative.g + "," + emotionsLegendData.CPositiveENegative.b + ")";
        } else if(venues[i].comfort<0 && venues[i].energy<0){
          co = "rgb(" + emotionsLegendData.CNegativeENegative.r + "," + emotionsLegendData.CNegativeENegative.g + "," + emotionsLegendData.CNegativeENegative.b + ")";
        } else if(venues[i].comfort<0 && venues[i].energy>=0){
          co = "rgb(" + emotionsLegendData.CNegativeEPositive.r + "," + emotionsLegendData.CNegativeEPositive.g + "," + emotionsLegendData.CNegativeEPositive.b + ")";
        }

        cont = cont + "<tr><td>" + venues[i].name + "</td><td>" + venues[i].n + "</td><td><div class='legendblock' style='background-color:"  + co + ";'></div></td></tr>";
    }
    cont = cont + "</table>";
    $("#mostdiscussedvenues").html( cont  );



    // venues più amate
    venues.sort(function(a, b) {
        return parseFloat(b.comfort) - parseFloat(a.comfort);
    });
    //console.log(venues);
    cont = "<table class='table'>";
    cont = cont + "<tr><th>Venue</th><th>Quantità</th><th>Emozione</th></tr>";
    for(var i=0; i<venues.length && i<3; i++){

        var co = "#000000";

        if(venues[i].comfort>=0 && venues[i].energy>=0){
          co = "rgb(" + emotionsLegendData.CPositiveEPositive.r + "," + emotionsLegendData.CPositiveEPositive.g + "," + emotionsLegendData.CPositiveEPositive.b + ")";
        } else if(venues[i].comfort>=0 && venues[i].energy<0){
          co = "rgb(" + emotionsLegendData.CPositiveENegative.r + "," + emotionsLegendData.CPositiveENegative.g + "," + emotionsLegendData.CPositiveENegative.b + ")";
        } else if(venues[i].comfort<0 && venues[i].energy<0){
          co = "rgb(" + emotionsLegendData.CNegativeENegative.r + "," + emotionsLegendData.CNegativeENegative.g + "," + emotionsLegendData.CNegativeENegative.b + ")";
        } else if(venues[i].comfort<0 && venues[i].energy>=0){
          co = "rgb(" + emotionsLegendData.CNegativeEPositive.r + "," + emotionsLegendData.CNegativeEPositive.g + "," + emotionsLegendData.CNegativeEPositive.b + ")";
        }

        cont = cont + "<tr><td>" + venues[i].name + "</td><td>" + venues[i].n + "</td><td><div class='legendblock' style='background-color:"  + co + ";'></div></td></tr>";
    }
    cont = cont + "</table>";
    $("#mostlovedvenues").html( cont  );



    // all venues
    venues.sort(function(a, b) {
        return parseFloat(b.n) - parseFloat(a.n);
    });
    //console.log(venues);
    cont = "<table class='table'>";
    cont = cont + "<tr><th>Venue</th><th>Quantità</th><th>Emozione</th></tr>";
    for(var i=0; i<venues.length; i++){

        var co = "#000000";

        if(venues[i].comfort>=0 && venues[i].energy>=0){
          co = "rgb(" + emotionsLegendData.CPositiveEPositive.r + "," + emotionsLegendData.CPositiveEPositive.g + "," + emotionsLegendData.CPositiveEPositive.b + ")";
        } else if(venues[i].comfort>=0 && venues[i].energy<0){
          co = "rgb(" + emotionsLegendData.CPositiveENegative.r + "," + emotionsLegendData.CPositiveENegative.g + "," + emotionsLegendData.CPositiveENegative.b + ")";
        } else if(venues[i].comfort<0 && venues[i].energy<0){
          co = "rgb(" + emotionsLegendData.CNegativeENegative.r + "," + emotionsLegendData.CNegativeENegative.g + "," + emotionsLegendData.CNegativeENegative.b + ")";
        } else if(venues[i].comfort<0 && venues[i].energy>=0){
          co = "rgb(" + emotionsLegendData.CNegativeEPositive.r + "," + emotionsLegendData.CNegativeEPositive.g + "," + emotionsLegendData.CNegativeEPositive.b + ")";
        }

        cont = cont + "<tr><td>" + venues[i].name + "</td><td>" + venues[i].n + "</td><td><div class='legendblock' style='background-color:"  + co + ";'></div></td></tr>";
    }
    cont = cont + "</table>";
    $("#mostallvenues").html( cont  );


  });

}



function getClusters(){
  $.getJSON("report-clusters.json", function(data){

    //console.log(data);

    var container = d3.select("#classificazioni");
    //console.log(container);


    for(var i = 0; i<data.clusters.length; i++){
      var clustercontainer = container.append("div")
        .attr("class","row page-break");
      clustercontainer.append("div")
        .attr("class","col-md-2 col-xs-2");

      var vizcontainer = clustercontainer.append("div")
        .attr("class","col-md-8 col-xs-8");

      clustercontainer.append("div")
        .attr("class","col-md-2 col-xs-2");


      vizcontainer.append("h4")
        .text( data.clusters[i].name );



        handleCluster(vizcontainer,data.clusters[i]);


        vizcontainer.append("p")
        .text( data.clusters[i].description );


        var seriesOptions = new Array();
        for(var j = 0; j<data.clusters[i].categories.length; j++){
          var o = new Object();
          o.name = data.clusters[i].categories[j].slug;
          o.data = data.clusters[i].categories[j].timeline;

          o.data.forEach(function(d){
            d[0] = +d[0]*1000;
            d[1] = +d[1];
          });

          seriesOptions.push( o );
        }

        var idviztimeline = "viz-timeline-" + data.clusters[i].name.replace(" ","");
        vizcontainer.append("div")
          .attr("id",  idviztimeline);

        createViz(idviztimeline,seriesOptions);


    }

  });

}


function createViz(idviztimeline,seriesOptions){
  Highcharts.stockChart(idviztimeline, {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        navigator: {
          enabled: false
        },

        scrollbar: {
          enabled: false
        },

        credits: {
          enabled: false
        },

        legend: {
          enabled: true
        },

        series: seriesOptions
    });
}

function handleCluster(vizcontainer,data){

  //console.log(data);

      var nodes = [];
      var links = [];

      var matrix = [];

      var grouptoindex = new Object();

      for(var i = 0; i<data.categories.length; i++){
        matrix[i] = [];
        grouptoindex[data.categories[i].slug] = i;
        for(var j = 0; j<data.categories.length; j++){
          matrix[i][j] = 0;
        }        
      }

      var nest1 = d3.nest()
                    .key( function(d){ return d.s1id; })
                    .entries( data.data );

      


      for(var i = 0; i<nest1.length; i++){
        var d = nest1[i];
        //console.log(d);
        var value = [];
        for(var y = 0; y<data.categories.length; y++ ){
          value[data.categories[y].slug] = 0;
        }
        for(var z = 0; z<d.values.length; z++ ){
          for(var y = 0; y<data.categories.length; y++ ){
            d.values[z][data.categories[y].slug] = +d.values[z][data.categories[y].slug];
            value[data.categories[y].slug] = value[data.categories[y].slug] + d.values[z][data.categories[y].slug];
          }  
        }

        //console.log(value);

        for(var j = 0; j<data.categories.length; j++){
          var id1 = grouptoindex[data.categories[j].slug];
          if(value[data.categories[j].slug]==1){
            for(var k = 0; k<data.categories.length; k++){
              var id2 = grouptoindex[data.categories[k].slug];
              if(value[data.categories[k].slug]==1){
                matrix[id1][id2] = matrix[id1][id2] + 1;
              }
            }
          }
        }
      }

      //console.log(matrix);

      var outerRadius = 300,
      innerRadius = outerRadius - 130;

      var fill = d3.scaleOrdinal(d3.schemeCategory20);

      var chord = d3.chord()
      .padAngle(.04)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

      var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + 20);

      var ribbon = d3.ribbon()
      .radius(innerRadius);

      var svg = vizcontainer.append("svg")
      .attr("width", outerRadius * 2)
      .attr("height", outerRadius * 2)
      .append("g")
      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
      .datum(chord(matrix));
      
      
      var g = svg.selectAll(".group")
        .data(function(chords) { return chords.groups; })
        .enter().append("g")
        .attr("class", "group");

      g.append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", arc);

      g.append("text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (innerRadius + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .text(function(d) { 
          return data.categories[d.index].name;  //  nameByIndex.get(d.index); 
        });

      svg.selectAll(".chord")
        .data(function(chords) { return chords; })
        .enter().append("path")
        .attr("class", "chord")
        .attr("d", ribbon)
        .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
        .style("fill", function(d) { return fill(d.source.index); });

}


