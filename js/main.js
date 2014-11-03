      /********************************************************
        MapBox JS code credit: 
        https://www.mapbox.com/mapbox.js/example/v1.0.0/plain-leaflet/  
      ********************************************************/

      var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/chenrick.xx6tuik9/{z}/{x}/{y}.png');

      var params = {
        center: [0,0],
        minZoom: 0, 
        maxZoom: 5,
        zoom: 3       
      };

      var map = L.map('map', params)
          .addLayer(mapboxTiles);

      /********************************************************
        CartoDB code credit: http://docs.cartodb.com/tutorials/create_map_cartodbjs.html
      ********************************************************/

      var CbdLayerUrl = "http://chenrick.cartodb.com/api/v2/viz/f8014f6c-343f-11e4-a181-0e230854a1cb/viz.json";

      cartodb.createLayer(map, CbdLayerUrl)
      .addTo(map)
      .on('done', function(layer) {
    
      })
      .on('error', function(err) {
        alert("some error occurred: " + err);
      });

      init();

      function init() {

        var info = L.control();

        info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
        };

        info.update = function (props) {
          this._div.innerHTML = '<h4>Time Zone</h4>' +  (props ?
            '<b>' + props.time_zone + '</b><br>' +
            '<b>' + props.tz_name1st + '</b><br>' + props.places + ''
            : 'Hover over a timezone');
        };

        info.addTo(map);

        var timeZones;

        function highLightFeature(e) {
          var layer = e.target;

          layer.setStyle({
            fill: true,
            fillOpacity: 0.5,
            fillColor: '#60FFBE'
          });

          if (!L.Browser.ie && !L.Browser.opera) {
              layer.bringToFront();
          }

          info.update(layer.feature.properties);

        }

        function resetHighlight(e) {
            timeZones.resetStyle(e.target);
        }

        function onEachFeature(feature, layer) {
            layer.on({
              mouseover: highLightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature              
            });
        }        

        function zoomToFeature(e) {
          map.fitBounds(e.target.getBounds());
        }

        var style = {          
            color: "#60FFBE",
            weight: 0,
            opacity: 0.8,
            fillOpacity: 0                       
        };

        $.getJSON("data/ne_10m_time_zones.json", function(data){

          console.log('data: ', data);

          timeZones = L.geoJson(data, {
              style: style,
              onEachFeature: onEachFeature              
            }).addTo(map);              
          });

      }
