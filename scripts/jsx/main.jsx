#include "runner.jsx"
#include "handlers.jsx"

(function(){
  try {
    if(!$.global._PS_PACKAGE) throw new Error("No package loaded");
    $.global.processPackage($.global._PS_PACKAGE);
    alert("✅ Automation complete");
  } catch(e){ alert("❌ Fatal: "+e.toString()); }
})();
