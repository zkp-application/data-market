package util

import "errors"

// error define
var (
	InvalidFileError = errors.New("invalid input file")

	InternalServerErr = errors.New("internal server error")
)

var ErrorCode = map[error]int{
	nil:               200,
	InvalidFileError:  3000,
	InternalServerErr: 4000,
}
