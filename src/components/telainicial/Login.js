import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Alert, Keyboard, NetInfo } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import * as Imagem from '../../imgs/imageConst'
import AwesomeAlert from 'react-native-awesome-alerts';
import Emoji from 'react-native-emoji';
import { scale } from '../../utils/scallingUtils';
import translate from '../../../locales/i18n';
import {API_URL} from 'react-native-dotenv';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Login extends Component {
    static navigationOptions = {
        title: translate('login.title'),
    }
    constructor(props) {
        super(props);
        this.state = {
            userToken: null,
            userEmail: null,
            userPwd: null,
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
        const { showAlert } = this.state;

        const logoBR = (
            <Image style={styles.imageLogo} source={Imagem.imagemLogoCBR} />
          )
      
          const logoES = (
            <Image style={styles.imageLogo} source={Imagem.imagemLogoC} />
          )
      
          let imageType;
          if (translate("initialscreen.title") === "Guardianes de la Salud") {
            imageType = logoES
          }
          else {
            imageType = logoBR
          }

        return (
            <KeyboardAwareScrollView style={styles.container}>
                <View style={styles.scroll}>
                <View style={styles.viewImage}>
                    {imageType}
                </View>
                <View style={styles.viewForm}>
                    <Text style={styles.commomText}>{translate('login.email')}</Text>
                    <TextInput
                        style={styles.formInput}
                        autoCapitalize='none'
                        returnKeyType='next'
                        keyboardType='email-address'
                        multiline={false}
                        maxLength={100}
                        onSubmitEditing={() => this.passwordInput.focus()}
                        onChangeText={(text) => this.setState({ userEmail: text })}
                    />
                    <Text style={styles.commomText}>{translate("login.password")}</Text>
                    <TextInput
                        style={styles.formInput}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        multiline={false}
                        maxLength={100}
                        ref={(input) => this.passwordInput = input}
                        onChangeText={(text) => this.setState({ userPwd: text })}
                        onSubmitEditing={() => this.login()}
                    />
                    <View style={styles.buttonView}>
                        <Button
                            title={translate("login.loginbutton")}
                            color="#348EAC"
                            //onPress={this._isconnected}
                            onPress={() => 
                                this.login()
                                //console.warn(this.state.userEmail + " + " + this.state.userPwd)
                            }
                            />
                            <View style={{ marginTop: '5%'}}></View>
                            <Button
                            title={"Esqueci Minha Senha"}
                            color="#348EAC"
                            onPress={() => 
                                this.props.navigation.navigate('ForgetPwd')
                            }
                            />
                            {/*<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgetPwd')}><Text style={styles.txtForgetPwd}>Esqueci Minha Senha</Text></TouchableOpacity>*/}
                        </View>
                </View>
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
            </View>
            </KeyboardAwareScrollView>
        );
    }

    //Login Function 
    login = async () => {
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
                    if (response.status == 200) {
                        this.setState({ userToken: response.headers.map.authorization });
                        return response.json()
                    } else {
                        Alert.alert("Email ou senha inválida.");
                        this.hideAlert();
                    }
                })
                .then((responseJson) => {
                    AsyncStorage.setItem('userID', responseJson.user.id.toString());
                    AsyncStorage.setItem('userName', responseJson.user.user_name);
                    AsyncStorage.setItem('userAvatar', responseJson.user.picture);
                    AsyncStorage.setItem('isProfessional', responseJson.user.is_professional.toString());

                    RNSecureStorage.set('userToken', this.state.userToken, {accessible: ACCESSIBLE.WHEN_UNLOCKED});
                    RNSecureStorage.set('userEmail', this.state.userEmail, {accessible: ACCESSIBLE.WHEN_UNLOCKED});
                    RNSecureStorage.set('userPwd', this.state.userPwd, {accessible: ACCESSIBLE.WHEN_UNLOCKED});

                    this.props.navigation.navigate('Home');
                    this.hideAlert();
                })
        }
    }
}

const emojis = [
    (
        <Emoji //Emoji heart up
            name='heart'
            style={{ fontSize: scale(15) }}
        />
    ),
    (
        <Emoji //Emoji tada up
            name='tada'
            style={{ fontSize: scale(15) }}
        />
    )
]

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        height: 550,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    titulo: {
        color: '#CD853F',
        justifyContent: 'center',
        margin: 10,
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'center',
        marginRight: '40%',
    },
    viewImage: {
        flex: 2.5,
        width: scale(350),
        //height: '100%',
        alignItems: 'center',
    },
    viewForm: {
        flex: 4,
        width: "100%",
        alignItems: 'center',
    },
    formInput: {
        width: '90%',
        height: 35,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#348EAC',
        paddingBottom: 0,
        paddingTop: 2,
    },
    commomText: {
        fontFamily: 'roboto',
        fontWeight: '400',
        fontSize: 20,
        color: '#465F6C',
        marginTop: '3%'
    },
    buttonView: {
        marginTop: 30,
        width: "60%",
    },
    imageLogo: {
        flex: 1,
        marginTop: 9,
        width: '80%',
        resizeMode: 'contain',
    },
    txtForgetPwd: {
        marginTop: "5%",
        textAlign: "center",
        color: '#465F6C',
    }
});

//make this component available to the app
export default Login;
