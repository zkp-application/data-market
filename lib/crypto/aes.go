package crypto

import (
	"errors"
	"syscall/js"

	"github.com/wumansgy/goEncrypt"
)

func AesEncrypt(this js.Value, inputs []js.Value) interface{} {
	data, privateKey, err := getInputData(inputs)
	if err != nil {
		return err
	}

	cryptText, err := goEncrypt.AesCbcEncrypt(data, privateKey)
	if err != nil {
		return err
	}

	return cryptText
}

func AesDecrypt(this js.Value, inputs []js.Value) interface{} {
	data, privateKey, err := getInputData(inputs)
	if err != nil {
		return err
	}

	plainData, err := goEncrypt.AesCbcDecrypt(data, privateKey)
	if err != nil {
		return err
	}

	return plainData
}

func getInputData(inputs []js.Value) (data, privateKey []byte, err error) {
	length := js.CopyBytesToGo(data, inputs[0])
	if length == 0 {
		return nil, nil, errors.New("Invalid data length")
	}

	length = js.CopyBytesToGo(privateKey, inputs[1])
	if length != 32 && length != 24 && length != 16 {
		return nil, nil, errors.New("Invalid aes private key length")
	}

	return data, privateKey, nil
}
