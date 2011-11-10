VERSION := $(shell awk '/em:version/ {gsub("</?em:version>", "",$$1); print $$1}' install.rdf)

CLOSURE_JAR := $(HOME)/tools/closure-compiler/compiler.jar
CLOSURE := java -jar $(CLOSURE_JAR)
CLOSUREFLAGS := --compilation_level ADVANCED_OPTIMIZATIONS --externs externs1.js --warning_level VERBOSE

dist_EXTRA :=   ./install.rdf \
		./chrome.manifest \
		./defaults/preferences/prefs.js \
		./chrome/content/about.xul \
		./chrome/content/options.xul \
		./chrome/content/smileyfixer.png \
		./chrome/content/messenger-overlay.xul \
		./chrome/locale/en-US/about.dtd

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

dist: smileyfixer-$(VERSION).xpi

smileyfixer-$(VERSION).xpi: $(OUTFILE) $(dist_EXTRA)
	zip -r smileyfixer-$(VERSION).xpi $^
