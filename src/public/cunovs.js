/* global cordova requestFileSystem LocalFileSystem window */

var cunovs = {
  cnVersion: '1.0.5',
  cnCodeVersion: '1.0.0',
  cnVersionInfo: {
    title: '当前版本过低',
    content: '为保证正常使用，请先升级应用'
  },
  cnUpholdMsg: '',
  cn_use_debug_mode: false,
  cnGlobalIndex: 0,
  cnDownLoadProgress: 0,
  cnhtmlSize: 0,
  //iOS获取屏幕可用高度 - iOS修改
  //cnhtmlHeight: screen.availHeight,
  cnhtmlHeight: document.documentElement.clientHeight,
  cnApiServiceUrl: 'http://172.16.140.39:8080',   //app地址
  // cnApiServiceUrl: 'http://elearningapp.bjou.edu.cn:8080',
  cnMoodleServeUrl: 'http://elearning.bjou.edu.cn',
  cnManagerServeUrl: 'http://elearningapp.bjou.edu.cn:9200',
  cnDownloadFileTag: 'tag_cunovs_download_files',
  // portalServiceUrl: 'http://bjou.preview.klxedu.com',  //门户服务测试地址
  portalServiceUrl: 'http://stuportal.bjou.edu.cn',  // 门户服务正式环境
  // portalSsoServiceUrl: 'https://bjousso.preview.klxedu.com',  // 门户验证
  portalSsoServiceUrl: 'https://sso.bjou.edu.cn',
  cnDeviceType: function (onlyPlayer) {

    /*android 设备时 - android修改*/
    // return 'android';

    /*iOS 设备时 - iOS修改*/
    //onlyPlayer = onlyPlayer || '';
    //return onlyPlayer === true && cnLessiOS11() ? '' : 'iOS';

    /*页面 默认返回*/
    return '';
  },
  cnGetServiceUrl: function (type, suffixPath) {
    type = type || '' , suffixPath = suffixPath || '';
    switch (type) {
      case 'moodle':
        return cnMoodleServeUrl + suffixPath;
      case 'manager':
        return cnManagerServeUrl + suffixPath;
      case 'help':
        return cnManagerServeUrl.replace(':9200', ':9000') + suffixPath;
      default:
        return '';
    }
  },
  cnGetBodyStyleByProperty: function (property, willNumber) {
    var value = 0;
    if (property && (value = window.getComputedStyle(document.body, null)
      .getPropertyValue(property))) {
      if (willNumber === true) {
        var numberGroup = /(\d+)(?:px)*$/.exec(value);
        return numberGroup && numberGroup.length ? numberGroup[1] : 0;
      }
      return value;
    }
    return value;
  },
  cnAppInitPaddingTop: 0,
  cnGetInitPaddingTop: function () {
    return cnGetBodyStyleByProperty('padding-top', true);
  },
  cnLessiOS11: function () {
    //iOS版本小于11
    var v = '';
    if (cnIsiOS() && (v = cnDeviceVersion())) {
      v = v.split('.');
      return v.length && !isNaN(v[0] * 1) && v[0] <= 10;
    }
    return false;
  },
  cnAppInit: function () {
    if (cnIsiOS()) {
      var bodyPaddingBottom = cnGetBodyStyleByProperty('padding-bottom', true),
        bodyPaddingTop = cnGetInitPaddingTop();
      if (bodyPaddingBottom != 0 || bodyPaddingTop != 0) {
        cnhtmlHeight = document.documentElement.clientHeight - bodyPaddingBottom - bodyPaddingTop;
      }
    }
  },
  cnMiniType: {
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.wps': 'application/msword',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.et': 'application/vnd.ms-excel',
    '.ogg': 'audio/ogg',
    '.pdf': 'application/pdf',
    '.caj': 'application/pdf',
    '.pps': 'application/vnd.ms-powerpoint',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.dps': 'application/vnd.ms-powerpoint',
    '.flv': 'application/octet-stream',
    '.swf': 'application/x-shockwave-flash'
  },
  cnId: function () {
    return cnGlobalIndex++;
  },
  cnIsArray: function (o) {
    if (cnIsDefined(o)) {
      return cnIsDefined(Array.isArray) ? Array.isArray(o) : Object.prototype.toString.call(o) == '[object Array]';
    }
    return false;
  },
  cnIsDefined: function (o) {
    return (typeof (o) != 'undefined' && o != 'undefined' && o != null);
  },
  cnIsDevice: function () {
    return typeof (device) != 'undefined';
  },
  cnIsAndroid: function () {
    return cnIsDevice() && device.platform == 'Android';
  },
  cnIsiOS: function () {
    //iOS cordova加载在app init之后 需返回true标示  - iOS修改
    //return true;
    return cnIsDevice() && device.platform == 'iOS';
  },
  cnUpdate: function (url) {
    //window.location.href = url;
    console.log('cnUpdate - url : ' + url);
    window.open(url, '_system');
  },
  cnDeviceInfo: function () {
    try {
      return cnIsDevice() ? device : {};
    } catch (e) {
    }
    return {};
  },
  cnDeviceVersion: function () {
    return device && device.version || '';
  },
  cnSetStatusBarStyle: function (router) {
    if (typeof (StatusBar) != 'undefined') {
      if (cnIsAndroid()) {
        router = router || '/';
        switch (router) {
          case '/mine': {
            StatusBar.backgroundColorByHexString('#22609c');
            break;
          }
          case '/closed': {
            StatusBar.backgroundColorByHexString('#22609c');
            break;
          }
          default: {
            StatusBar.backgroundColorByHexString('#22609c');
          }
        }
        StatusBar.styleLightContent();
      } else {
        router = router || '/';
        switch (router) {
          case '/':
          case '/dashboard': {
            StatusBar.backgroundColorByHexString('#22609c');
            break;
          }
          default: {
            StatusBar.backgroundColorByHexString('#22609c');
          }
        }
        StatusBar.styleLightContent();
      }
    }
  },
  cnPlayAudio: function (id, played) {
    var el;
    if (cnIsDefined(id) && (el = document.getElementById(id))) {
      played === true ? el.pause() : el.play();
    }
  },
  cnPlayVideo: function (src, cb, options) {
    cb = cb || cnPrn;
    if (!src) {
      cb({ success: false, message: '播放文件的地址不存在。' });
      return;
    }
    if (!cnHasPlugin() || !window.plugins.streamingMedia) {
      cb({ success: false, message: '播放器加载失败，不能播放。' });
      return;
    }
    options = options || {
      successCallback: function () {
        cb({ success: true, message: '' });
      },
      errorCallback: function (errMsg) {
        cb({ success: false, message: errMsg });
      },
      orientation: 'landscape',
      shouldAutoClose: true,  // true(default)/false
      controls: true // true(default)/false. Used to hide controls on fullscreen
    };
    window.plugins.streamingMedia.playVideo(src, options);
  },
  cnPrn: function (ars) {
    console.log(ars || arguments);
  },
  cnTakePhoto: function (cb, type) {
    var onSuccess = function (cb, dataurl) {
      cb(cnCreateBlob(dataurl), dataurl);
    };
    var onFail = function () {
    };
    navigator.camera.getPicture(onSuccess.bind(null, cb), onFail, {
      //allowEdit: true //运行编辑图片
      destinationType: Camera.DestinationType.DATA_URL,
      PictureSourceType: type
    });
  },
  cnCreateBlob: function (data, name, type) {
    var arr = data.split(',')
      ,
      bstr = atob(arr.length > 1 ? arr[1] : data)
      ,
      n = bstr.length
      ,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = new Blob([u8arr], {
      type: type || 'image/jpeg'
    });
    blob.name = name || 'img_' + (cnGlobalIndex++) + '.jpg';
    return blob;
  },
  cnNeedPositions: function (key, url) {
    if (true) {
      return;
    }
    var cbError = function (err) {
        if (err.code == 3) {
          cbSuccess();
        } else {
          cnShowToast('无法定位您的位置，请开启定位权限并保持网络畅通。', 3000);
        }
      }
      ,
      cbSuccess = function () {
        cordova.BaiduLocation.startPositions(cnPrn, cbError, {
          submitUserToken: key,
          submitAddr: url
        });
      };
    if (cnIsDevice()) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError, {
        timeout: 5000
      });
    }
  },
  cnGetCurrentPosition: function (onSuccess, onError, timeout) {
    var cbSuccess = function () {
      onSuccess = onSuccess || cnPrn;
      cordova.BaiduLocation.getCurrentPosition(onSuccess, onError);
    };
    cbError = function (err) {
      //console.log(err)
      onError = onError || cnPrn;
      if (err.code == 3) {
        cbSuccess();
      } else {
        onError();
      }
    };
    timeout = timeout || 500;
    if (cnIsDevice()) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError, {
        timeout: timeout
      });
    } else {
      onSuccess();
    }
  },
  cnReadFile: function (file, params, onSuccess, onError) {
    onSuccess = onSuccess || cnPrn;
    onError = onError || cnPrn;
    params = params || {};
    if (!file) {
      onError({
        message: '文件不存在。'
      });
    } else {
      var reader = new FileReader();
      reader.onload = function (e) {
        onSuccess(cnCreateBlob(e.target.result, params.name, params.type), params);
      };
      reader.onerror = onError;
      reader.readAsDataURL(file);
    }
  },
  cnWillCallBack: function (data) {
    var cnEvent = new Event('cnevent', { 'bubbles': true, 'cancelable': false });
    cnEvent.cneventParam = data;
    window.dispatchEvent(cnEvent);
  },
  cnStartRecord: function (id, onSuccess, onError) {
    var recordMedia = '';
    if (cnIsAndroid() && cnIsDefined(Media)) {
      id = id || 'Media';
      onSuccess = onSuccess || cnPrn;
      onError = onError || cnPrn;
      var mediaName = id + '_' + cnId() + '.mp3'
        ,
        mediaOnSuccess = function () {
          var media = {
            name: mediaName,
            timers: recordMedia.timers || 5
          };
          resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
            dirEntry.getFile(media.name, {}, function (file) {
              file.file(function (f) {
                cnReadFile(f, {
                  name: media.name,
                  timers: media.timers,
                  type: f.type,
                  nativeURL: file.nativeURL
                }, onSuccess, onError);
                /*                media.file = f
        cnPrn(media)
        onSuccess(media)*/
              }, onError);

            });
          }, onError);
        }
        ,
        recordMedia = new Media(mediaName, mediaOnSuccess, onError);
      recordMedia.startRecord();
    }
    return recordMedia;
  },
  cnStopRecord: function (recordMedia) {
    if (cnIsDefined(recordMedia) && cnIsDefined(recordMedia.stopRecord)) {
      recordMedia.stopRecord();
    }
    return recordMedia;
  },
  cnDecode: function (json) {
    try {
      return eval('(' + json + ')');
    } catch (e) {
      try {
        return JSON.parse(json);
      } catch (e) {
        return json;
      }
    }
  },
  cnShowToast: function (d, time) {
    //退出提示
    var dialog = document.createElement('div');
    dialog.style.cssText = 'position:fixed;' + 'font-size:12px;' + 'left:50%;' + 'bottom:5%;' + 'background-color:rgba(0,0,0,0.5);' + 'z-index:9999;' + 'padding:5px 10px;' + 'color:#fff;' + 'border-radius:5px;' + 'transform:translate(-50%,-50%);' + '-webkit-transform:translate(-50%,-50%);' + '-moz-transform:translate(-50%,-50%);' + '-ms-transform:translate(-50%,-50%);' + '-o-transform:translate(-50%,-50%);';
    dialog.innerHTML = d;
    document.getElementsByTagName('body')[0].appendChild(dialog);
    setTimeout(function () {
      if (dialog) {
        document.getElementsByTagName('body')[0].removeChild(dialog);
      }
    }, time || 2000);
  },
  cnSetAlias: function (alias, accessToken, onSuccess, onError) {
    if (cnHasPlugin() && typeof (window.JPush) !== 'undefined') {
      onError = onError || cnPrints;
      onSuccess = onSuccess || cnPrints;
      window.JPush.setAlias({
        sequence: 1,
        alias: alias
      }, onSuccess, onError);
    }
    /*    if (cnIsiOS() && typeof (window.JPush) !== 'undefined') {
          window.JPush.setAlias({
            sequence: 1,
            alias: alias,
          }, function (result) {//console.log(" -JPush-setAlias-success: ", result);
          }, function (error) {//console.log(" -JPush-setAlias-error: ", error);
          });
        } else if (typeof (window.CunovsAliasPlugin) === 'object') {
          window.CunovsAliasPlugin.setAlias({
            accessToken: accessToken,
            alias: alias,
          });
        }*/
  },
  cnDeleteAlias: function (alias, accessToken, onSuccess, onError) {
    if (cnHasPlugin() && typeof (window.JPush) !== 'undefined') {
      onError = onError || cnPrints;
      onSuccess = onSuccess || cnPrints;
      window.JPush.deleteAlias({
        sequence: 3,
        alias: alias
      }, onSuccess, onError);
    }
    /*    if (cnIsiOS() && typeof (window.JPush) !== 'undefined') {
          window.JPush.deleteAlias({
            sequence: 3,
          }, function (result) {//console.log(" -JPush-deleteAlias-success: ", result);
          }, function (error) {//console.log(" -JPush-deleteAlias-error: ", error);
          });
        } else if (typeof (window.CunovsAliasPlugin) === 'object') {
          window.CunovsAliasPlugin.deleteAlias({
            accessToken: accessToken,
            alias: alias,
          });
        }*/
  }
  ,
  cnClearBadge: function () {
    if (!cnIsDevice() || typeof (cordova) == 'undefined') {
      return;
    }
    try {
      if (cnIsiOS()) {
        window.JPush.setApplicationIconBadgeNumber(0);
        window.JPush.setBadge(0);
      } else if (cordova.plugins.notification.badge) {
        cordova.plugins.notification.badge.clear();
      }
    } catch (exception) {
    }
  }
  ,
  cnScreenChange: function (isFull) {
    console.log(' ------------- isFull : ' + isFull);
    if (cnIsDevice()) {
      if (isFull === true) {
        screen.orientation.lock('landscape');
        StatusBar.hide();
      } else {
        screen.orientation.lock('portrait');
        StatusBar.show();
      }
    }
  }
  ,
  cnOpen: function (url, target, params, callback) {
    //target = target || '_blank';
    window.open(url, target);
  }
  ,
  checkConnection: function () {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = '未知网络';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = '正在用WIFI观看';
    states[Connection.CELL_2G] = '正在用2G网络观看';
    states[Connection.CELL_3G] = '正在用3G网络观看';
    states[Connection.CELL_4G] = '正在用4G网络观看';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = '无网络连接';
    return (states[networkState]);
  }
  ,
  cnHasPlugin: function (key) {
    if (cnIsDevice() && cnIsDefined(cordova) && cordova.plugins) {
      var hasKey = cnIsDefined(key);
      return hasKey && cordova.plugins[key] || !hasKey;
    }
    return false;
  }
  ,
  cnPrints: function (obj) {
    console.log(obj);
  }
  ,
  cnGetFileMiniType: function (name) {
    var index = -1;
    if (name && (index = name.lastIndexOf('.')) != -1) {
      return cnMiniType[name.substring(index)] || '';
    }
    return '';
  }
  ,
  cnOpener2File: function (filePath, miniType, onSuccess, onError) {
    onError = onError || cnPrints;
    var tag = 'fileOpener2';
    if (cnHasPlugin(tag)) {
      var errorMessage = '';
      miniType = miniType || cnGetFileMiniType(filePath);
      if (!filePath || !miniType) {
        errorMessage = (!filePath ? '文件路径' : '文件类型') + '必须提供。';
      }
      if (errorMessage === '') {
        onSuccess = onSuccess || cnPrints;
        cordova.plugins.fileOpener2.showOpenWithDialog(
          filePath,
          miniType,
          {
            success: onSuccess,
            error: onError
          }
        );
      } else {
        onError({ 'message': errorMessage });
      }
    } else {
      onError({ 'message': '没有找到插件[' + tag + ']' });
    }
  }
  ,
  cnGetLocalFile: function (fileName, options, onSuccess, onError) {
    onError = onError || cnPrints;
    if (!!fileName && cnHasPlugin() && requestFileSystem) {
      options = options || {};
      onSuccess = onSuccess || cnPrints;
      var size = options.size || 0;
      window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function (fs) {
        fs.root.getFile(decodeURI(fileName), {
          create: options.create === true,
          exclusive: options.exclusive === true
        }, onSuccess, onError);
      }, onError);
    } else {
      onError({ 'message': !fileName ? '需要获取的文件名必须提供。' : '无法使用文件读取插件。' });
    }
  }
  ,
  cnDownloadFile: function (fileUrl, fileName, options, onSuccess, onError, onProgress) {
    onError = onError || cnPrints;
    onProgress = onProgress || function (e) {
      if (e.lengthComputable) {
        var progress = e.loaded / e.total;
        // 显示下载进度
        console.log((progress * 100).toFixed(2));
      }
    };
    if (cnHasPlugin() && FileTransfer && requestFileSystem) {
      var errorMessage = '';
      if (!fileUrl || !fileName) {
        errorMessage = (!fileUrl ? '下载文件路径' : '文件名称') + '必须提供。';
      }
      if (errorMessage === '') {
        onSuccess = onSuccess || cnPrints;
        options = options || { create: true };//默认创建文件
        cnGetLocalFile(decodeURI(fileName), options, function (fileEntry) {
          var fileTransfer = new FileTransfer(),
            fileUri = options.needEncode === true ? encodeURI(fileUrl) : fileUrl;
          fileTransfer.onprogress = onProgress;
          fileTransfer.download(
            fileUri,         //uri网络下载路径
            fileEntry.nativeURL,      //url本地存储路径
            function (entry) {
              if (localStorage && JSON) {
                entry.file(function (file) {
                  var files = cnGetAllLocalFiles();
                  files.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    localURL: file.localURL,
                    lastModified: file.lastModified
                  });
                  cnSetAllLocalFiles(files);
                });
              }
              onSuccess(entry);
            },
            function (e) {
              if (e && e.code === 3) {
                e.message = '暂时无法连接服务器获取文件，请稍候重试。';
              }
              onError(e);
            }
          );
        }, onError);
      } else {
        onError({ 'message': errorMessage });
      }
    } else {
      onError({ 'message': '无法使用文件下载插件。' });
    }
  }
  ,
  cnGetTypeByFilename: function (name) {
    var type = '',
      pos = -1;
    if (name && (pos = name.lastIndexOf('.')) != -1) {
      type = name.substring(pos + 1);
      return (pos = type.indexOf('?')) != -1 ? type.substring(0, pos) : type;
    }
    return type;
  },
  cnOnlinePreviewFileType: ['jpg', 'jpeg', 'gif', 'png'],
  cnGetOrDownAndOpenFile: function (file, onSuccess, onError, onProgress) {
    file = file || {};
    onError = onError || cnPrints;
    var fileName = file.fileName || '',
      fileUrl = file.fileUrl || '',
      mimeType = file.mimeType || 'application/pdf';
    if (!fileName) {
      onError({ 'message': '获取本地文件，文件名不能为空。' });
      return;
    }
    if (!cnHasPlugin() || cnOnlinePreviewFileType.indexOf(cnGetTypeByFilename(fileName)) != -1) {
      setTimeout(function () {
        cnOpen(fileUrl);
        onSuccess && onSuccess();
      }, !cnHasPlugin() ? 2000 : 300);
      return;
    }
    var fileExistAndOpen = function (entry) {
      if (fileName.toLowerCase()
        .endsWith('.pdf')) {
        if (cnIsiOS()) {
          cnOpen(entry.nativeURL);
        } else if (cnIsAndroid()) {
          PDFViewer.showPDF(decodeURI(entry.nativeURL.replace('file://', '')), {
            showButtons: 0, //0: no buttons; 1: ok button, 2: ok and cancel button
            cancel: '返回', //text for cancel button
            save: '保存'
          }, function (result) {
          });
        }
        onSuccess && onSuccess();
        return;
      } else {
        cnOpener2File(cnIsiOS() ? entry.nativeURL : entry.toInternalURL(), mimeType, onSuccess, onError);
      }
    };
    cnGetLocalFile(fileName, {}, fileExistAndOpen, function (error) {
      if (!fileUrl) {
        onError({ 'message': '本地文件不存在，获取网络文件，网络地址不能为空。' });
        return;
      }
      if (!error || !error.code || error.code !== 1) {
        onError({ 'message': error.code === 2 ? '获取本地文件使用权限失败，请允许获取文件权限。' : '获取本地文件时发生未知错误。' });
        return;
      }
      cnDownloadFile(fileUrl, fileName, null, fileExistAndOpen, onError, onProgress);
    });
  }
  ,
  cnGetOrDownAndUploadFile: function (url, file, params, onSuccess, onError, onProgress) {
    onError = onError || cnPrints;
    if (!cnHasPlugin() || !url) {
      setTimeout(function () {
        onError({ 'message': !!url ? 'web端，无法获取本机文件。无法修改附件！！！' : '目标上传地址，必须提供。' });
      }, 300);
      return;
    }
    file = file || {};
    var fileName = file.fileName || '',
      fileUrl = file.fileUrl || '',
      localFilename = (file.filenamePrefix || '') + fileName,
      mimeType = file.mimeType || 'application/pdf';
    if (!fileName) {
      onError({ 'message': '获取本地文件，文件名不能为空。' });
      return;
    }
    params = params || {};
    var fileExistAndUpload = function (entry) {
      var options = new FileUploadOptions();
      options.fileKey = 'file';
      options.fileName = fileName;
      options.mimeType = mimeType;
      options.params = params;
      var ft = new FileTransfer();
      ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
          console.log(progressEvent.loaded / progressEvent.total);
        } else {
          console.log('over');
        }
      };
      onSuccess = onSuccess || cnPrints;
      var successCb = function (result) {
        if (result.responseCode === 200) {
          onSuccess(JSON.parse(result.response));
        } else {
          onError(result.response ? JSON.parse(result.response) : result);
        }
      };
      ft.upload(cnIsiOS() ? entry.nativeURL : entry.toInternalURL(), encodeURI(url), successCb, onError, options);
    };
    cnGetLocalFile(localFilename, {}, fileExistAndUpload, function (error) {
      if (!fileUrl) {
        onError({ 'message': '本地文件不存在，获取网络文件，网络地址不能为空。' });
        return;
      }
      if (!error || !error.code || error.code !== 1) {
        onError({ 'message': '获取本地文件时发生未知错误。' });
        return;
      }
      onProgress = onProgress || '';
      cnDownloadFile(fileUrl, localFilename, null, fileExistAndUpload, onError, onProgress);
    });
  },
  cnRemoveLocalFile: function (fileLocalPath, onSuccess, onFailure, onError) {
    onError = onError || cnPrints;
    onFailure = onFailure || onError;
    if (cnHasPlugin() && fileLocalPath) {
      onSuccess = onSuccess || function () {
        console.log(fileLocalPath + 'delete success');
      };
      window.resolveLocalFileSystemURL(fileLocalPath, function (fileEntry) {
        fileEntry.remove(onSuccess, onFailure);
      }, onError);
    } else {
      onFailure({ 'message': '本地文件路径为空，不能获取到本地文件。' });
    }
  },
  cnGetAllLocalFiles: function () {
    var files = '';
    return localStorage && (files = localStorage.getItem(cnDownloadFileTag)) ? JSON.parse(files) || [] : [];
  },
  cnSetAllLocalFiles: function (files) {
    files = files || '';
    return localStorage ? localStorage.setItem(cnDownloadFileTag, JSON.stringify(files)) : '';
  },
  cnGetLocalFileSize: function () {
    var totalSize = 0,
      files = cnGetAllLocalFiles();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (file && file.size) {
        totalSize += file.size;
      }
    }
    return totalSize;
  },
  cnExecFunction: function (func) {
    if (func) {
      try {
        eval(func);
      } catch (e) {
        cnPrn(e);
      }
    }
  },
  cnDoScan: function (onSuccess, onError) {
    onError = onError || cnPrints;
    var tag = 'barcodeScanner';
    if (cnHasPlugin(tag)) {
      onSuccess = onSuccess || function (result) {
        if (!result.cancelled) {
          alert('扫码获得的内容\n' +
            '返回结果: ' + result.text + '\n' +
            '格式化标准: ' + result.format + '\n' +
            '是否取消: ' + result.cancelled);
        }
      };
      cordova.plugins.barcodeScanner.scan(
        onSuccess,
        onError,
        {
          preferFrontCamera: false, // iOS and Android
          showFlipCameraButton: false, // iOS and Android
          showTorchButton: false, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          prompt: '请将二维码至于取景框内扫描', // Android
          resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
          orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations: true, // iOS
          disableSuccessBeep: false // iOS
        }
      );
    } else {
      onError({ 'message': '没有找到插件[' + tag + ']' });
    }
  },
  cnExitApp: function () {
    if (cnIsDevice() && typeof (navigator) != 'undefined' && typeof (navigator.app) != 'undefined') {
      navigator.app.exitApp();
    }
  },
  cnInsertZeroByLength: function (v, len) {
    len = len || 0;
    if (len > 0) {
      var result = [];
      for (var i = 0; i < len; i++) {
        result.push('0');
      }
      result.push(v);
      return result.join('');
    }
    return v;
  },
  cnCheckCodeVersion: function (cv, lens) {
    var cvs = [];
    if (cv && (cvs = cv.split('.')).length > 1 && lens && lens.length) {
      var maxLen = 1;
      for (var i = 0; i < lens.length; i++) {
        maxLen = maxLen > lens[i] ? maxLen : lens[i];
      }
      if (maxLen == 1) {
        return cvs.join('');
      }
      var result = [];
      for (var i = 0; i < cvs.length; i++) {
        var v = cvs[i];
        result.push(v.length <= maxLen ? cnInsertZeroByLength(v, maxLen - v.length) : v.substring(0, maxLen));
      }
      return result.join('');
    }
    return '0';
  },
  cnCodePush: function () {
    if (window.codePush) {

      var onError = function (error) {
        console.log('An error occurred. ' + error);
      };

      var onInstallSuccess = function () {
        console.log('Installation succeeded.');
      };

      var onPackageDownloaded = function (localPackage) {
        localPackage.install(onInstallSuccess, onError, {
          installMode: InstallMode.ON_NEXT_RESTART,
          minimumBackgroundDuration: 120,
          mandatoryInstallMode: InstallMode.ON_NEXT_RESTART
        });
      };

      var onUpdateCheck = function (remotePackage) {
        if (!remotePackage) {
          console.log('Return remotePackage is null.');
        } else {
          if (!remotePackage.failedInstall) {
            console.log('A CodePush update is available. Package hash: ' + remotePackage.packageHash);
            var codeVersions = [];
            if (remotePackage.description && (codeVersions = remotePackage.description.match(/cnCodeVersion:([\d\.]+)/i)) && codeVersions.length > 1) {
              var codeVersion = codeVersions[1].split('.'),
                formatLens = [];
              for (var i = 0; i < codeVersion.length; i++) {
                formatLens.push(codeVersion[i].length);
              }
              codeVersion = cnCheckCodeVersion(codeVersions[1], formatLens);
              var curCodeVersion = cnCheckCodeVersion(cnCodeVersion, formatLens);
              if (codeVersion > curCodeVersion) {
                remotePackage.download(onPackageDownloaded, onError);
              } else {
                console.log('The available update is old[' + codeVersions[1] + '], now[' + cnCodeVersion + '].');
              }
            } else {
              console.log('The available update is not right.');
            }
          } else {
            console.log('The available update was attempted before and failed.');
          }
        }
      };
      window.codePush.checkForUpdate(onUpdateCheck, onError);
    }
  }
};

window.cnApply = cunovs.cnIsDefined(Object.assign) ? Object.assign : function (target, source) {
  if (target && source && typeof source == 'object') {
    for (var att in source) {
      target[att] = source[att];
    }
    return target;
  }
  return target || {};
};
cnApply(window, cunovs);

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
  };
}

if (typeof Array.prototype.remove != 'function') {
  // see below for better implementation!
  Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };
}

(function () {
  var onDeviceReady = function () {
      try {
        if (cnIsDefined(StatusBar) != 'undefined') {
          StatusBar.overlaysWebView(false);
          cnSetStatusBarStyle();
        }
        cnClearBadge();
        navigator.splashscreen.hide();
        if (cordova.InAppBrowser) {
          cnOpen = function (url, target, params, callback) {
            var getDefaultTarget = function () {
              if (cnIsiOS()) {
                return '_blank';
              }
              return '_self';
            };
            var getDefaultParams = function () {
              if (cnIsiOS()) {
                return 'location=no,toolbarposition=top,closebuttoncaption=完成,closebuttoncolor=#ffffff,hideurlbar=yes,toolbarcolor=#4eaaf7,navigationbuttoncolor=#ffffff';
              }
              return 'location=yes,hideurlbar=yes,toolbarcolor=#22609c,navigationbuttoncolor=#ffffff,closebuttoncolor=#ffffff';
            };
            target = target || getDefaultTarget();
            params = params || getDefaultParams();
            callback = callback || new Function();
            var ref = cordova.InAppBrowser.open(url, target, params, callback),
              spinner = '<!DOCTYPE html><html><head><meta name=\'viewport\' content=\'width=device-width,height=device-height,initial-scale=1\'><style>.loader {position: absolute;    margin-left: -2em;    left: 50%;    top: 50%;    margin-top: -2em;    border: 5px solid #f3f3f3;    border-radius: 50%;    border-top: 5px solid #3498db;    width: 50px;    height: 50px;    -webkit-animation: spin 1.5s linear infinite;    animation: spin 1.5s linear infinite;}@-webkit-keyframes spin {  0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); }}@keyframes spin {  0% { transform: rotate(0deg); }  100% { transform:rotate(360deg); }}</style></head><body><div class=\'loader\'></div></body></html>';
            ref.executeScript({ code: '(function() {document.write("' + spinner + '");window.location.href=\'' + url + '\';})()' });

          };
        }
        if (window.codePush) {
          window.codePush.notifyApplicationReady();
        }
        cnCodePush();
      } catch (exception) {
      }
    },
    onResume = function () {
      cnClearBadge();
    },
    cunovsWebSocket = '',
    cunovsWebSocketUrl = '',
    cunovsWebSocketUserId = '',
    cnnovsWebSocketStatus = '';

  window.cnGetWebSocket = function (url, id) {
    if (cnIsDefined(url) && url) {
      if (cnIsDefined(id) && id) {
        if (cunovsWebSocket && cnnovsWebSocketStatus == 'open' && cunovsWebSocketUrl == url && cunovsWebSocketUserId == id) {
          return cunovsWebSocket;
        } else {
          cunovsWebSocketUrl = url;
          cunovsWebSocketUserId = id;
          cunovsWebSocket = new WebSocket(url + id + '/androidhome');
          cunovsWebSocket.onmessage = function (event) {
            cnWillCallBack(cnDecode(event.data));
          };
          cunovsWebSocket.onerror = function (event) {
            cnnovsWebSocketStatus = 'error';
            cunovsWebSocket = '';
          };
          cunovsWebSocket.onopen = function () {
            cnnovsWebSocketStatus = 'open';

          };
          cunovsWebSocket.onclose = function () {
            cnnovsWebSocketStatus = 'close';
            cunovsWebSocket = '';
          };
        }
      } else {
        cunovsWebSocket = '',
          cunovsWebSocketUrl = '',
          cunovsWebSocketUserId = '',
          cnnovsWebSocketStatus = '';
      }
    }
    return '';
  };
  var exitApp = function () {
      navigator.app.exitApp();
    },
    onOpenNotification = function (e) {
      var urlEncode = function (param, key, encode) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
          paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
          for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
          }
        }
        return paramStr;
      };
      window.cnClearBadge();
      var params = e.extras['params'],
        obj;
      if (params && (obj = JSON.parse(params)) && obj.routerPath) {
        var path = obj.routerPath;
        window.location.href = '#/' + path + '?' + urlEncode(obj)
          .slice(1);
      }
    };
  onExitApp = function () {
    if (typeof (navigator) != 'undefined' && typeof (navigator.app) != 'undefined') {
      var curHref = window.location.href;
      if (curHref.indexOf('/login') != -1) {
        navigator.app.exitApp();
      } else if (curHref.indexOf('/?_k') != -1) {
        cnShowToast('再按一次离开APP');
        document.removeEventListener('backbutton', onExitApp, false);
        document.addEventListener('backbutton', exitApp, false);
        var intervalID = window.setTimeout(function () {
          window.clearTimeout(intervalID);
          document.removeEventListener('backbutton', exitApp, false);
          document.addEventListener('backbutton', onExitApp, false);
        }, 2000);
      } else {
        navigator.app.backHistory();
      }
    }
  },
    screenChangeEvents = ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'MSFullscreenChange'];
  for (var i = 0; i < screenChangeEvents.length; i++) {
    document.addEventListener(screenChangeEvents[i], function (e) {
      if (e.target && e.target.tagName === 'VIDEO' && cnIsDefined(document.webkitIsFullScreen)) {
        cnScreenChange(document.webkitIsFullScreen);
      }
    });
  }
  window.cnPrintWebSocket = function () {
    console.log(cunovsWebSocket);
  };
  document.addEventListener('deviceready', onDeviceReady, false);
  document.addEventListener('resume', onResume, false);
  document.addEventListener('backbutton', onExitApp, false);
  document.addEventListener('jpush.openNotification', onOpenNotification, false);

  function resizeBaseFontSize () {
    var rootHtml = document.documentElement,
      deviceWidth = rootHtml.clientWidth;
    if (deviceWidth > 1024) {
      deviceWidth = 1024;
    }
    cnhtmlSize = deviceWidth / 7.5;
    rootHtml.style.fontSize = cnhtmlSize + 'px';
  }

  resizeBaseFontSize();
  window.addEventListener('resize', resizeBaseFontSize, false);
  window.addEventListener('orientationchange', resizeBaseFontSize, false);
  window.addEventListener('message', function (event) {
    cnWillCallBack(event.data);
  });
})();
