import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Nav from 'components/nav';

class Url extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      startTime: 0
    };
  }

  componentDidMount () {
    const { courseid = '', cmid = '', type = 'mod', modname } = this.props.location.query;
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
  }
  //
  // componentWillUnmount () {
  //   const { courseid = '', cmid = '' } = this.props.location.query;
  //   this.props.dispatch({
  //     type: 'app/accessTime',
  //     payload: {
  //       startedat: this.state.startTime.getTime(),
  //       endedat: new Date().getTime(),
  //       courseid,
  //       cmid,
  //
  //     }
  //   });
  // }

  getContents = () => {
    const { htmlBody } = this.props.location.query;
    return {
      __html: htmlBody,
    };
  };

  render () {
    const { name = '' } = location.query;

    return (
      <div style={{ overflow: 'hidden' }} >
        <Nav title={name} dispatch={this.props.dispatch} />
        <div dangerouslySetInnerHTML={this.getContents()} />
      </div >
    );
  }
}

export default connect(({ loading, url }) => ({
  loading,
  url,
}))(Url);
