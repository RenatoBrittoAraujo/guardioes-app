import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, NetInfo, Alert, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNSecureStorage from 'rn-secure-storage';
import * as Imagem from '../../imgs/imageConst';
import { scale } from '../../utils/scallingUtils';
import translate from "../../../locales/i18n";
import Emoji from 'react-native-emoji';
import AwesomeAlert from 'react-native-awesome-alerts';
import {API_URL} from 'react-native-dotenv';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar } from 'react-native-elements';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

let data = new Date();
let d = data.getDate();
let m = data.getMonth() + 1;
let y = data.getFullYear();

let today = y + "-" + m + "-" + d;

class Home extends Component {
    navOptions // rolê para acessar a drawer em uma função estática

    constructor(props) {
        super(props);
        this.getLocation();
        this.requestFineLocationPermission();
        this.state = {
            modalVisible: false,
            userSelect: null,
            userName: null,
            userID: null,
            userToken: null,
            householdName: null,
            householdID: null,
            userLatitude: 'unknown',
            userLongitude: 'unknown',
            error: null,
            showAlert: false, //Custom Alerts
            showProgressBar: false, //Custom Progress Bar
            alertMessage: null
        }
    }

    showAlert = (responseJson) => {
        let alertMessage = ""
        if (responseJson !== null && !responseJson.errors) {
            alertMessage = translate("badReport.alertMessages.reportSent")
        } else {
            alertMessage = translate("badReport.alertMessages.reportNotSent")
        }
        this.setState({
            alertMessage: <Text>{alertMessage}{emojis[0]}</Text>,
            showProgressBar: false
        });
        console.warn(alertMessage)
    }

    showLoadingAlert = () => {
        this.setState({
            alertMessage: null,
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
        NetInfo.isConnected.fetch().then(isConnected => {
            isConnected ? this.verifyLocalization() : Alert.alert(
                translate("noInternet.noInternetConnection"),
                translate("noInternet.ohNo"),
                [
                    { text: translate("noInternet.alertAllRightMessage"), onPress: () => null }
                ]
            )
        });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onHeaderEventControl() { // rolê para acessar a drawer em uma função estática
        const { params = {} } = navOptions.state;
        params._openNav()
    }

    componentDidMount() {
        this.getInfo()

        this.props.navigation.setParams({ // rolê para acessar a drawer em uma função estática
            _onHeaderEventControl: this.onHeaderEventControl,
            _openNav: () => this.openDrawer()
        })
    }

    openDrawer() { // rolê para acessar a drawer em uma função estática
        this.props.navigation.openDrawer();
    }

    getLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    userLatitude: position.coords.latitude,
                    userLongitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 50000 },
        );
    }

    getInfo = async () => { //Get user infos
        const userID = await AsyncStorage.getItem('userID');
        const userName = await AsyncStorage.getItem('userName');
        const userAvatar = await AsyncStorage.getItem('userAvatar');
        const isProfessional = await AsyncStorage.getItem('isProfessional');
        const userToken = await RNSecureStorage.get('userToken');
        
        this.setState({ userID, userName, userAvatar, isProfessional, userToken });
        this.setState({ userSelect: this.state.userName, avatarSelect: this.state.userAvatar });

        AsyncStorage.setItem('userSelected', this.state.userSelect);
        AsyncStorage.setItem('avatarSelected', this.state.avatarSelect);
        this.getHouseholds();
    }

    getNameParts = (fullName, firstandLast = false) => {
        if (fullName) {
            let nameParts = fullName.split(" ");
            let length = nameParts.length;

            if (firstandLast && length > 1) {
                return `${nameParts[0]} ${nameParts[length-1]}`;
            }
            else {
                return nameParts[0];
            }
        }
    }

    getHouseholds = () => {//Get households
        //console.warn("UserID " + this.state.userID + " Token " + this.state.userToken)
        return fetch(`${API_URL}/users/${this.state.userID}/households`, {
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `${this.state.userToken}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data: responseJson.households,
                })
                //console.warn(this.state.data)
            })
    }

    verifyLocalization = async () => {
        if(this.state.userLatitude == 0 || this.state.userLongitude == 0 || this.state.userLatitude == null || this.state.userLongitude == null){
            this.requestLocalization();
        } else{
            this.sendSurvey();
        }
    }

    async requestFineLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Guardiões da Saúde needs Locarion Permission',
              message:
                'Guardiões da Saúde needs access to your location ' +
                'so you can take locarion reports.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
          } else {
            console.log('Location permission denied');
            this.props.navigation.navigate('Home')
          }
        } catch (err) {
          console.warn(err);
        }
      }

    requestLocalization = () => {
        Alert.alert(
          "Erro Na Localização",
          "Permita a localização para prosseguir",
          [
            {
              text: 'Cancelar',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Premitir', onPress: () => this.requestFineLocationPermission() },
          ],
          { cancelable: false },
        );
      }

    sendSurvey = async () => { //Send Survey GOOD CHOICE
        this.showLoadingAlert();
        try {
            let currentPin = {
                household_id: this.state.householdID,
                latitude: this.state.userLatitude,
                longitude: this.state.userLongitude
            }
            await AsyncStorage.setItem(
                "localpin",
                JSON.stringify(currentPin)
            )
        } catch (error) {
            console.warn("Não conseguiu guardar pino local")
        }
        return fetch(`${API_URL}/users/${this.state.userID}/surveys`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/json',
                Authorization: `${this.state.userToken}`
            },
            body: JSON.stringify({
                survey:
                {
                    household_id: this.state.householdID,
                    latitude: this.state.userLatitude,
                    longitude: this.state.userLongitude,
                }
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.showAlert(responseJson)
            })

    }

    render() {
        const { showAlert } = this.state;
        const { navigate } = this.props.navigation;

        const welcomeMessage = translate("home.hello") + this.getNameParts(this.state.userName);
        const householdHowYouFellingText = translate("home.householdHowYouFelling_part_1") + this.getNameParts(this.state.householdName) + translate("home.householdHowYouFelling_part_2");
        const householdsData = this.state.data;

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

        const userIsProfessional = (
            <View style={styles.rumorView}>
                <TouchableOpacity
                    //style={{ marginRight: '4%' }}
                    onPress={() => navigate("Rumor")}
                >
                    <Text style={{ color: 'white', fontFamily: 'roboto', marginLeft: '6%' }}>{translate("home.reportRumor")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Alert.alert('', translate("home.reportRumorMessage"), [{ text: 'Ok', onPress: () => null }])}
                >
                    {/* <Text style={{ fontSize: 18, padding: '2%'}}> */}
                    <FontAwesome style={{ marginRight: '2%'}} name="info-circle" size={25} color="white" />
                    {/* </Text> */}
                </TouchableOpacity>
            </View>
        )

        const userNotProfessional = (
            <View style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
                height: '5%',
                justifyContent: 'center',
                width: '35%',
            }}></View>
        )

        let isProfessionalTrue
        if (this.state.isProfessional == "true") {
            isProfessionalTrue = userIsProfessional
        } else {
            isProfessionalTrue = userNotProfessional
            // isProfessionalTrue = userIsProfessional //Para aparecer sempre
        }

        const userHowYouFelling = (
            <Text style={styles.textFelling}>
                {translate("home.userHowYouFelling")}
            </Text>
        )

        const householdHowYouFelling = (
            <Text style={styles.textFelling}>
                {householdHowYouFellingText}
            </Text>
        )

        let howYouFelling;
        if (this.state.householdID !== null) {
            howYouFelling = householdHowYouFelling
        }
        else {
            howYouFelling = userHowYouFelling
        }

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='#348EAC' />

                <View style={styles.viewImage}>
                    {imageType}
                </View>

                <FontAwesome name="bars" onPress={() => this.props.navigation.openDrawer()} size={scale(30)} color='rgba(22, 107, 135, 0.2)' style={{position: 'absolute', left: '3%', top: '2%'}}/>

                <View style={styles.viewWelcome}>
                    <Text style={styles.textHelloUser}>
                        {welcomeMessage}
                    </Text>

                    <Text style={styles.textNewGuardion}>
                        {translate("home.nowAGuardian")}
                    </Text>
                </View>

                <View style={styles.viewHousehold}>
                    <View style={styles.viewHouseholdSelect}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                this.setModalVisible(!this.state.modalVisible); //Exit to modal view
                            }}>
                            <View style={styles.modalView}>
                                <View style={styles.modalViewTop}>
                                    <View style={styles.viewAvatar}>
                                        <Avatar
                                            size="large"
                                            rounded
                                            source={Imagem[this.state.userAvatar]}
                                            activeOpacity={0.7}
                                            onPress={async () => {
                                                await this.setState({ householdID: null, userSelect: this.state.userName, avatarSelect: this.state.userAvatar });
                                                this.setModalVisible(!this.state.modalVisible);
                                                AsyncStorage.setItem('userSelected', this.state.userSelect);
                                                AsyncStorage.setItem('avatarSelected', this.state.avatarSelect);
                                                AsyncStorage.removeItem('householdID');
                                            }}
                                        />
                                        <Text>{this.getNameParts(this.state.userName, true)}</Text>
                                    </View>
                                    <ScrollView horizontal={true}>
                                        {householdsData != null ?
                                            householdsData.map(household => {
                                                return (
                                                    <View style={styles.viewAvatar}>
                                                        <Avatar
                                                            size="large"
                                                            rounded
                                                            source={Imagem[household.picture]}
                                                            activeOpacity={0.7}
                                                            onPress={async () => {
                                                                await this.setState({ householdID: household.id, householdName: household.description, userSelect: household.description, avatarSelect: household.picture });
                                                                this.setModalVisible(!this.state.modalVisible);
                                                                AsyncStorage.setItem('userSelected', this.state.userSelect);
                                                                AsyncStorage.setItem('avatarSelected', this.state.avatarSelect);
                                                                AsyncStorage.setItem('householdID', this.state.householdID.toString());
                                                            }}
                                                        />
                                                        <Text>{this.getNameParts(household.description, true)}</Text>
                                                    </View>
                                                )
                                            })
                                            : null}
                                    </ScrollView>
                                </View>
                                <View style={styles.modalViewBottom}>
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                                        navigate('Household');
                                        this.setModalVisible(!this.state.modalVisible);
                                    }
                                    }>
                                        <FontAwesome name="plus-circle" size={scale(30)} color='rgba(22, 107, 135, 1)' />
                                        <Text>{translate("home.addProfile")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        <Text style={{ marginBottom: 7 }}>{translate("home.selectProfile")}</Text>
                        <Avatar
                            size="large"
                            rounded
                            source={Imagem[this.state.avatarSelect]}
                            activeOpacity={0.7}
                            onPress={() => {
                                this.getHouseholds();
                                this.setModalVisible(true);
                            }}
                        />
                        <Text>{this.getNameParts(this.state.userSelect, true)}</Text>
                    </View>
                    <View style={styles.viewHouseholdAdd}>
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigate('Household')}>
                            <FontAwesome name="plus-circle" size={scale(30)} color='rgba(22, 107, 135, 1)' />
                            <Text>{translate("home.addProfile")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {howYouFelling}

                <View style={styles.viewReport}>
                    <View style={styles.viewChildGood}>
                        <TouchableOpacity //onPress={this._isconnected}
                        onPress={() => this.verifyLocalization()}
                        >
                            <Text style={styles.textChoiceButton}>{translate("report.goodChoice")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewChildBad}>
                        <TouchableOpacity onPress={() => navigate('BadReport')}>
                            <Text style={styles.textChoiceButton}>{translate("report.badChoice")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {isProfessionalTrue}
                <AwesomeAlert
                    show={showAlert}
                    showProgress={this.state.showProgressBar ? true : false}
                    title={this.state.showProgressBar ? translate("badReport.alertMessages.sending") : <Text>{translate("badReport.alertMessages.thanks")} {emojis[1]}{emojis[1]}{emojis[1]}</Text>}
                    message={<Text style={{ alignSelf: 'center' }}>{this.state.alertMessage}</Text>}
                    closeOnTouchOutside={this.state.showProgressBar ? false : true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={this.state.showProgressBar ? false : true}
                    confirmText={translate("badReport.alertMessages.confirmText")}
                    confirmButtonColor='green'
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                    onDismiss={() => this.hideAlert()}
                />
            </View>
        );
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    viewImage: {
        alignItems: 'center',
        justifyContent: 'center',
        //margin: '10%',
        //paddingLeft: '25%',
        //paddingRight: '25%',
        //borderColor: 'red',
        //borderWidth: 1,
    },
    imageLogo: {
        height: scale(120),
        resizeMode: 'contain',
    },
    viewWelcome: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textHelloUser: {
        fontSize: 35,
        fontFamily: 'roboto',
        color: '#166B87',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: '5%'
    },
    textNewGuardion: {
        fontSize: 20,
        fontFamily: 'roboto',
        color: '#166B87',
        alignSelf: 'center',
        textAlign: 'center'
    },
    viewHousehold: {
        flexDirection: 'row',
        width: '85%',
        height: '30%',
    },
    viewHouseholdSelect: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewHouseholdAdd: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textFelling: {
        fontSize: 18,
        fontFamily: 'roboto',
        color: '#166B87'
    },
    viewReport: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        height: '10%',
        marginTop: 5,
        //borderColor: 'red',
        //borderWidth: 1
    },
    viewChildBad: {
        width: '50%',
        borderTopRightRadius: 90,
        borderBottomRightRadius: 90,
        backgroundColor: 'rgba(22, 107, 135, 0.25)',
        justifyContent: 'center',
        borderColor: 'rgba(22, 107, 135, 0.25)',
        borderWidth: 1
    },
    viewChildGood: {
        width: '50%',
        borderTopLeftRadius: 90,
        borderBottomLeftRadius: 90,
        backgroundColor: 'rgba(22, 107, 135, 1)',
        justifyContent: 'center',
        borderColor: 'rgba(22, 107, 135, 1)',
        borderWidth: 1
    },
    textChoiceButton: {
        fontFamily: 'roboto',
        color: 'white',
        fontSize: 27,
        alignSelf: 'center'
    },
    modalView: {
        alignSelf: 'center',
        width: '93%',
        marginTop: scale(210),
        borderRadius: 30,
        backgroundColor: 'white',
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        elevation: 15
    },
    modalViewTop: {
        flexDirection: 'row'
    },
    modalViewBottom: {
        alignItems: 'center',
        marginBottom: 17
    },
    viewAvatar: {
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 17,
        marginBottom: 13
    },
    rumorView: {
        backgroundColor: '#348EAC',
        borderRadius: 90,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        height: '5%',
        justifyContent: 'center',
        //width: '35%',
        alignItems: 'center',
    },
});

//make this component available to the app
export default Home;
