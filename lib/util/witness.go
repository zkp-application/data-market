package util

import (
	"encoding/json"
	"fmt"
	"math/big"
	"reflect"

	witnessLib "github.com/iden3/go-circom-witnesscalc"
	"github.com/iden3/go-wasm3"
)

// // witness params
// const (
// 	prime = "21888242871839275222246405745257275088548364400416034343698204186575808495617"
// 	nVars = 4
// 	r     = "115792089237316195423570985008687907853269984665640564039457584007913129639936"
// 	rInv  = "9915499612839321149637521777990102151350674507940716049588462388200839649614"
// )

func WitnessCalc(wasmBytes []byte, inputsBytes []byte) ([]*big.Int, error) {
	runtime := wasm3.NewRuntime(&wasm3.Config{
		Environment: wasm3.NewEnvironment(),
		StackSize:   64 * 1024,
	})

	module, err := runtime.ParseModule(wasmBytes)
	if err != nil {
		return nil, err
	}

	if module, err = runtime.LoadModule(module); err != nil {
		return nil, err
	}

	inputs, err := ParseInputs(inputsBytes)
	if err != nil {
		return nil, err
	}

	witnessCalculator, err := witnessLib.NewWitnessCalculator(runtime, module)
	if err != nil {
		return nil, err
	}

	return witnessCalculator.CalculateWitness(inputs, false)
}

func WitnessBinCalc(wasmBytes []byte, inputsBytes []byte) ([]byte, error) {
	runtime := wasm3.NewRuntime(&wasm3.Config{
		Environment: wasm3.NewEnvironment(),
		StackSize:   64 * 1024,
	})

	module, err := runtime.ParseModule(wasmBytes)
	if err != nil {
		return nil, err
	}

	if module, err = runtime.LoadModule(module); err != nil {
		return nil, err
	}

	inputs, err := ParseInputs(inputsBytes)
	if err != nil {
		return nil, err
	}

	witnessCalculator, err := witnessLib.NewWitnessCalculator(runtime, module)
	if err != nil {
		return nil, err
	}

	return witnessCalculator.CalculateBinWitness(inputs, false)
}

func ParseInputs(inputsJSON []byte) (map[string]interface{}, error) {
	inputsRAW := make(map[string]interface{})
	if err := json.Unmarshal(inputsJSON, &inputsRAW); err != nil {
		return nil, err
	}
	inputs := make(map[string]interface{})
	for inputName, inputValue := range inputsRAW {
		v, err := parseInput(inputValue)
		if err != nil {
			return nil, err
		}
		inputs[inputName] = v
	}
	return inputs, nil
}

// parseInput is a recurisve helper function for ParseInputs
func parseInput(v interface{}) (interface{}, error) {
	rv := reflect.ValueOf(v)
	switch rv.Kind() {
	case reflect.String:
		n, ok := new(big.Int).SetString(v.(string), 0)
		if !ok {
			return nil, fmt.Errorf("Error parsing input %v", v)
		}
		return n, nil
	case reflect.Float64:
		return new(big.Int).SetInt64(int64(v.(float64))), nil
	case reflect.Slice:
		res := make([]interface{}, rv.Len())
		for i := 0; i < rv.Len(); i++ {
			var err error
			if res[i], err = parseInput(rv.Index(i).Interface()); err != nil {
				return nil, fmt.Errorf("Error parsing input %v: %w", v, err)
			}
		}
		return res, nil
	default:
		return nil, fmt.Errorf("Unexpected type for input %v: %T", v, v)
	}
}
