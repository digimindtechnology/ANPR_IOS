import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  Platform,
  PermissionsAndroid,
  StatusBar,
  Button,
  NetInfo,
  Linking,Keyboard,
  Dimensions,
  LayoutAnimation,
  UIManager,
  AsyncStorage,
  KeyboardAvoidingView,
} from 'react-native';
import { Input, 
  //Button,
   Icon } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
//import { Item } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../colors';
import API from '../../config/API';
import FormInput from '../../Components/FormInput';
import {SubmitButton, LoginButton} from '../../Components/Button';
import firebase from 'react-native-firebase';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../../assets/back1.jpg');

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  && UIManager.setLayoutAnimationEnabledExperimental(true);


var Api = null;

export default class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loginId: '',
      password: '',
      fontLoaded: false,
      selectedCategory: 0,
      isLoading: false,
      isLoginValid: true,
      isPasswordValid: true,
      isConfirmationValid: true,
      token:'',
      imei:'',
      isPasswordSecure: true,
      isConnected: false,
    };
  }

  handleConnectivityChange = (isConnected) => {
    if (isConnected) {
    this.setState({ isConnected });
    } else {
    this.setState({ isConnected });
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }


   async componentWillMount(){

    firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    // user has a device token
                    console.log('Firebase',"fcm token : "+fcmToken);
                    this.setState({token:fcmToken});
                } else {
                    // user doesn't have a device token yet
                    console.log('Firebase','fcm token not generated');
                }
            });

    var NodeInfo = JSON.parse(await AsyncStorage.getItem('NodeUrl'));
      console.log("nodeinfo",NodeInfo.NodeURL);

      NetInfo.getConnectionInfo().then((connectionInfo) => {
        console.log('connection',connectionInfo);
        if(connectionInfo!="none" && connectionInfo!="unknown" ){
          this.setState({isConnected:true})
        }else{
          Toast.show("No Internet Connection!!");
        }
      });

      Api = new API(NodeInfo.NodeURL);

  }



  componentDidMount() {
    this.setState({ fontLoaded: true });
  }

  async requestPhonePermission() {
    console.log(Platform.Version)
    if(Platform.Version>22){
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
        )
        // const granted2 = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        // )
        if (granted === PermissionsAndroid.RESULTS.GRANTED )
          //&& granted2 === PermissionsAndroid.RESULTS.GRANTED)
        {
       
          if(this.state.isConnected){
            this.login();
            // this.props.navigation.navigate('ALERT',
            // // {fromLogin:true}
            // );
          }else{
            Toast.show("No Internet Connection");
          }
         
        } else {
          console.log("permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
    }else{
      // this.props.navigation.navigate('Home',
      //       // {fromLogin:true}
      //       );
      this.login();
    }
  }
  

  validateLoginId(loginid) {
    return loginid == ''?false:true;
  }

  togglePasswordVisibility(){
    this.setState({isPasswordSecure: !this.state.isPasswordSecure});
  }

  login() {
    const {
      loginId,
      password,
    } = this.state;
    this.setState({ isLoading: true });
    // Simulate an API call
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({
       // isLoading: false,
        isLoginValid: this.validateLoginId(loginId) || this.userInput.shake(),
        isPasswordValid: password.length >=1 || this.passwordInput.shake(),
      });
      if(this.state.isLoginValid && this.state.isPasswordValid){
        this.getLoginInfo(loginId,password);
        //this.props.navigation.navigate("App");
      }else{
        this.setState({isLoading:false});
      }
      //this.props.navigation.navigate("App");
    }, 0);
  }

  getLoginInfo = (loginid,password)=>{
    // console.log('Imei',IMEI.getImei());

    const data = {
      "loginId":loginid,
      "Pwd":password,
      "TokenNumber":this.state.fcmToken,
      "ImeiNumber":"",
      "OsVersion":"",
      "AuthKey":"MPP0L1CERHQ",
    }

    console.log('data',data);

     Api.UserLogin(data).then(res => {
       
         console.log('loginresponse',JSON.stringify(res));
            
       if (res) {
         if (res.MessageType != 0) {
           // this.displayToast("Invalid Credentials!!","danger");
           Toast.show('Invalid Credentials!!');
           this.setState({ isLoading: false })
         } else {
           this._signInAsync(res.Object);
         }
       }else{
        Toast.show('Login error !!!');
       }
     }).catch(err =>{
 
         console.log('loginerror',err)
         Toast.show("Please check network connection");
         this.setState({isLoading:false})
     })
   }
 
 _signInAsync = async (res) => {
   try{
        console.log('sign response',res);
        AsyncStorage.setItem('userLoginDetail', JSON.stringify(res));
        
       // await AsyncStorage.multiSet([['userLoginDetail', JSON.stringify(res[0])],['islogin',true]])
        AsyncStorage.setItem('isLogin', 'true');
       //await this.saveLoginState();
       Toast.show("Login Successfull!!!")
       this.props.navigation.navigate('ANPRLOG',{fromLogin:true});
 
   }catch(error){}
 };


  render() {
    const {
      selectedCategory,
      isLoading,
      isLoginValid,
      isPasswordValid,
      isConfirmationValid,
      loginId,
      password,
      passwordConfirmation,
    } = this.state;
    const isLoginPage = selectedCategory === 0;
    const isSignUpPage = selectedCategory === 1;
    return (
     
      <View style={styles.container}>
       <StatusBar hidden/>
        <ImageBackground
          style={styles.bgImage}
          source={require('../../assets/map.jpg')}>
          {/* <LinearGradient  colors={['#560eea','#5c33ad', '#55025a']} style={styles.linearGradient}> */}
          {/* <LinearGradient  colors={['#ffffff', '#ffffff', '#ffffff']} style={styles.linearGradient}> */}
          {this.state.fontLoaded ?
            <View style={{flex:1, width:"100%", alignItems:'center',justifyContent:'center',backgroundColor:"#00000000"}}>
             
              <View style={styles.loginContainer}>
                <View style={styles.titleContainer}>
                  <View style={{flexDirection: 'column',marginTop:50,alignItems:'center'}}>
                  <Image
                      style={{width:150, height:150, resizeMode:"contain"}}
                      source={require('../../assets/logo_bd.png')}
                    />

                    <Text style={{marginTop:10,color:colors.headerColor,fontSize:18,textAlign:'center'}}>MP POLICE VEHICLE DETECTION PORTAL</Text>
                  
                  </View>
              
                 </View>  
                
               
                <View style={styles.formContainer}>
               
                
                  <FormInput 
                  //style={styles.placehodr}
                    refInput={input => this.userInput = input}
                    value={this.state.loginId}
                    onChangeText={loginId => this.setState({ loginId })}
                    placeholder="User Name"
                    returnKeyType="next"
                    leftIcon={<FontAwesome name='user-o' size={20} color='#1d3d78' />}
                    errorMessage={isLoginValid ? null : 'Please enter login id'}
                    onSubmitEditing={() => {
                      this.validateLoginId()
                      this.passwordInput.focus()
                    }}
                  /> 

                  <FormInput
                    refInput={input => this.passwordInput = input}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    placeholder="Password"
                    returnKeyType="next"
                    secureTextEntry={this.state.isPasswordSecure}
                    errorMessage={isPasswordValid ? null : 'Please enter password'}
                    leftIcon={<MaterialCommunityIcons name='lock-outline' size={20} color='#1d3d78' />}
                    rightIcon={<Entypo onPress={()=>this.togglePasswordVisibility()} name={this.state.isPasswordSecure?"eye-with-line":"eye"} color='#1d3d78' size={20} />}
                    rightIconContainerStyle={{backgroundColor:'#ffffff00',height:50,padding:10}}
                    onSubmitEditing={() => {
                      this.requestPhonePermission(),Keyboard.dismiss()
                    }}
                  />


                    {/* <Button
                      buttonStyle={styles.loginButton}
                      containerStyle={{marginVertical:10, marginTop: 32, flex: 0}}
                      activeOpacity={0.8}
                      title={'Log in'}
                      onPress={()=> {this.requestPhonePermission(),Keyboard.dismiss()}}
                      titleStyle={styles.loginTextButton}
                      loading={isLoading}
                      disabled={isLoading}
                    /> */}

                    <LoginButton
                      onPress={()=>{this.requestPhonePermission(),Keyboard.dismiss()}} />
              
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    
                    {/* <Button
                      title={'Forgot your login details? get help signing in'}
                      titleStyle={{ color: 'white',fontWeight:'normal', fontSize:12 }}
                      buttonStyle={{ backgroundColor: 'transparent', marginTop: 15 }}
                      disabled={isLoading}
                      clear
                      activeOpacity={0.7}
                      underlayColor='transparent'
                      onPress={() => this.props.navigation.navigate('ForgotPass')}
                    /> */}

                  </View>
                
                </View>

               </View>
           

              <View style={{ alignItems: 'center', justifyContent:'center', flex: 1, flexDirection: 'column',marginTop:30 }}>
                {/* <View style={{ width: '100%', justifyContent: 'center', backgroundColor: '#ffffff40' }}>
                  <View style={{ backgroundColor: '#ffffff90', height: 0.5, width: '100%' }} />
                  <Button
                  //title={'MainTick Copyright © 2018 All Rights Reserved.'}
                  title={'Dont`t have account ? Sign up'}
                  titleStyle={{color: 'white',fontWeight:'normal',fontSize:12} }
                  buttonStyle={{backgroundColor: 'transparent',margin:5}}
                  disabled={isLoading}
                  clear
                  underlayColor='transparent'
                  onPress={() => Linking.openURL('http://app.maintick.com/')}
                />
                </View> */}

                {/* <Text style={{ color:'#fff', fontSize:16}}>Designed and Developed By</Text> */}

                <Image style={{ width:80, resizeMode:"contain"}}
                      source={require('../../assets/DMT.png')} />
                      {/* <Image style={{ width:80, resizeMode:"contain",marginTop:250}}
                      source={require('../../assets/DMT.png')} /> */}

              </View>
            </View>
          :
          <Text>Loading...</Text>
        }
        </ImageBackground>
        {/* </LinearGradient> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    },
    input_style:{
      backgroundColor:'#ffffff40', 
      color:'#fff', 
      padding:10,
      height:50,
      marginLeft:0,
    //   flex: 1,
    // marginLeft: 10,
    // color: 'white',
    // fontFamily: 'light',
    // fontSize: 16,
    },
    input_container_style:{
      backgroundColor:'#ffffff00',
      marginTop:30,
      borderColor: '#bf8cce',
      borderWidth:1,
      borderRadius: 5,
    //   paddingLeft: 8,
    // borderRadius: 40,
    // borderWidth: 1,
    // borderColor: 'rgba(110, 120, 170, 1)',
    // height: 45,
    // marginVertical: 10,
    },
  rowSelector: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selected: {
    position: 'absolute',
    borderRadius: 50,
    height: 0,
    width: 0,
    top: -5,
    borderRightWidth: 70,
    borderBottomWidth: 70,
    borderColor: 'white',
    backgroundColor: '#50ffffff',
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  loginTextButton: {
    fontSize: 16,
    color: '#e8e8e8',
    fontWeight: 'normal',
  },
  loginButton: {
    backgroundColor: 'red',
    borderColor: 'transparent',
    borderWidth:0,
    borderRadius: 25,
    height: 50,
    width: SCREEN_WIDTH - 60,
  },
  titleContainer: {
    height: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff00',
    width: SCREEN_WIDTH - 30,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems:'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#551273'
  },
  categoryText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    fontFamily: 'light',
    backgroundColor: 'transparent',
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: 'white',
    fontSize: 30,
    // fontFamily: 'regular',
  },
  helpContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // placehodr:{
  //   placeholderTextColor:"#000",
  // }
});


  
