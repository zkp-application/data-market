package img

import (
	"bytes"
	"crypto/sha256"
	"errors"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	"image/png"
	_ "image/png"
	"math/big"

	"github.com/iden3/go-iden3-crypto/constants"
	"github.com/iden3/go-iden3-crypto/poseidon"
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

			fmt.Println(x, x2, y, y2)
			if rgbImg, ok := img.(*image.RGBA); ok {
				subImg = rgbImg.SubImage(image.Rect(x, y, x2, y2)).(*image.RGBA)
			} else if rgbImg, ok := img.(*image.NRGBA); ok {
				subImg = rgbImg.SubImage(image.Rect(x, y, x2, y2)).(*image.NRGBA)
			} else if rgbImg, ok := img.(*image.YCbCr); ok {
				subImg = rgbImg.SubImage(image.Rect(x, y, x2, y2)).(*image.YCbCr)
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
				panic(err)
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
