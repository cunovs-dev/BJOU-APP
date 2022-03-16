/**
 * @author Lowkey
 * @date 2018/10/26
 * @Description: 视频播放页
 */
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Nav from 'components/nav';
import { Icon } from 'components';
import { getLocalIcon } from 'utils';
import LessonItem from 'components/lessonitem';
import TitleBox from 'components/titlecontainer';

const PrefixCls = 'video';

class Video extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      element: '',
    };
  }

  componentDidMount () {
    const video = ReactDOM.findDOMNode(this.video);
    this.setState({
      element: video,
    });
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullScreen();
    }
  }

  componentWillMount () {

  }

  tetxClick = (video) => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullScreen();
    }
  };

  render () {
    const { name } = this.props.location.query,
      data = [
        {
          listType: 'list',
          icon: <Icon type={getLocalIcon('/lessontype/pdf.svg')} />,
          title: '课件1',
          type: 'pdf',
        },
        {
          listType: 'list',
          icon: <Icon type={getLocalIcon('/lessontype/pdf.svg')} />,
          title: '课件2',
          type: 'pdf',
        },
      ];
    return (
      <div>
        <Nav title={name} dispatch={this.props.dispatch} />
        <video key={1}
          ref={el => this.video = el}
          style={{ objectFit: 'contain' }}
          width="100%"
          preload="none"
          src={''}
          controlsList="nodownload"
          controls="controls"
        />
        <TitleBox title="视频课件" sup="" />
        {cnIsArray(data) && data.map((data, i) => {
          return <LessonItem data={data} dispatch={this.props.dispatch} />;
        })}
      </div>
    );
  }
}

Video.propTypes = {};

export default connect(({ loading, video }) => ({
  loading,
  video,
}))(Video);
