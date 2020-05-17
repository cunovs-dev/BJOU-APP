/**
 * @author Lowkey
 * @date 2020/05/07 15:39:32
 * @Description:
 */
import React from 'react';
import { Icon, Toast } from 'components';
import { getLocalIcon, getCommonDate, config } from 'utils';
import styles from './index.less';

const { api: { EnclosureDownload, downFiles } } = config;
const getIcon = (type) => {
  if (RegExp(/pdf/)
    .exec(type)) {
    return '/components/PDF.svg';
  } else if (RegExp(/word/)
    .exec(type)) {
    return '/components/DOCX.svg';
  } else if (RegExp(/xlsb/)
    .exec(type)) {
    return '/components/EXCEL.svg';
  } else if (RegExp(/^(\s|\S)+(jpeg|jpg|png|JPG|PNG|)+$/)
    .exec(type)) {
    return '/components/IMAGE.svg';
  }
  return '/components/file.svg';
};

class FileBox extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isDownLoad: -1
    };
  }

  downLoaded = (i = -1) => {
    this.setState({
      isDownLoad: i
    });
  };

  fileClick = (item, i) => {
    const { fileIdPrefix = '' } = this.props;
    const { fileName, mimeType = '', fileId = '', groupId = '' } = item;
    cnGetOrDownAndOpenFile({
      fileName: `${fileIdPrefix !== '' ? fileIdPrefix : fileId}_${fileName}`,
      fileurl: this.props.informationType === 1 ? `${EnclosureDownload}/${fileId}` : `${downFiles}/${groupId}`,
      mimeType
    }, (e) => {
      Toast.info('正在打开文件...');
    }, (error) => {
      let msg = '';
      if (error.message) {
        msg = error.message;
      } else if (error.body) {
        msg = JSON.parse(error.body).error;
      }
      Toast.offline(msg || '发生未知错误。');
    });
  };

  render () {
    const { data } = this.props;
    const { isDownLoad } = this.state;
    return (
      <div>
        {cnIsArray(data) &&
        data.length > 0 &&
        data.map((item, i) => {
          const { fileName, uploadTime } = item;
          return (
            <div
              key={i}
              className={styles.outer}
              onClick={isDownLoad > -1 ? null : this.fileClick.bind(null, item, i)}
            >
              <div className={styles.img}>
                <Icon type={getLocalIcon(getIcon(fileName))} size="lg" color="#22609c" />
              </div>
              <div className={styles.content}>
                <div className={styles.left}>
                  <span>{fileName}</span>
                  <span>{getCommonDate(uploadTime / 1000)}</span>
                </div>
                <div className={styles.right}>
                  {isDownLoad === i ? <Icon type={'loading'} size="xs" color="#22609c" /> : '下载'}
                </div>
              </div>
            </div>
          );
        })
        }
      </div>
    );
  }
}

export default FileBox;
