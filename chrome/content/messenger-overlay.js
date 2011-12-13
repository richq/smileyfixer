/* SmileyFixer namespace */

if (typeof SmileyFixer == "undefined") {
    var SmileyFixer = {};
    SmileyFixer.prefs = (Components.classes["@mozilla.org/preferences-service;1"].
                         getService(Components.interfaces.nsIPrefService).
                             getBranch("extensions.smileyfixer."));

    SmileyFixer.fixSpan = function(span, mapping) {
        var origSpan = span;
        if (span.firstChild.tagName === "SPAN") {
            /* crazy list thing */
            span = span.firstChild;
        }
        var compareTo = span.firstChild.data;
        var result = compareTo;
        if (mapping[compareTo]) {
            result = mapping[compareTo];
        } else {
            return;
        }
        span.firstChild.data = result;
        origSpan.style.fontFamily = "";
        /* show in red if debugging */
        if (SmileyFixer.prefs.getBoolPref("debug"))
            origSpan.style.backgroundColor = "#ff0000";
    };

    SmileyFixer.getUnicodePref = function(prefName) {
        return SmileyFixer.prefs.getComplexValue(prefName,
            Components.interfaces.nsISupportsString).data;
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
        var mapping = {
            'J': 'smiley',
            'L': 'unsmiley',
            'à': 'longarrow',
            'è': 'arrow',
            'ß': 'larrow',
            "·": 'blob'
        };
        for (var key in mapping) {
            mapping[key] = SmileyFixer.getUnicodePref(mapping[key]);
        }

        var mp = document.getElementById('messagepane');
        var spans = mp.contentDocument.getElementsByTagName("span");
        for (var i = 0; i < spans.length; i++) {
            try {
                var span = spans[i];
                if (span.style.fontFamily === "Wingdings" ||
                    span.style.fontFamily === "Symbol") {
                    SmileyFixer.fixSpan(span, mapping);
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
