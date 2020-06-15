import React, { Component } from 'react';
import { Alert, Keyboard, NetInfo } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Feather from 'react-native-vector-icons/Feather';

import StatusBarLight from '../../StatusBarLight';
import Background from '../../Background';
import SnowShadow from '../../SnowShadow';
import SnowInput from '../../SnowInput';
import SnowButton from '../../SnowButton';
import { ButtonBack, Logo, PageTitle, FormSeparator, Label } from './styles';

import AsyncStorage from '@react-native-community/async-storage';
import { imagemLogo, imagemLogoBR } from '../../../imgs/imageConst';
import AwesomeAlert from 'react-native-awesome-alerts';
import { scale } from '../../../utils/scallingUtils';
import translate from '../../../../locales/i18n';
import { API_URL } from '../../../utils/constUtils';

Feather.loadFont();

class Login extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props);
        this.state = {
            userEmail: null,
            userPwd: null,
            userToken: null,
            statusCode: null,
            showAlert: false, //Custom Alerts
            showProgressBar: false //Custom Progress Bar
        }
    }

    showAlert = () => {
        this.setState({
            showAlert: true,
            showProgressBar: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        })
    }

    _isconnected = () => {
        let validation = false
        this.state.userEmail && this.state.userPwd ? validation = true : validation = false
        NetInfo.isConnected.fetch().then(isConnected => {
            isConnected ? validation ? this.login() : Alert.alert(translate("login.errorMessages.emailPwdWrong"), translate("login.errorMessages.emailPwdCantBeBlank")) : Alert.alert(
                translate("login.noInternet.noInternetConnection"),
                translate("login.noInternet.ohNo"),
                [
                    { text: translate("login.noInternet.alertAllRightMessage"), onPress: () => null }
                ]
            )
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        const { showAlert } = this.state;
      
        let LogoType;
        if (translate("lang.code") === "es") {
            LogoType = imagemLogo
        }
        else {
            LogoType = imagemLogoBR
        }

        return (
            <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
                <Background>
                    <StatusBarLight />

                    <ButtonBack onPress={() => navigate('TelaInicial')}>
                        <Feather name="chevron-left" size={scale(40)} color="#ffffff" />
                    </ButtonBack>

                    <Logo source={LogoType} />
                    <PageTitle>{translate("login.title")}</PageTitle>

                    <FormSeparator>
                        <SnowInput
                            placeholder = {translate('login.email')}
                            returnKeyType='next'
                            keyboardType='email-address'
                            maxLength={33}
                            onChangeText={(text) => this.setState({ userEmail: text })}
                            onSubmitEditing={() => this.passwordInput.focus()}
                        />
                        <SnowInput
                            placeholder = {translate("login.password")}
                            secureTextEntry={true}
                            maxLength={15}
                            ref={(input) => this.passwordInput = input}
                            onChangeText={(text) => this.setState({ userPwd: text })}
                            onSubmitEditing={() => this.login()}
                        />
                    </FormSeparator>

                    <FormSeparator>
                        <SnowShadow>
                            <SnowButton onPress={() => this.login()}>
                                <Label>{translate("login.loginbutton")}</Label>
                            </SnowButton>
                        </SnowShadow>
                    </FormSeparator>

                    <AwesomeAlert
                        show={showAlert}
                        showProgress={this.state.showProgressBar ? true : false}
                        title={this.state.showProgressBar ? translate("login.awesomeAlert.accessing") : null}
                        closeOnTouchOutside={this.state.showProgressBar ? false : true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={this.state.showProgressBar ? false : true}
                        confirmButtonColor="#DD6B55"
                    />
                </Background>
            </KeyboardAwareScrollView>
        );
    }

    //Login Function 
    login = () => {
        if (this.state.userEmail == null || this.state.userPwd == null) {
            Alert.alert('Os campos não podem ficar em branco')
        } else {
            Keyboard.dismiss()
            this.showAlert()
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
                this.setState({ userToken: response.headers.map.authorization, statusCode: response.status})
                if (this.state.statusCode == 200) {
                    return response.json()
                } else {
                    Alert.alert("Email ou senha inválida.");
                    this.hideAlert();
                }
            })
            .then((responseJson) => {
                AsyncStorage.setItem('userID', responseJson.user.id.toString());
                AsyncStorage.setItem('userName', responseJson.user.user_name);
                AsyncStorage.setItem('userToken', this.state.userToken);
                AsyncStorage.setItem('appID', responseJson.user.app.id.toString());
                AsyncStorage.setItem('userAvatar', responseJson.user.picture);
                AsyncStorage.setItem('isProfessional', responseJson.user.is_professional.toString());

                AsyncStorage.setItem('userEmail', this.state.userEmail);
                AsyncStorage.setItem('userPwd', this.state.userPwd);

                this.props.navigation.navigate('Home');
                this.hideAlert();
            })
        }
    }
}

//make this component available to the app
export default Login;
