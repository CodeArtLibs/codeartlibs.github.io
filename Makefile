run:
	python3 -m http.server 8888

compile:
	true

deploy:
	git checkout master
	git fetch origin master
	git rebase origin/master
	git push origin master
