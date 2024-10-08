package sqlite

import (
    "database/sql"
    "fmt"

    _ "github.com/mattn/go-sqlite3"
)

type Storage struct {
	db *sql.DB
}

func New(storagePath string) (*Storage, error) {
	const op = "storage.sqlite.New"

	db, err := sql.Open("sqlite3", storagePath)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	stmt, err := db.Prepare(`
	CREATE TABLE IF NOT EXISTS users(
		username TEXT PRIMARY KEY NOT NULL
    );
	CREATE INDEX IF NOT EXISTS idx_username ON users(username);
	`)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	_, err = stmt.Exec()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &Storage{db: db}, nil
}

func (s *Storage) CreateUser(username string) error {
    const op = "storage.sqlite.CreateUser"

    stmt, err := s.db.Prepare("INSERT INTO users(username) VALUES(?)")
    if err != nil {
        return fmt.Errorf("%s: %w", op, err)
    }

    _, err = stmt.Exec(username)
    if err != nil {
        return fmt.Errorf("%s: %w", op, err)
    }

    return nil
}

func (s *Storage) ReadUser(username string) error {
    const op = "storage.sqlite.ReadUser"

    stmt, err := s.db.Prepare("SELECT 1 FROM users WHERE username=?")
    if err != nil {
        return fmt.Errorf("%s: %w", op, err)
    }
    var ans int
    err = stmt.QueryRow(username).Scan(&ans)
    if err != nil || ans != 1{
        return fmt.Errorf("%s: %w", op, err)
    }

    return nil
}

