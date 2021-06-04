package main

import (
	"fmt"
	"os"

	"github.com/valyala/fasthttp"
	"github.com/zkp-application/data-market/server/api"
	"github.com/zkp-application/data-market/server/config"
)

func main() {
	cfg, err := config.LoadConfig(os.Args[1])
	if err != nil {
		panic(err)
	}

	fasthttp.ListenAndServe(fmt.Sprint(":", cfg.Port), api.NewHandle(cfg.FilePath))
	select {}
}
