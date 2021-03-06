// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package graphgrpc

import (
	"database/sql"
	"github.com/facebookincubator/symphony/cloud/log"
	"google.golang.org/grpc"
)

// Injectors from wire.go:

func NewServer(cfg Config) (*grpc.Server, func(), error) {
	db := cfg.DB
	logger := cfg.Logger
	server, cleanup, err := newServer(db, logger)
	if err != nil {
		return nil, nil, err
	}
	return server, func() {
		cleanup()
	}, nil
}

// wire.go:

// Config defines the grpc server config.
type Config struct {
	DB     *sql.DB
	Logger log.Logger
}
