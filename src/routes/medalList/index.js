import React from 'react';
import Nav from 'components/nav';
import { connect } from 'dva';
import { Icon } from 'antd-mobile';
import { getImages, getLocalIcon } from 'utils';
import { routerRedux } from 'dva/router';
import NoContent from 'components/nocontent';
import img from '../medal/img.png';
import styles from './index.less';

const PrefixCls = 'medalList';
const datas = [
  {
    name: '成绩斐然',
    startDate: '2019年1月1日',
    id: '1'
  }
];

class MedalList extends React.Component {
  constructor (props) {
    super(props);
  }

  medalPage = (name, id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/medal',
      query: {
        name,
        id,
      },
    }));
  };

  render () {
    const { name = '勋章' } = this.props.location.query,
      { data } = this.props.medalList;
    return (
      <div >
        <Nav title={name} dispatch={this.props.dispatch} />
        {
          datas.length > 0 ?
            datas.map((item) => (
              <div key={item.id} onClick={this.medalPage.bind(this, `${item.name}`, item.id)} >
                <div className={styles[`${PrefixCls}-disan`]} >
                  <div className={styles[`${PrefixCls}-disan-diyi`]} >
                    <img src={img} style={{}} />
                    <div className={styles[`${PrefixCls}-disan-dier`]} >
                      <div >{item.name}</div >
                      <div >{item.startDate}</div >
                    </div >
                  </div >
                  <Icon type="right" size="lg" color="#108ee9" />
                </div >
              </div >
            ))
            :
            <NoContent />
        }
      </div >
    );
  }

  s;
}


export default connect(({ medalList, loading }) => ({
  medalList,
  loading,
}))(MedalList);
