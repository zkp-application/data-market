package img

import (
	"fmt"
	"io/ioutil"
	"os"
	"testing"
)

func TestSplitImage(t *testing.T) {
	imgBytes, err := ioutil.ReadFile("../testdata/water.jpg")
	if err != nil {
		panic(err)
	}

	shards, first, err := Split(imgBytes)
	if err != nil {
		panic(err)
	}

	file, err := os.Create("./test.png")
	if err != nil {
		panic(err)
	}

	defer file.Close()

	file.Write(first)
	fmt.Println(len(shards))
	fmt.Println(shards)
}
