/* WKC
搜索页 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, InputItem, Icon, WhiteSpace, Tag } from 'antd-mobile';
import styles from './index.less';

const PrefixCls = 'search';

class Search extends React.Component {
  constructor (props) {
    super(props);
  }
	goBack = () => {
		  this.props.dispatch(routerRedux.goBack());
		  if (typeof this.props.navEvent === 'function') {
		    this.props.navEvent();
		  }
	};		
	
	render () {
	  const { banner } = this.props.search;
	  return (
	    <div>
    <List>
	        <InputItem
        placeholder="请输入搜索信息"
	          extra={<Icon type="search" />}
      >
        <Icon type="left" size="md" onClick={this.goBack} />   
      </InputItem>
	      </List>
    <WhiteSpace size="xs" />
    <div style={{ background: '#fff' }}>
  <div>热门搜索</div>
  {banner && banner.map((data, i) => (
  <Tag key={i} className={styles[`${PrefixCls}-Choice`]}>{data}</Tag>
		        ))}
	      </div>
  </div>
	  );
	}
}

export default connect(({ search }) => ({
  search
}))(Search);
