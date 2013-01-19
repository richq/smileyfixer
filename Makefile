filt := <em:version>%</em:version>
VERSION := $(patsubst $(filt),%,$(filter $(filt), $(shell cat install.rdf)))

dist_EXTRA :=   ./install.rdf \
		./chrome.manifest \
		./defaults/preferences/prefs.js \
		./chrome/content/options.xul \
		./chrome/content/smileyfixer.png \
		./chrome/content/messenger-overlay.xul \
		./chrome/content/messenger-overlay.js \
		./chrome/content/compose-overlay.xul \
		./chrome/content/compose-overlay.js \
		./chrome/content/smileyfixer.js \
		./locale/en-US/options.dtd \
		./locale/es-ES/options.dtd

.PHONY: all

all: smileyfixer-$(VERSION).xpi

smileyfixer-$(VERSION).xpi: $(dist_EXTRA)
	zip -r smileyfixer-$(VERSION).xpi $^
