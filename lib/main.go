package main

import (
	"syscall/js"

	"github.com/data-market/lib/crypto"
	"github.com/data-market/lib/img"
)

func main() {
	js.Global().Set("split", js.FuncOf(img.SplitJs))
	js.Global().Set("hash", js.FuncOf(img.Hash))

	js.Global().Set("encrypt", js.FuncOf(crypto.AesEncrypt))
	js.Global().Set("decrypt", js.FuncOf(crypto.AesDecrypt))

	select {}
}
