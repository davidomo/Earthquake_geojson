// Set background map
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_to" +
  "ken=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkO" +
  "BWH_k9GbS8JQ", {
    attribution: "Map data &copy;" +
      "<a href='http://openstreetmap.org'>OpenStreetMap</a> contributors," +
      "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>" +
      "Imagery &copy <a href='http://mapbox.com'>Mapbox</a>",
    maxZoom: 18
  });

// We create the map object with options.
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// Then we add our 'graymap' tile layer to the map.
graymap.addTo(map);

// Here we make an AJAX call that retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

// Loop through all the data to get needed information
  function makePoints(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: colorFun(feature.properties.mag),
      color: "#000000",
      radius: sizeMaker(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Set color based on the magnitude
  function colorFun(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ffff00";
      case magnitude > 4:
        return "#ff3300";
      case magnitude > 3:
        return "#00ff00";
      case magnitude > 2:
        return "#00ccff";
      case magnitude > 1:
        return "#ff00ff";
      default:
        return "#ccccff";
    }
  }

  // Find size of the marker
  function sizeMaker(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style
    style: makePoints,
    // Create a pop-up with more details about the earthquake
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  // Set up a legend
  var legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend. Colors are same from the colorFun function
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#ccccff",
      "#ff00ff",
      "#00ccff",
      "#00ff00",
      "#ff3300",
      "#ffff00"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Call legend to the map
  legend.addTo(map);
});
