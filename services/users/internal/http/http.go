package http

import (
	"log/slog"
	"net/http"

	"github.com/go-chi/render"
	"github.com/go-playground/validator/v10"
)

type PostRequest struct {
    Username string `json:"username" validate:"required"`
}

type UserCreator interface {
    CreateUser(username string) error
}

type UserReader interface {
    ReadUser(username string) error
}

func NewPostUser(log *slog.Logger, userCreator UserCreator) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log := log.With("op", "http.NewPostUser")

        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

        var req PostRequest

        err := render.DecodeJSON(r.Body, &req)
        if err != nil {
            log.Error("error decoding request", err.Error())
            render.Status(r, 400)
            render.PlainText(w, r, "error decoding request")
            return
        }

        err = validator.New().Struct(req)
        if err != nil {
            log.Error("error decoding request", err.Error())
            render.Status(r, 400)
            render.PlainText(w, r, "error decoding request")
            return
        }

        err = userCreator.CreateUser(req.Username)
        if err != nil {
            log.Error("error creating user", err.Error())
            render.Status(r, 400)
            render.PlainText(w, r, err.Error())
            return
        }

        render.PlainText(w, r, req.Username)

    }
}
func NewGetUser(log *slog.Logger, userReader UserReader) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log := log.With("op", "http.NewPostUser")

        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

        username := r.URL.Query().Get("username")
        if username == "" {
            log.Error("username is empty")
            render.Status(r, 400)
            render.PlainText(w, r, "username is empty")
            return
        }


        err := userReader.ReadUser(username)
        if err != nil {
            log.Error("error reading user", err.Error())
            render.Status(r, 400)
            render.PlainText(w, r, err.Error())
            return
        }

        render.PlainText(w, r, username)

    }
}
