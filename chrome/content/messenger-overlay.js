var SMILEY_FIX_PREFS = Components.classes["@mozilla.org/preferences-service;1"].
            getService(Components.interfaces.nsIPrefService).
            getBranch("extensions.smileyfixer.");

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
        origSp.style.fontFamily = "";
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
        var longarrow = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("longarrow")));
        var blob = decodeURIComponent(escape(SMILEY_FIX_PREFS.getCharPref("blob")));
        /*var promptService = Components.classes[
            "@mozilla.org/embedcomp/prompt-service;1"].getService(
                Components.interfaces.nsIPromptService);*/
        var mp = document.getElementById('messagepane');
        var spans = mp.contentDocument.getElementsByTagName("span");
        var wdmapping = {
            'J': smiley,
            'L': unsmiley,
            'à': longarrow,
            'è': arrow
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
