package img

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	"image/png"
	_ "image/png"
	"math/big"
	"syscall/js"

	"github.com/iden3/go-iden3-crypto/constants"
	"github.com/iden3/go-iden3-crypto/poseidon"
	jsoniter "github.com/json-iterator/go"
)

const (
	xDiv = 5
	yDiv = 5
)

// Split split the input image.  and return the hash of each part
func Split(rawInput []byte) (shards []string, first []byte, err error) {
	img, _, err := image.Decode(bytes.NewReader(rawInput))
	if err != nil {
		return nil, nil, err
	}

	bound := img.Bounds()

	x1 := bound.Max.X
	y1 := bound.Max.Y
	shards = make([]string, 0)

	perX := x1 / xDiv
	perY := y1 / yDiv
	for y := 0; y < y1; y += perY {
		for x := 0; x < x1; x += perX {
			var subImg image.Image
			x2 := min(x+perX, x1-1)
			y2 := min(y+perY, y1-1)

			if rgbImg, ok := img.(*image.RGBA); ok {
				subImg = rgbImg.SubImage(image.Rect(x, y, x2, y2)).(*image.RGBA)
			} else if rgbImg, ok := img.(*image.NRGBA); ok {
				subImg = rgbImg.SubImage(image.Rect(x, y, x2, y2)).(*image.NRGBA)
			} else if rgbImg, ok := img.(*image.YCbCr); ok {
				subImg = rgbImg.SubImage(image.Rect(x, y, x2, y2)).(*image.YCbCr)
			} else if rgbImg, ok := img.(*image.RGBA64); ok {
				subImg = rgbImg.SubImage(image.Rect(x, y, x2, y2)).(*image.RGBA64)
			} else {
				return nil, nil, errors.New("Parse image format failed")
			}

			buf := new(bytes.Buffer)
			if err := png.Encode(buf, subImg); err != nil {
				return nil, nil, err
			}

			if x == 0 && y == 0 {
				first = buf.Bytes()
			}
			bigInt := new(big.Int)
			s := sha(buf.Bytes())
			bigInt.SetBytes(s)
			h, err := poseidon.Hash([]*big.Int{bigInt.Mod(bigInt, constants.Q)})
			if err != nil {
				return nil, nil, err
			}

			shards = append(shards, h.String())
		}
	}

	return shards, first, nil
}

func sha(data []byte) []byte {
	h := sha256.New()
	h.Write(data)
	return h.Sum(nil)
}

func min(a, b int) int {
	if a > b {
		return b
	}

	return a
}

// js interface
// error define
var (
	InvalidDataLength = errors.New("Invalid input data")
)

type SplitResult struct {
	Shards []string `json:"shards,omitempty"`
	First  string   `json:"first,omitempty"`
}

func SplitJs(this js.Value, inputs []js.Value) interface{} {
	input, err := base64.StdEncoding.DecodeString(inputs[0].String())
	if err != nil {
		return err
	}

	shards, first, err := Split(input)
	if err != nil {
		return err
	}

	result := SplitResult{
		Shards: shards,
		First:  base64.StdEncoding.EncodeToString(first),
	}

	b, _ := jsoniter.Marshal(result)

	return string(b)
}
