import React, { PureComponent } from 'react';
import { connect } from 'dva';

import Nav from 'components/nav';
import Iframes from 'components/ifream';

class Payment extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  componentDidMount () {


  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div style={{ overflow: 'hidden' }}>
        <Nav title={name} dispatch={this.props.dispatch} />
         {/*<Iframes src={'https://sso.bjou.edu.cn'} dispatch={this.props.dispatch} />}*/}
      </div>
    );
  }
}

export default connect(({ loading }) => ({
  loading,
}))(Payment);
