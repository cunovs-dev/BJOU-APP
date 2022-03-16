/**
 * @author Lowkey
 * @date 2019/03/20 14:45:10
 * @Description:
 */
import React from 'react';
import { PullToRefresh } from 'antd-mobile';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getOffsetTopByBody } from 'utils';

let timer,
  timer2;

class Refresh extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      down: true,
      height: 200
    };
  }

  componentWillMount () {
    this._isMounted = true;
  }

  componentDidMount () {
    let el = ReactDOM.findDOMNode(this.ptr);
    if (this.ptr && el) {
      const hei = cnhtmlHeight - getOffsetTopByBody(el);
      if (this._isMounted) {
        timer = setTimeout(() => this.setState(() => ({
          height: hei
        })), 0);
        timer2 = setTimeout(() => {
          if (this.props.scrollerTop > 0) {
            el.scrollTop = this.props.scrollerTop;
          }
        }, 0);
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    let el = ReactDOM.findDOMNode(this.ptr);
    if (this.ptr && el) {
      const hei = cnhtmlHeight - getOffsetTopByBody(el);
      if (this._isMounted) {
        timer = setTimeout(() => this.setState(() => ({
          height: hei
        })), 0);
        timer2 = setTimeout(() => {
          if (this.props.scrollerTop > 0 && this.props.scrollerTop !== nextProps.scrollerTop) {
            el.scrollTop = this.props.scrollerTop;
          }
        }, 0);
      }
    }
  }

  componentWillUnmount () {
    this._isMounted = false;
    if (this.ptr && (ReactDOM.findDOMNode(this.ptr))) {
      let scrollTop = ReactDOM.findDOMNode(this.ptr).scrollTop;
      if (scrollTop >= 0 && this.props.onScrollerTop) {
        this.props.onScrollerTop(scrollTop);
      }
    }
    clearTimeout(timer);
    clearTimeout(timer2);
  }

  render () {
    return (
      <PullToRefresh
        ref={el => this.ptr = el}
        style={{
          height: this.state.height,
          overflow: 'auto'
        }}
        indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
        direction={this.state.down ? 'down' : 'up'}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onRefresh}
      >
        {this.props.children || ''}
      </PullToRefresh>
    );
  }
}

Refresh.defaultProps = {
  refreshing: false
};
Refresh.propTypes = {
  onRefresh: PropTypes.func.isRequired
};
export default Refresh;
