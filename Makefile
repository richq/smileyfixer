VERSION := 1.0

CLOSURE_JAR := $(HOME)/tools/closure-compiler/compiler.jar
CLOSURE := java -jar $(CLOSURE_JAR)
CLOSUREFLAGS := --compilation_level ADVANCED_OPTIMIZATIONS --externs externs1.js --warning_level VERBOSE

.PHONY: all clean dist
INFILE := chrome/content/messenger-overlay.js
OUTFILE := chrome/content/messenger-overlay-min.js

all: $(OUTFILE)

clean:
	-rm -f $(OUTFILE)

$(OUTFILE): $(INFILE) externs1.js
	$(CLOSURE) $(CLOSUREFLAGS) --js $< --js_output_file $@

pretty.js : $(OUTFILE)
	$(CLOSURE) --formatting PRETTY_PRINT --js $< --js_output_file $@

dist: $(OUTFILE)
	zip -r smileyfixer-$(VERSION).xpi \
		./install.rdf \
		./chrome.manifest \
		./defaults/preferences/prefs.js \
		./chrome/content/about.xul \
		./chrome/content/smileyfixer.png \
		./chrome/content/messenger-overlay.xul \
		./chrome/content/messenger-overlay-min.js \
		./chrome/locale/en-US/about.dtd
