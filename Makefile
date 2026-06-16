SPHINXBUILD ?= sphinx-build
SED_FIX = sed 's|<span class="sr-only">Copy code</span>|<span class="sr-only"></span>|g' \
          "$$(python3 -c 'import sphinxawesome_theme, os; print(os.path.join(os.path.dirname(sphinxawesome_theme.__file__), "static", "theme.js"))')"

MANUALS = ca-manual cmt-manual
PDF_TARGETS = $(addsuffix -pdf,$(MANUALS))

.PHONY: help html pdf clean $(MANUALS) $(PDF_TARGETS)

help:
	@echo "Available targets:"
	@echo "  ca-manual      Build ca-manual HTML"
	@echo "  cmt-manual     Build cmt-manual HTML"
	@echo "  html           Build all manuals (HTML)"
	@echo "  ca-manual-pdf  Build ca-manual PDF"
	@echo "  cmt-manual-pdf Build cmt-manual PDF"
	@echo "  pdf            Build all manuals (PDF)"
	@echo "  clean          Remove all build outputs"

$(MANUALS):
	$(SED_FIX) > $@/_static/theme.js
	$(SPHINXBUILD) -b html -d $@/_build/doctrees $@ $@/_build/html

html: $(MANUALS)

$(PDF_TARGETS): %-pdf:
	$(SPHINXBUILD) -b simplepdf -d $*/_build/doctrees $* $*/_build/simplepdf

pdf: $(PDF_TARGETS)

clean:
	rm -rf $(addsuffix /_build,$(MANUALS))
