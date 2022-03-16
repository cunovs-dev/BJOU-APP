import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { getImages,getLocalIcon } from 'utils';
import { routerRedux } from 'dva/router';
import { Icon, card, WingBlank, WhiteSpace, Card } from 'antd-mobile';
import img from './img.png';
import styles from './index.less';

const PrefixCls = 'medal';

class Medal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentDidMount () {
    const currentHeight = window.innerHeight;
    this.setState({
      height: currentHeight,
    });
  }

  Click = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/jobDetails',
      query: {
        name: 'x',
      },
    }));
  };

  render () {
    const { name } = this.props.location.query,
      { detail = {} } = this.props.medal;
    return (
      <div style={{ height: this.state.height, background: 'white' }} >
        <Nav title={name} dispatch={this.props.dispatch} />
        <div className={styles[`${PrefixCls}-imag`]} onClick={this.Click.bind(this)} >
          <img src={img} />
        </div >
        <h3 className={styles[`${PrefixCls}-name`]} >成绩斐然</h3 >
        <div className={styles[`${PrefixCls}-info`]} >
          <div className={styles[`${PrefixCls}-text`]} >授予日期: <span >2019年1月1日</span ></div >
          <div className={styles[`${PrefixCls}-text`]} >授予学生: <span >李青</span ></div >
          <div className={styles[`${PrefixCls}-text`]} >授予机构: <span >北京开放大学</span ></div >
          <div className={styles[`${PrefixCls}-text`]} >授予课程: <span >学习指南</span ></div >
        </div >
        <WingBlank size="lg" >
          <WhiteSpace size="lg" />
          <Card >
            <Card.Header
              title={<span className={styles[`${PrefixCls}-title`]} >奖章详情</span >}
              thumb={<Icon type={getLocalIcon('/sprite/medal.svg')} />}
            />
            <Card.Body >
              <div >同学你好，待你完成“活动4.1结合我的职业生涯，提交《我的学习计划》后就会获得此勋章。”</div >
            </Card.Body >
          </Card >
          <WhiteSpace size="lg" />
        </WingBlank >
      </div >
    );
  }
}


export default connect(({ medal, medalList }) => ({
  medal,
  medalList,
}))(Medal);
