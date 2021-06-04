package config

import (
	"io/ioutil"

	jsoniter "github.com/json-iterator/go"
)

// Cfg is config template
type Cfg struct {
	FilePath string `json:"file_path"`
	Port     int    `json:"port"`
}

// LoadConfig load config from given file
func LoadConfig(path string) (*Cfg, error) {
	file, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	cfg := new(Cfg)

	if err := jsoniter.Unmarshal(file, cfg); err != nil {
		return nil, err
	}

	return cfg, nil
}
