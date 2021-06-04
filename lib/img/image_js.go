package img

import (
	"encoding/base64"
	"encoding/hex"
	"errors"
	"syscall/js"
)

// error define
var (
	InvalidDataLength = errors.New("Invalid input data")
)

func SplitImage(this js.Value, inputs []js.Value) interface{} {
	input, err := base64.StdEncoding.DecodeString(inputs[0].String())
	if err != nil {
		return err
	}

	shards, first, err := Split(input)
	if err != nil {
		return err
	}

	shards = append(shards, hex.EncodeToString(first))

	return shards
}
