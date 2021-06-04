package util

import (
	"crypto/sha256"
	"encoding/hex"

	jsoniter "github.com/json-iterator/go"
	"github.com/valyala/fasthttp"
)

var (
	strContentType     = []byte("Content-Type")
	strApplicationJSON = []byte("application/json")
)

type RespProtocol struct {
	Code int         `json:"code,omitempty"`
	Msg  string      `json:"msg,omitempty"`
	Data interface{} `json:"data,omitempty"`
}

func Resp(ctx *fasthttp.RequestCtx, err error, obj interface{}) {
	ctx.Response.Header.SetCanonical(strContentType, strApplicationJSON)

	msg := "success"
	if err != nil {
		msg = err.Error()
	}
	resp := &RespProtocol{
		Code: ErrorCode[err],
		Msg:  msg,
		Data: obj,
	}

	if err := jsoniter.NewEncoder(ctx).Encode(resp); err != nil {
		ctx.Error(err.Error(), fasthttp.StatusInternalServerError)
	}
}

// Hash sha256
func Hash(input []byte) string {
	hash := sha256.New()
	hash.Write(input)
	return hex.EncodeToString(hash.Sum(nil))
}
