
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Icon} from 'react-native-elements';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSidebarMenu  from './CustomSidebarMenu';
import MyBartersScreen from '../screens/MyBartersScreen';
import SettingScreen from '../screens/SettingScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedItemsScreen from '../screens/MyRecievedItems';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions:{
      drawerIcon:<Icon name="Home" type = "fontawesome5" />
    }
    },
  MyBarters:{
      screen : MyBartersScreen,
      navigationOptions:{
        drawerIcon: <Icon name="trade" type = "font-awesome" />,
        drawerLabel: "My Trades"
      }
    },

  Notification:{
    screen: NotificationScreen,
    navigationOptions: {
      drawerIcon: <Icon name="Bell" type="font-awesome" />,
      drawerLabel: "Notifications"
    }
  },

  RecievedItems:{
    screen:MyReceivedItemsScreen,
    navigationOptions:{
      drawerIcon: <Icon name="Trade" type="font-awesome" />,
      drawerLabel: "Recieved Items"
    }
  },

  Setting : {
      screen : SettingScreen,
      navigationOptions:{
        drawerIcon: <Icon name="Setting" type="fontawesome5" />,
        drawerLabel: "Setting"
      }
    }
},
  {
    contentComponent:CustomSidebarMenu
  },
  {
    initialRouteName : 'Home'
  })
