import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from '../screens/Login';
import FacebookLogin from '../screens/FacebookLogin';
import GoogelLogin from '../screens/GoogleLogin';
import Home from '../screens/Home';

const appStack = createStackNavigator(
  {
    Login,
    FacebookLogin,
    GoogelLogin,
    Home,
  },
  {
    initialRouteName: 'Login',
  },
);

export default createAppContainer(appStack);
