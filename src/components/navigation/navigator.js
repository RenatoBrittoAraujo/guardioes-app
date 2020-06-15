import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {scale} from '../../utils/scallingUtils';
import {
  createDrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import Loading from '../telainicial/Loading';
import TelaInicial from '../telainicial/TelaInicial';
import Registrar from '../telainicial/Registrar';
import ChangePwd from '../telainicial/ChangePwd';
import ForgetPwd from '../telainicial/ForgetPwd';
import GetToken from '../telainicial/getToken';
import Login from '../telainicial/Login';
import Início from '../principal/Home';
import Registros from '../principal/Diario';
import Conselho from '../principal/Conselho';
import Noticias from '../principal/Noticias';
import BadReport from '../principal/badReport';
import Household from '../principal/Household';
import drawerContentComponents from './drawerContentComponent';
import Maps from '../principal/Maps';
import Perfil from '../principal/Perfil';
import Ajuda from '../principal/Ajuda';
import {Tutorial} from '../principal/Tutorial';
import TermosPoliticas from '../principal/TermosPoliticas';
import Rumor from '../principal/Rumor';
import Sobre from '../principal/Sobre';

import InicioNewPage from '../../pages/Inicio';

Feather.loadFont();

export const Cadastro = createStackNavigator(
  {
    TelaInicial: {screen: TelaInicial},
    Registrar: {screen: Registrar},
    Login: {screen: Login},
    ChangePwd: {screen: ChangePwd},
    ForgetPwd: {screen: ForgetPwd},
    GetToken: {screen: GetToken},
  },
  {
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#04617E',
        elevation: 10,
      },
      headerTitleStyle: {
        fontFamily: 'roboto',
      },
    },
  },
);

export const BottomMenu = createBottomTabNavigator(
  {
    Início,
    Registros,
    Mapa: {screen: Maps},
    Conselho,
    Noticias,
  },
  {
    initialRouteName: 'InicioNewPage',
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'InicioNewPage') {
          iconName = 'home';
          return <Feather name={iconName} size={scale(30)} color={tintColor} />;
        } else if (routeName === 'Registros') {
          iconName = 'clipboard';
        } else if (routeName === 'Mapa') {
          iconName = 'map';
        } else if (routeName === 'Conselho') {
          iconName = 'heart';
        } else if (routeName === 'Noticias') {
          iconName = 'message-square';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Feather name={iconName} size={scale(25)} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      style: {height: '11%', backgroundColor: '#fff'},
      activeTintColor: '#348EAC',
      inactiveTintColor: 'grey',
    },
  },
);

export const Stack = createStackNavigator(
  {
    BottomMenu: {screen: BottomMenu, navigationOptions: {header: null}},
    BadReport,
    Household,
    Perfil,
    Ajuda,
    TermosPoliticas,
    Rumor,
    Tutorial,
    Sobre,
  },
  {
    initialRouteName: 'BottomMenu',
    navigationOptions: {
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#04617E',
        elevation: 10,
      },
      headerTitleStyle: {
        fontFamily: 'roboto',
      },
    },
  },
);

export const Drawer = createDrawerNavigator(
  {
    Stacks: {screen: Stack},
  },
  {
    contentComponent: drawerContentComponents,
  },
);

export const Authentication = createSwitchNavigator(
  {
    AuthLoading: {screen: Loading},
    Cadastro: {screen: Cadastro},
    Drawer,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
