import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Radio, List, Checkbox } from 'components';
import ResultIcon from '../icon';
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
                  // disabled={item.disabled}
                >
                  <div className={styles.answer} >
                    {item.label}
                    {
                      item.currect !== '' && <ResultIcon currect={item.currect} />
                    }
                  </div >
                </RadioItem >
              );
            }
            return (
              <CheckboxItem
                key={i}
                checked={item.checked}
                // disabled={item.disabled}
              >
                <div className={styles.answer} >
                  {item.label}
                  {
                    item.currect !== '' && <ResultIcon currect={item.currect} />
                  }
                </div >
              </CheckboxItem >
            );
          })
        }
      </List >
    );
  }
}

export default Choose;
