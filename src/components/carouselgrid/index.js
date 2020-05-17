import { Grid } from 'components';
import styles from './index.less';
import PropTypes from 'prop-types';

const PrefixCls = 'carouselgrid';
const CarouselGrid = (props) => {
  return (
    <div className={styles[`${PrefixCls}`]}>
      <Grid data={props.datas}
        isCarousel={props.isCarousel}
        hasLine={props.hasLine}
        onClick={(data, index) => {
          const param = {
            ...data,
          };
          props.handleClick(param, props.dispatch);
        }}
      />
    </div>
  );
};

CarouselGrid.defaultProps = {
  datas: [],
  hasLine: false,
  isCarousel: true,
};
CarouselGrid.PropTypes = {};
export default CarouselGrid;
