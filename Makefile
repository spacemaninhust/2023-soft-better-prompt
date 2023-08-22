# System python interpreter. Used only to create virtual environment.
VENV = venv

# Set default bin.
ifeq ($(OS), Windows_NT)
	BIN=$(VENV)/Scripts
else
	BIN=$(VENV)/bin
endif

# Set default browser.
ifeq ($(OS), Windows_NT)
	BROWSER=start
else ifeq ($(shell uname), Darwin)
	BROWSER=open
else
	BROWSER=xdg-open
endif

PYTHON = $(BIN)/python3
PIP = $(BIN)/pip


.DEFAULT: help
help:
	@echo build
	@echo - Build frontend and backend.
	@echo run
	@echo - Run project with venv after build.
	@echo quick-run
	@echo - Run project without build.
	@echo clean
	@echo - Clean venv and cache files.
	@echo help
	@echo - Show prompt messages.

.PHONY: build
build:
	rm -rf src/templates
	pip install -r requirements
	flask initdb
	cd fe && npm i && npm run build


run: build
	$(BROWSER) http://127.0.0.1:5000
	flask run

.PHONY: quick-run
quick-run:
	flask run

.PHONY: image
image:
	docker build -t baidu_api .
	docker run --name baidu_api -p 5000:5000 baidu_api

.PHONY: requirements
requirements:
	pipreqs ./ --encoding=utf8 --mode compat --force

.PHONY: clean
clean:
	-rm -rf src/templates
	-rm -rf *__pycache__
	-rm -rf $(VENV)
	-rm -f requirements
