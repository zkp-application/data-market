package api

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"mime/multipart"

	"github.com/zkp-application/data-market/server/util"

	"github.com/valyala/fasthttp"
)

// DmServer data-market server
type DmServer struct {
	FilePath string
}

const (
	uploadFileKey = "proof_file_zip"

	downloadFileKey = "proof_file_hash"
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

	if err := d.doUpload(fileHeader); err != nil {
		util.Resp(ctx, util.InternalServerErr, nil)
		return
	}

	util.Resp(ctx, nil, nil)
}

func (d *DmServer) doUpload(fileHeader *multipart.FileHeader) error {
	file, err := fileHeader.Open()
	if err != nil {
		return err
	}

	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(file)
	if err != nil {
		return err
	}

	fileHash := util.Hash(buf.Bytes())
	files, err := ioutil.ReadDir(d.FilePath)
	if err != nil {
		return err
	}

	for _, file := range files {
		if file.Name() == fileHash {
			return nil
		}
	}

	return fasthttp.SaveMultipartFile(fileHeader, d.colcFilePath(fileHash))
}

func (d *DmServer) colcFilePath(fileHash string) string {
	return fmt.Sprint(d.FilePath, "/", fileHash)
}

func (d *DmServer) Download(ctx *fasthttp.RequestCtx) {
	ctx.SendFile(d.colcFilePath(string(ctx.QueryArgs().Peek(downloadFileKey))))
}
