/* SmileyFixer namespace */

if (typeof SmileyFixer == "undefined") {
    var SmileyFixer = {};
    SmileyFixer.prefs = (Components.classes["@mozilla.org/preferences-service;1"].
                         getService(Components.interfaces.nsIPrefService).
                             getBranch("extensions.smileyfixer."));

    SmileyFixer.fixSpan = function(span, mappings) {
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
        if (SmileyFixer.prefs.getBoolPref("debug"))
            origSpan.style.backgroundColor = "#ff0000";
    };

    SmileyFixer.onLoadMessagePane = function(event) {
        /* Only process when there is a message present */
        if (!gMessageDisplay)
            return;
        if (!gMessageDisplay.displayedMessage)
            return;
        if (!SmileyFixer.prefs.getBoolPref("enabled"))
            return;
        document.removeEventListener("load", SmileyFixer.onLoadMessagePane, true);
        var unsmiley = decodeURIComponent(escape(SmileyFixer.prefs.getCharPref("unsmiley")));
        var smiley = decodeURIComponent(escape(SmileyFixer.prefs.getCharPref("smiley")));
        var arrow = decodeURIComponent(escape(SmileyFixer.prefs.getCharPref("arrow")));
        var larrow = decodeURIComponent(escape(SmileyFixer.prefs.getCharPref("larrow")));
        var longarrow = decodeURIComponent(escape(SmileyFixer.prefs.getCharPref("longarrow")));
        var blob = decodeURIComponent(escape(SmileyFixer.prefs.getCharPref("blob")));
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
                    SmileyFixer.fixSpan(span, wdmapping);
                } else if (span.style.fontFamily === "Symbol") {
                    SmileyFixer.fixSpan(span, symbolmapping);
                }
            }
            catch (e) {
            }
        }
        document.addEventListener("load", SmileyFixer.onLoadMessagePane, true);
    };

    SmileyFixer.init = function() {
        document.addEventListener("load", SmileyFixer.onLoadMessagePane, true);
    };
}

window.addEventListener("load", function() { SmileyFixer.init(); }, false);
