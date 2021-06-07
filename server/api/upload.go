package api

import (
	"bytes"
	"crypto/sha256"
	"fmt"
	"io/ioutil"
	"math/big"
	"mime/multipart"

	"github.com/iden3/go-iden3-crypto/constants"
	"github.com/iden3/go-iden3-crypto/poseidon"
	"github.com/zkp-application/data-market/server/util"

	"github.com/valyala/fasthttp"
)

// DmServer data-market server
type DmServer struct {
	FilePath string
}

const (
	uploadFileKey     = "proof_file_zip"
	uploadPartFileKey = "part_file"
)

func NewDmServer(filePath string) *DmServer {
	return &DmServer{
		FilePath: filePath,
	}
}

// Upload recv user upload file. and save to disk
func (d *DmServer) Upload(ctx *fasthttp.RequestCtx) {
	fileHeader, err := ctx.FormFile(uploadFileKey)
	if err != nil {
		util.Resp(ctx, util.InvalidFileError, nil)
		return
	}

	fileHeader.Filename = uploadFileKey
	partFileHeader, err := ctx.FormFile(uploadPartFileKey)
	if err != nil {
		util.Resp(ctx, util.InvalidFileError, nil)
		return
	}

	partFileHeader.Filename = uploadPartFileKey
	hash, err := d.doUpload(fileHeader, partFileHeader)
	if err != nil {
		util.Resp(ctx, util.InternalServerErr, nil)
		return
	}

	util.Resp(ctx, nil, struct {
		Hash string `json:"hash"`
	}{Hash: hash})
}

func (d *DmServer) doUpload(fileHeaders ...*multipart.FileHeader) (string, error) {
	var keyHash string
	for _, fileHeader := range fileHeaders {
		file, err := fileHeader.Open()
		if err != nil {
			return "", err
		}

		buf := new(bytes.Buffer)
		_, err = buf.ReadFrom(file)
		if err != nil {
			return "", err
		}

		fileHash := util.Hash(buf.Bytes())
		if fileHeader.Filename == uploadFileKey {
			keyHash = fileHash
		}

		files, err := ioutil.ReadDir(d.FilePath)
		if err != nil {
			return "", err
		}

		for _, file := range files {
			if file.Name() == fileHash {
				return "", nil
			}
		}

		if err := fasthttp.SaveMultipartFile(fileHeader, d.colcFilePath(keyHash+"-"+fileHeader.Filename)); err != nil {
			return "", err
		}
	}

	return keyHash, nil
}

func (d *DmServer) colcFilePath(fileHash string) string {
	return fmt.Sprint(d.FilePath, "/", fileHash)
}

func (d *DmServer) Download(ctx *fasthttp.RequestCtx) {
	keyType := ctx.QueryArgs().Peek("file_type")
	fileHash := ctx.QueryArgs().Peek("file_hash")

	ctx.SendFile(d.colcFilePath(string(fileHash) + "-" + string(keyType)))
}

func (d *DmServer) QueryFileHash(ctx *fasthttp.RequestCtx) {
	fileHash := ctx.QueryArgs().Peek("file_hash")
	bytes, err := ioutil.ReadFile(d.colcFilePath(string(fileHash) + "-" + uploadPartFileKey))
	if err != nil {
		util.Resp(ctx, util.InvalidFileError, nil)
		return
	}

	h := sha256.New()
	h.Write(bytes)
	s := h.Sum(nil)
	bigInt := new(big.Int)
	bigInt.SetBytes(s)

	pHash, err := poseidon.Hash([]*big.Int{bigInt.Mod(bigInt, constants.Q)})
	if err != nil {
		util.Resp(ctx, err, nil)
		return
	}
	util.Resp(ctx, nil, struct {
		Hash string `json:"hash"`
	}{
		Hash: pHash.String(),
	})
}
