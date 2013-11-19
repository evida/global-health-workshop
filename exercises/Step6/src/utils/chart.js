function loadGraph(geURL) {
    $.ajax({
          url: geURL,
          dataType: "jsonp",

        }).done(function ( data ) {
            var arrayRecords = data.arrayGenEntityItems;
            var dataToGraphDistance = new Array();
            var dataToGraphCalories = new Array();
            for(var i=0; i<arrayRecords.length; i++){
                dataToGraphDistance[i] = [(new Date(arrayRecords[i].fieldValues.measurement_date)).getTime() , arrayRecords[i].fieldValues.distance];
                dataToGraphCalories[i] = [(new Date(arrayRecords[i].fieldValues.measurement_date)).getTime() , arrayRecords[i].fieldValues.calories];
            }
            
            var d= dataToGraphDistance;
            function weekendAreas(axes) {
                var markings = [];
                var d = new Date(axes.xaxis.min);
                // go to the first Saturday
                d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
                d.setUTCSeconds(0);
                d.setUTCMinutes(0);
                d.setUTCHours(0);
                var i = d.getTime();
                do {
                    // when we don't set yaxis, the rectangle automatically
                    // extends to infinity upwards and downwards
                    markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
                    i += 7 * 24 * 60 * 60 * 1000;
                } while (i < axes.xaxis.max);

                return markings;
            }
            
            var options = {
                xaxis: { mode: "time", tickLength: 5 },
                selection: { mode: "x" },
                grid: { markings: weekendAreas },
                points: {show:true},
                lines: {show:true}
            };
            
            var plot = $.plot($("#placeholderW"), [{label:"Distância (km)", data:d},{label: "Calorias (ca)", data: dataToGraphCalories}], options);
            
            var overview = $.plot($("#overviewW"), [d, dataToGraphCalories], {
                series: {
                    lines: { show: true, lineWidth: 1 },
                    shadowSize: 0
                },
                xaxis: { ticks: [], mode: "time" },
                yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1 },
                selection: { mode: "x" }
            });

            // now connect the two
            
            $("#placeholderW").bind("plotselected", function (event, ranges) {
                // do the zooming
                plot = $.plot($("#placeholderW"), [{label:"Distância (km)", data:d},{label: "Calorias (ca)", data: dataToGraphCalories}],
                              $.extend(true, {}, options, {
                                  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                              }));

                // don't fire event on the overview to prevent eternal loop
                overview.setSelection(ranges, true);
            });
            
            $("#overviewW").bind("plotselected", function (event, ranges) {
                plot.setSelection(ranges);
            });
        }).fail(function() {});
    
}