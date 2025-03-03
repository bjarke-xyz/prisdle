.PHONY: build dev dockerbuild

dev:
	npm run dev

build:
	npm run build

dockerbuild:
	docker build -t bjarke.xyz/prisdle -f build.Dockerfile .
	docker create --name prisdle bjarke.xyz/prisdle
	docker cp prisdle:/app/dist/. ./dist/
	docker rm prisdle