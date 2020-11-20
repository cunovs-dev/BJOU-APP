import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CoursePage from 'components/coursepage';


let timer;

class Page extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      startTime: 0
    };
  }

  componentDidMount () {
    const { courseid = '', cmid = '', type = 'mod', modname } = this.props.location.query;
    const { scrollerTop } = this.props.page;
    this.setState(() => ({
      startTime: new Date()
    }));
    this.props.dispatch({
      type: 'app/logApi',
      payload: {
        assesstime: new Date().getTime(),
        courseid,
        cmid,
        type,
        modname
      }
    });
    timer = setTimeout(() => {
      if (scrollerTop > 0) {
        document.documentElement.scrollTo(0, scrollerTop);
      }
    }, 300);
  }

  componentWillUnmount () {
    const { courseid = '', cmid = '', modname = '' } = this.props.location.query;
    this.props.dispatch({
      type: 'app/accessTime',
      payload: {
        startedat: this.state.startTime.getTime(),
        endedat: new Date().getTime(),
        courseid,
        cmid,
        modname
      }
    });
    this.props.dispatch({
      type: 'page/updateState',
      payload: {
        scrollerTop: document.documentElement.scrollTop
      }
    });
  }

  render () {
    const { page } = this.props;
    const { cmid = '' } = this.props.location.query,
      { _useJavaScriptMessage } = this.props.app;
    return (
      <CoursePage dispatch={this.props.dispatch} propDatas={page} cmid={cmid} pathname={'page'} alertInfo={_useJavaScriptMessage} />
    );
  }
}

export default connect(({ loading, page, app }) => ({
  loading,
  page,
  app
}))(Page);
