// handlers.jsx
#target photoshop
app.displayDialogs = DialogModes.NO;

// Polyfill for Array.forEach (ExtendScript-safe)
if (typeof Array.prototype.forEach !== "function") {
  Array.prototype.forEach = function(callback, thisArg) {
    for (var i = 0; i < this.length; i++) {
      if (i in this) callback.call(thisArg, this[i], i, this);
    }
  };
}

// Helpers
function log(msg) { $.writeln("[handlers] " + msg); }
function safeFindLayerByName(name, doc) {
  var d = doc || app.activeDocument;
  try { return d.artLayers.getByName(name); } 
  catch(e){ log("Layer not found: " + name); return null; }
}

// Handler registry
var LayerHandlers = {
  "TEXT": function(layer, value) { try { if(layer.kind===LayerKind.TEXT) layer.textItem.contents=value; else log("WARN: not text"); } catch(e){log(e);} },
  "IMAGE": function(layer, value){ log("IMAGE replace: "+layer.name+" <- "+value); /* TODO: smart object replace */ },
  "SHAPE": function(layer, value){ log("SHAPE update: "+layer.name+" <- "+value); }
};

// Expose a named function globally
$.global.processPackage = function(pkg) {
  try {
    log("handlers: Starting render pass. rows=" + pkg.rows.length);
    var doc = app.activeDocument;
    pkg.rows.forEach(function(row, rowIndex){
      log("Row " + rowIndex + " start ---");
      row.mappings.forEach(function(map){
        var layer = safeFindLayerByName(map.layerName, doc);
        if(!layer) return;
        var handler = LayerHandlers[map.layerType.toUpperCase()];
        if(handler) handler(layer, map.value);
        else log("No handler for type: " + map.layerType);
      });
      log("Row " + rowIndex + " done ===");
    });
    alert("handlers: All rows processed. Check log.");
  } catch(err) {
    alert("handlers ERROR: " + err.toString());
    $.writeln("handlers ERROR: " + err.toString());
    throw err;
  }
};
