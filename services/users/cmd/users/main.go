package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/justcgh9/turbo-doodle/services/users/internal/config"
	mhttp "github.com/justcgh9/turbo-doodle/services/users/internal/http"
	"github.com/justcgh9/turbo-doodle/services/users/internal/storage/sqlite"
)

func main() {
    cfg := config.MustLoad()

    log := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}))

    log.Info("users service started")

    storage, err := sqlite.New(cfg.StoragePath)
    if err != nil {
        log.Error("failed to initialize storage", err.Error())
    }

    log.Info("initialized database connection")

    router := chi.NewRouter()

    router.Route("/users", func(r chi.Router) {

        r.Get("/", mhttp.NewGetUser(log, storage))
        r.Post("/", mhttp.NewPostUser(log, storage))
        r.Options("/", func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
            w.Header().Set("Access-Control-Allow-Methods", "POST, GET")
            w.Header().Set("Access-Control-Allow-Headers", "Content-type")
            w.WriteHeader(http.StatusOK)
        })

    })

    log.Info("starting server", slog.String("address", cfg.Address))

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	srv := &http.Server{
		Addr:         cfg.Address,
		Handler:      router,
		ReadTimeout:  cfg.HTTPServer.Timeout,
		WriteTimeout: cfg.HTTPServer.Timeout,
		IdleTimeout:  cfg.HTTPServer.IdleTimeout,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Error("failed to start server")
		}
	}()

	log.Info("server started")

	<-done
	log.Info("stopping server")

	// TODO: move timeout to config
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Error("failed to stop server", err.Error())

		return
	}

	// TODO: close storage

	log.Info("server stopped")
}
