package main

import (
	"database/sql"
	"encoding/json"
	"log/slog"
	"net/http"

	_ "github.com/ncruces/go-sqlite3/driver"
	_ "github.com/ncruces/go-sqlite3/embed"
)

type LikeReq struct {
	Username string `json:"username"`
	PostId   int    `json:"postId"`
}

type LikeRes struct {
	Username string `json:"username"`
	PostId   int    `json:"postId"`
}

func ErrorResponse(w http.ResponseWriter, code int, msg string) {
	w.WriteHeader(code)
	w.Write([]byte(msg))
}

func main() {
	db, err := sql.Open("sqlite3", "../../storage/database.db")
	if err != nil {
		slog.Error("main:", "error", err)
		return
	}

	err = db.Ping()
	if err != nil {
		slog.Error("main:", "error", err)
		return
	}

	http.HandleFunc("POST /likes", func(w http.ResponseWriter, r *http.Request) {
		var req LikeReq
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			ErrorResponse(w, http.StatusBadRequest, "invalid body")
			return
		}

		_, err = db.Exec("INSERT INTO like (username, post_id) VALUES ($1, $2)", req.Username, req.PostId)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "failed create like")
			return
		}

		w.WriteHeader(http.StatusNoContent)
	})

	http.HandleFunc("GET /likes", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT username, post_id FROM like")
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "failed get likes")
			return
		}

		likes := make([]LikeRes, 0, 10)
		for rows.Next() {
			var like LikeRes
			err = rows.Scan(&like.Username, &like.PostId)
			if err != nil {
				ErrorResponse(w, http.StatusInternalServerError, "failed get likes")
				return
			}
			likes = append(likes, like)
		}

		res, err := json.Marshal(likes)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "failed get likes")
			return
		}
		w.Write(res)
	})

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		slog.Error("main:", "error", err)
		return
	}
}
