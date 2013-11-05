define(["require", "exports", 'jquery'], function(require, exports, __$__) {
    var $ = __$__;

    var FileChunkUploader = (function () {
        function FileChunkUploader(file, uriProvider, maxBlockSize) {
            if (typeof maxBlockSize === "undefined") { maxBlockSize = 256 * 1024; }
            var _this = this;
            this._reader = new FileReader();
            this.currentFilePointer = 0;
            this.bytesUploaded = 0;
            this._file = file;
            this.maxBlockSize = maxBlockSize;
            this.totalBytesRemaining = this._file.size;
            this.defered = $.Deferred();

            this._reader.onloadend = function (evt) {
                if (_this._reader.readyState === FileReader.prototype.DONE) {
                    var requestData = new Uint8Array(_this._reader.result);

                    $.ajax({
                        url: uriProvider(_this),
                        type: 'PUT',
                        data: requestData,
                        processData: false,
                        beforeSend: function (xhr) {
                        },
                        success: function (data, status) {
                            _this.bytesUploaded += requestData.length;
                            var percentComplete = (((_this.bytesUploaded) / (_this._file.size)) * 100).toFixed(2);
                            _this.progress(percentComplete);
                            _this.uploadFileInChunks();
                        },
                        error: _this.defered.reject
                    });
                }
                ;
            };
        }
        FileChunkUploader.prototype.uploadFileInChunks = function () {
            if (this.totalBytesRemaining > 0) {
                var fileContent = this._file.slice(this.currentFilePointer, this.currentFilePointer + this.maxBlockSize);
                this._reader.readAsArrayBuffer(fileContent);
                this.currentFilePointer += this.maxBlockSize;
                this.totalBytesRemaining -= this.maxBlockSize;
                if (this.totalBytesRemaining < this.maxBlockSize) {
                    this.maxBlockSize = this.totalBytesRemaining;
                }
            } else {
                this.defered.resolve();
            }
        };

        FileChunkUploader.prototype.progress = function (s) {
            this.defered.notify(s);
        };

        FileChunkUploader.prototype.start = function () {
            this.uploadFileInChunks();
            return this.defered.promise();
        };
        return FileChunkUploader;
    })();

    
    return FileChunkUploader;
});
