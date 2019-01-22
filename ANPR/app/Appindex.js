import React from 'react';
import {StackNavigator, SwitchNavigator} from 'react-navigation';
import LoginScreen from './Screens/Login/LoginScreen';
import HomeApp from './Screens/Main/MainIndex';
import SplashScreen from './Screens/Splash/Splash';
import {AsyncStorage,NativeModules} from 'react-native';
import firebase from 'react-native-firebase';


NativeModules.ExceptionsManager = null;
console.disableYellowBox = true;
const AuthStack = StackNavigator(
    {
        LogIn: {
            screen: LoginScreen,
            navigationOptions: ({ navigation }) => ({
                header: null,
            })
        }
});

const MainSwitch = SwitchNavigator(
    {
        Splash: SplashScreen,
        App: HomeApp,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Splash',
    }
);

export default class App extends React.Component {

    constructor(Props) {
        super(Props);
        this.state = {
            appToken: "",

        }
    }

    componentWillMount(){
        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    // user has a device token
                    console.log('Firebase',"fcm token : "+fcmToken);
                } else {
                    // user doesn't have a device token yet
                    console.log('Firebase','fcm token not generated');
                }
            });
        
            this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
                // Process your token as required
                console.log('Firebase',"fcm token : "+fcmToken);
            });
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
    }

    render() {
        return <MainSwitch />
    }
}



