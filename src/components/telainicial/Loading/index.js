import React from 'react';

import StatusBarLight from '../../StatusBarLight';
import Background from '../../Background';
import SnowSpinner from '../../SnowSpinner';
import { Logo, LogosView, LogoContainer, LogoUnbProEpi } from './styles';

import AsyncStorage from '@react-native-community/async-storage';
import { imagemLogo, imagemLogoBR, logoProEpi, logoUnB } from '../../../imgs/imageConst';
import translate from '../../../../locales/i18n';
import { API_URL } from '../../../utils/constUtils';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
    this.getInfos();
  }

  getInfos = async () => { //Ger user infos
    let userEmail = await AsyncStorage.getItem('userEmail');
    let userPwd = await AsyncStorage.getItem('userPwd');
    this.setState({ userEmail, userPwd });
    console.log(this.state.userEmail)
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    let UserID = await AsyncStorage.getItem('userID');

    if (UserID !== null) {
      setTimeout(() => {
        this.verifyUserToken();
      }, 1500);
    } else {
      AsyncStorage.removeItem('userName');
      AsyncStorage.removeItem('userID');
      AsyncStorage.removeItem('householdID');
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('appID');
      AsyncStorage.removeItem('userSelected');
      AsyncStorage.removeItem('avatarSelected');
      AsyncStorage.removeItem('userEmail');
      AsyncStorage.removeItem('appPwd');

      this.props.navigation.navigate('Cadastro');
    }
  };


  verifyUserToken = async () => {
    return fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user:
        {
          email: this.state.userEmail,
          password: this.state.userPwd
        }
      })
    })
      .then((response) => {
        if (response.status == 200) {
          AsyncStorage.setItem('userToken', response.headers.map.authorization);
          this.props.navigation.navigate('BottomMenu');

        } else {
          this.props.navigation.navigate('Cadastro');
        }
      })
  };

  // Render any loading content that you like here
  render() {

    let LogoType;
    if (translate("lang.code") === "es") {
      LogoType = imagemLogo
    }
    else {
      LogoType = imagemLogoBR
    }

    return (
      <Background>
        <StatusBarLight />
        <Logo source={LogoType} />

        <LogosView>
          <LogoContainer>
            <LogoUnbProEpi source={logoProEpi} />
          </LogoContainer>
          <LogoContainer>
            <LogoUnbProEpi source={logoUnB} />
          </LogoContainer>
        </LogosView>

        <SnowSpinner />
      </Background>
    );
  }
}

export default AuthLoadingScreen;