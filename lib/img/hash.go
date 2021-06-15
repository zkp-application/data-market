package img

import (
	"encoding/base64"
	"math/big"
	"syscall/js"

	"github.com/iden3/go-iden3-crypto/constants"
	"github.com/iden3/go-iden3-crypto/poseidon"
)

func Hash(this js.Value, inputs []js.Value) interface{} {
	input, err := base64.StdEncoding.DecodeString(inputs[0].String())
	if err != nil {
		return err
	}

	bigInt := new(big.Int)
	s := sha(input)
	bigInt.SetBytes(s)
	h, err := poseidon.Hash([]*big.Int{bigInt.Mod(bigInt, constants.Q)})
	if err != nil {
		return err
	}

	return h.String()
}
