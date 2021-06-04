package img

import (
	"encoding/base64"
	"os"
	"testing"
)

func TestSplitImage(t *testing.T) {
	input := `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`
	b, _ := base64.StdEncoding.DecodeString(input)

	shards, first, err := Split(b)
	if err != nil {
		panic(err)
	}

	file, err := os.Create("./test.png")
	if err != nil {
		panic(err)
	}

	defer file.Close()

	file.Write(first)
}
