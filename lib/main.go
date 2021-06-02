package main

import (
	"syscall/js"

	"github.com/data-market/lib/crypto"
	"github.com/data-market/lib/img"
)

func main() {
	js.Global().Set("splitImage", js.FuncOf(img.SplitImage))

	js.Global().Set("encrypt", js.FuncOf(crypto.AesEncrypt))
	js.Global().Set("decrypt", js.FuncOf(crypto.AesDecrypt))

	select {}
}
