var SMILEY_FIX_PREFS = Components.classes["@mozilla.org/preferences-service;1"].
            getService(Components.interfaces.nsIPrefService).
            getBranch("extensions.smileyfixer.");

function appendErro(str){
    throw new Error("DEBUG: "+str)
}

function debug(str){
    setTimeout("appendErro('"+str+"')", 1)
}

var smileyfixerOverlay = {
    fixSpan: function(span, mappings) {
        var origSpan = span;
        if (span.firstChild.tagName === "SPAN") {
            /* crazy list thing */
            span = span.firstChild;
        }
        var compareTo = span.firstChild.data;
        var result = compareTo;
        if (mappings[compareTo]) {
            result = mappings[compareTo];
        } else {
            return;
        }
        span.firstChild.data = result;
        origSpan.style.fontFamily = "";
        /* show in red if debugging */
        if (SMILEY_FIX_PREFS.getBoolPref("debug"))
            origSpan.style.backgroundColor = "#ff0000";
    },
    onLoadMessagePane: function(event) {
        /* Only process when there is a message present */
        if (!gMessageDisplay)
            return;
        if (!gMessageDisplay.displayedMessage)
            return;
        document.removeEventListener("load", smileyfixerOverlay.onLoadMessagePane, true);
        var unsmiley = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("unsmiley")));
        var smiley = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("smiley")));
        var arrow = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("arrow")));
        var larrow = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("larrow")));
        var longarrow = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("longarrow")));
        var blob = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("blob")));
        var mp = document.getElementById('messagepane');
        var spans = mp.contentDocument.getElementsByTagName("span");
        var wdmapping = {
            'J': smiley,
            'L': unsmiley,
            'à': longarrow,
            'è': arrow,
            'ß': larrow
        };
        var symbolmapping = {"·": blob};
        for (var i = 0; i < spans.length; i++) {
            try {
                var span = spans[i];
                if (span.style.fontFamily === "Wingdings") {
                    smileyfixerOverlay.fixSpan(span, wdmapping);
                } else if (span.style.fontFamily === "Symbol") {
                    smileyfixerOverlay.fixSpan(span, symbolmapping);
                }
            }
            catch (e) {
            }
        }
        document.addEventListener("load", smileyfixerOverlay.onLoadMessagePane, true);
    }
};

document.addEventListener("load", smileyfixerOverlay.onLoadMessagePane, true);
