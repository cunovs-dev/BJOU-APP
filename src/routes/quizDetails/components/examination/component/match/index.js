import React from 'react';
import { connect } from 'dva';
import { Picker, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.less';


class Match extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {

  }

  componentDidMount () {
    this.props.onRef(this);
  }

  onSubmit = () => {
    const fieldsValue = this.props.form.getFieldsValue(),
      result = {};
    for (let att in fieldsValue) {
      const value = fieldsValue[att];
      if (cnIsArray(value)) {
        value.map(v => {
          result[att] = v;
        });
      } else if (typeof value === 'object') {
        for (let attV in value) {
          result[attV] = value[attV];
        }
      } else {
        result[att] = value;
      }
    }
    return result;
  };

  render () {
    const { getFieldProps } = this.props.form;
    const { answer } = this.props;
    return (
      <div >
        {
          answer.map((item, i) =>
            (<Picker
              key={i}
              data={item.answer}
              cols={1}
              onOk={this.handlerSelectCilck}
              {...getFieldProps(item.name,
                {
                  initialValue: [item.answer.find(child => child.selected === true).value]
                }
              )}
            >
              <List.Item arrow="horizontal" >{item.question}</List.Item >
            </Picker >))
        }
      </div >
    );
  }
}

export default createForm()(Match);
