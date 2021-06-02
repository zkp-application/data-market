package img

import (
	"encoding/hex"
	"errors"
	"syscall/js"
)

// error define
var (
	InvalidDataLength = errors.New("Invalid input data")
)

func SplitImage(this js.Value, inputs []js.Value) interface{} {
	var data []byte
	length := js.CopyBytesToGo(data, inputs[0])
	if length == 0 {
		return InvalidDataLength
	}

	shards, first, err := Split(data)
	if err != nil {
		return err
	}

	shards = append(shards, hex.EncodeToString(first))

	return shards
}
