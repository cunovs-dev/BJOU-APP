import { message } from 'antd';
import dva from 'dva';
import { routerRedux } from 'dva/router';
import createLoading from 'dva-loading';
// import { browserHistory } from 'dva/router'
import 'babel-polyfill';
import { Toast } from 'antd-mobile';

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true
  }),

  onError (error) {
    //关闭错误提示
    if (error && (error.message && error.message.includes('网络已断开') || error.statusCode === 401)) {
      Toast.offline(error.message);
    } else if (error.statusCode === 555) {

    } else if (error && error.message) {
      Toast.offline(error.message);
    }
  }
});
// 2. Model
app.model(require('./models/app'));
// 3. Router
app.router(require('./router'));

// 4. Start
app.start('#root');

