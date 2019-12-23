VERSION := "0.1.0"

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

get-deps: ## Runs npm install
	npm install

docker-build-no-deps: ## Build a docker image of the project.
	docker build -t ntopus/kitty-mock:${VERSION} .

docker-push: ## Push project docker image on our docker image repository
	docker tag ntopus/kitty-mock:${VERSION} ntopus/kitty-mock:latest
	docker tag ntopus/kitty-mock:${VERSION} ntopus/kitty-mock:${VERSION}
	#docker push internal-registry.ntopus.com.br/internal/${APPLICATION_NAME}:${VERSION}
	#docker push internal-registry.ntopus.com.br/internal/${APPLICATION_NAME}:latest
	docker push ntopus/kitty-mock:${VERSION}
	docker push ntopus/kitty-mock:latest

release: docker-build-no-deps docker-push

run-unit-test: ## Run project units tests.
	npm run test:unit

run-functional-test: ## Run project functional tests.
	npm run test:functional