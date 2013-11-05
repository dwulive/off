define(["require", "exports", 'knockout'], function(require, exports, __ko__) {
    var ko = __ko__;

    var boundElements = new Array();
    var test = null;
    ko.bindingHandlers["html5FileDropArea"] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var fileDropper = (ko).unwrap(valueAccessor());
            fileDropper.binder(element);
            boundElements.push(element);

            console.log(boundElements);
            console.log(element);
            test = element;
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            console.log('sda');
        }
    };

    function contains(arr, element) {
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            if (element === arr[i])
                return true;
        }
        return false;
    }

    function dropHandler(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        var srcElement = e.srcElement ? e.srcElement : e.target;

        if (e.type == "dragenter") {
        }

        return false;
    }
    var accept = false;

    var drag_over = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        event.dataTransfer.dropEffect = accept ? 'copy' : 'none';
    };

    window.addEventListener('dragover', drag_over, false);

    var FileDropper = (function () {
        function FileDropper(handleFile) {
            this.handleFile = handleFile;
        }
        FileDropper.prototype.binder = function (droparea) {
            var _this = this;
            if (FileReader) {
                var div = document.createElement('div');
                div.style.display = 'none';
                div.style.position = 'absolute';
                div.style.top = '0';
                div.style.bottom = '0';
                div.style.left = '0';
                div.style.right = '0';
                div.classList.add('dropzone');
                droparea.appendChild(div);
                droparea.style.position = 'relative';

                var status = document.getElementById('status');
                var list = document.getElementById('list');

                droparea.addEventListener('dragover', function (e) {
                    div.style.display = 'block';
                    accept = true;
                }, false);

                div.addEventListener('dragleave', function (e) {
                    div.style.display = 'none';
                    accept = false;
                });

                div.addEventListener('drop', function (e) {
                    e = e || window.event;
                    if (e.preventDefault) {
                        e.preventDefault();
                    }

                    div.style.display = 'none';

                    var dt = e.dataTransfer;
                    var files = dt.files;
                    for (var i = 0; i < files.length; i++) {
                        _this.handleFile(files[i]);
                    }

                    return false;
                });
            } else {
                document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
            }
        };
        return FileDropper;
    })();
    
    return FileDropper;
});
