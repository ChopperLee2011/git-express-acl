test: node_modules
	@node_modules/.bin/mocha \
		--compilers js:mocha-traceur \
		--reporter spec \
		--require should \
		test/test.define.js

node_modules: package.json
	@npm install -qs

clean:
	rm -rf ./node_modules

.PHONY: test