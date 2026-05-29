SPHINXBUILD ?= sphinx-build
SED_FIX = sed 's|<span class="sr-only">Copy code</span>|<span class="sr-only"></span>|g' \
          $$(find / -name theme.js | grep sphinxawesome_theme)

MANUALS = ca-manual cmt-manual

.PHONY: help html clean $(MANUALS)

help:
	@echo "Available targets:"
	@echo "  ca-manual    Build ca-manual HTML"
	@echo "  cmt-manual   Build cmt-manual HTML"
	@echo "  html         Build all manuals"
	@echo "  clean        Remove all build outputs"

$(MANUALS):
	$(SED_FIX) > $@/_static/theme.js
	$(SPHINXBUILD) -b html -d $@/_build/doctrees $@ $@/_build/html

html: $(MANUALS)

clean:
	rm -rf $(addsuffix /_build,$(MANUALS))
