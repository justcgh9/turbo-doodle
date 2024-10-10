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
	MessageId   int    `json:"messageId"`
}

type LikeRes struct {
	Username string `json:"username"`
	MessageId   int    `json:"messageId"`
}

func ErrorResponse(w http.ResponseWriter, code int, msg string) {
	w.WriteHeader(code)
	w.Write([]byte(msg))
}

func main() {
	db, err := sql.Open("sqlite3", "../../storage/db.sql")
	if err != nil {
		slog.Error("main:", "error", err)
		return
	}

	err = db.Ping()
	if err != nil {
		slog.Error("main:", "error", err)
		return
	}

	http.HandleFunc("OPTIONS /likes", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	})

	http.HandleFunc("POST /likes", func(w http.ResponseWriter, r *http.Request) {
		var req LikeReq
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			slog.Error("main:", "error", err)
			ErrorResponse(w, http.StatusBadRequest, "invalid body")
			return
		}
		_, err = db.Exec("INSERT INTO likes (username, message_id) VALUES ($1, $2)", req.Username, req.MessageId)
		if err != nil {
			slog.Error("main:", "error", err)
			ErrorResponse(w, http.StatusInternalServerError, "failed create like")
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusNoContent)
	})

	http.HandleFunc("GET /likes", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT username, message_id FROM likes")
		if err != nil {
			slog.Error("main:", "error", err)
			ErrorResponse(w, http.StatusInternalServerError, "failed get likes")
			return
		}

		likes := make([]LikeRes, 0, 10)
		for rows.Next() {
			var like LikeRes
			err = rows.Scan(&like.Username, &like.MessageId)
			if err != nil {
				slog.Error("main:", "error", err)
				ErrorResponse(w, http.StatusInternalServerError, "failed get likes")
				return
			}
			likes = append(likes, like)
		}

		res, err := json.Marshal(likes)
		if err != nil {
			slog.Error("main:", "error", err)
			ErrorResponse(w, http.StatusInternalServerError, "failed get likes")
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(res)
	})

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		slog.Error("main:", "error", err)
		return
	}
}
