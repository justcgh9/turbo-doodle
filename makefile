init-db:
	sqlite3 storage/database.db < storage/init.sql

recreate-db:
	rm storage/database.db
	touch storage/database.db

create-db:
	touch storage/database.db

run-likes:
	cd services/likes && go run cmd/server.go