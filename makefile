DB_PATH = ./storage/db.sql
SQL_FILE = ./storage/init-db.sql

.PHONY: init-db
init-db: $(DB_PATH)

$(DB_PATH): $(SQL_FILE)
	@mkdir -p $(dir $(DB_PATH))
	@sqlite3 $(DB_PATH) < $(SQL_FILE)
	@echo "Database initialized at $(DB_PATH)"

run-users: 
	cd services/users && go run ./cmd/users

run-likes:
	cd services/likes && go run cmd/server.go

run-nginx:
	docker run --name nginx --rm \
	-p 80:80 \
	-v "$(PWD)"/nginx.conf:/etc/nginx/nginx.conf \
	--add-host=host.docker.internal:host-gateway \
	nginx
