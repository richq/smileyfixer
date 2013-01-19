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
        var result = '';
        var found = false;
        for (var i = 0 ; i < compareTo.length; i++) {
            var txt = compareTo.charAt(i);
            var replacement = mapping[txt]
            if (replacement) {
                result += replacement;
                found = true;
            } else {
                result += txt;
            }
        }
        if (! found) {
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
        var mp = document.getElementById('messagepane');
        SmileyFixer.doFixups(mp.contentDocument);
        document.addEventListener("load", SmileyFixer.onLoadMessagePane, true);
    };

    SmileyFixer.doFixups = function(contentDocument) {
        var mapping = {
            'J': 'smiley',
            'K': 'neutral',
            'L': 'unsmiley',
            'N': 'skull',
            'à': 'longarrow',
            'è': 'arrow',
            'ß': 'larrow',
            '·': 'blob',
            'n': 'square',
            'ó': 'leftright',
            'Ø': 'toplightarrow'
        };
        for (var key in mapping) {
            mapping[key] = SmileyFixer.getUnicodePref(mapping[key]);
        }

        var spans = contentDocument.getElementsByTagName("span");
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
    };

    SmileyFixer.init = function() {
        document.addEventListener("load", SmileyFixer.onLoadMessagePane, true);
    };

    /* for the compose window */
    SmileyFixer.onLoadComposePane = function(event) {
        var type = GetCurrentEditorType();
        if (type !== "htmlmail")
            return;
        if (!SmileyFixer.prefs.getBoolPref("enabled"))
            return;

        var currentEditor = GetCurrentEditor();
        if (currentEditor === null)
            return;
        var currentEditorDom = currentEditor.rootElement;
        SmileyFixer.doFixups(currentEditorDom);
    };

    SmileyFixer.initCompose = function() {
        document.addEventListener("load", SmileyFixer.onLoadComposePane, true);
    };
}
