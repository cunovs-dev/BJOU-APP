import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Radio, List, Checkbox } from 'components';
import styles from './index.less';

const RadioItem = Radio.RadioItem,
  CheckboxItem = Checkbox.CheckboxItem;

@createForm()
class Choose extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {

  }

  componentDidMount () {

  }


  checkboxChange = (value, id) => {
    this.props.dispatch({
      type: 'quizDetails/updateCheckVal',
      payload: {
        value,
        id
      }
    });
  };

  radioChange = (value, id) => {
    this.props.dispatch({
      type: 'quizDetails/updateVal',
      payload: {
        value,
        id
      }
    });
  };

  render () {
    const { answer, form } = this.props;
    const { getFieldProps } = form;
    return (
      <List >
        {
          answer.map((item, i) => {
            if (item.type === 'radio') {
              return (
                <RadioItem
                  {...getFieldProps(item.name, {
                    initialValue: item.value,
                  })}
                  wrap
                  key={item.id}
                  checked={item.checked}
                  onClick={() => this.radioChange(item.value, item.id)}
                >
                  {item.label}
                </RadioItem >);
            }
            return (
              <CheckboxItem
                key={i}
                defaultChecked={item.checked}
                onChange={() => this.checkboxChange(item.value, item.id)}
              >
                {item.label}
              </CheckboxItem >
            );
          })
        }
      </List >
    );
  }
}

export default Choose;
