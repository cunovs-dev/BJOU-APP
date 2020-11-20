/**
 * @author Lowkey
 * @date 2020/05/07 15:39:32
 * @Description:
 */
import React from 'react';
import { Icon, Toast } from 'components';
import { getLocalIcon, getCommonDate, config } from 'utils';
import styles from './index.less';

class FileBox extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isDownLoad: false
    };
  }

  downLoaded = (state) => {
    this.setState({
      isDownLoad: state
    });
  };

  fileClick = (data) => {
    const { fileName, mimeType = '', fileID, pdfUrl, fileIdPrefix = '' } = data;
    cnGetOrDownAndOpenFile({
      fileName: `${fileIdPrefix !== '' ? fileIdPrefix : fileID}_${fileName}`,
      fileUrl: pdfUrl,
      mimeType,
      callback: () => this.downLoaded(true)
    }, (e) => {
      Toast.info('正在打开文件...');
      this.downLoaded(false);
    }, (error) => {
      this.downLoaded(false);
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
    const { data = {} } = this.props;
    const { coursewareName = '', createDate } = data;
    const { isDownLoad } = this.state;
    return (
      <div
        className={styles.outer}
        onClick={this.fileClick.bind(null, data)}
      >
        <div className={styles.img}>
          <Icon type={getLocalIcon('/components/PDF.svg')} size="lg" color="#22609c" />
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
            <span>{coursewareName}</span>
            <span>{getCommonDate(createDate / 1000)}</span>
          </div>
          <div className={styles.right}>
            {isDownLoad ? <Icon type={'loading'} size="xs" color="#22609c" /> : '下载'}
          </div>
        </div>
      </div>
    );
  }
}

export default FileBox;
