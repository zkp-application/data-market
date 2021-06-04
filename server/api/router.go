package api

import "github.com/valyala/fasthttp"

func NewHandle(filePath string) fasthttp.RequestHandler {
	dmServer := NewDmServer(filePath)

	return func(ctx *fasthttp.RequestCtx) {
		switch string(ctx.Path()) {
		case "/api/v1/proof-upload":
			dmServer.Upload(ctx)
		case "/api/v1/proof-download":
			dmServer.Download(ctx)
		default:
			ctx.Error("not found", fasthttp.StatusNotFound)
		}
	}
}
