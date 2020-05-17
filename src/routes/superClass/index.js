import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CoursePage from 'components/coursepage';

class SuperClass extends React.PureComponent {
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
  }

  render () {
    const { superclass } = this.props;
    const {  cmid = '', } = this.props.location.query;
    return (
      <CoursePage dispatch={this.props.dispatch} cmid={cmid} propDatas={superclass} pathname={'superclass'} />
    );
  }
}

export default connect(({ loading, superclass, app }) => ({
  loading,
  superclass,
  app
}))(SuperClass);
