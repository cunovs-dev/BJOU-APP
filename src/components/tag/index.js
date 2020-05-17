import React from 'react';
import classnames from 'classnames';
import styles from './index.less';

const PrefixCls = 'tag';
const PresetColorTypes = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime'
];
const Tag = (props) => {
  const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);
  const isPresetColor = () => {
    const { color } = props;
    if (!color) {
      return false;
    }
    return PresetColorRegex.test(color);
  };
  const getTagStyle = () => {
    const { color, style } = props;
    const isColor = isPresetColor();
    return {
      backgroundColor: color && !isColor ? color : undefined,
      ...style
    };
  };
  const gteClassName = () => {
    const { className, color, size } = props;
    const isColor = isPresetColor();
    return classnames(
      styles.tag,
      styles[`${PrefixCls}-${size}`],
      {
        [styles[`${PrefixCls}-${color}`]]: isColor,
        [styles[`${PrefixCls}-has-color`]]: color && !isColor
      },
      className
    );
  };
  return (
    <div style={{ display: props.inline ? 'inline-block' : 'block' }}>
      <div
        className={gteClassName()}
        style={getTagStyle()}
      >
        {props.text}
      </div>
    </div>
  );
};

Tag.defaultProps = {
  background: 'red',
  color: 'white',
  text: '合格',
  size: 'normal',
  className: null,
  inline: false
};

export default Tag;
