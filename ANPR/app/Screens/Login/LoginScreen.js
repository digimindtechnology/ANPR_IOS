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
  Modal,
  TouchableOpacity,
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
      shaPassword:'',
      shaltKey:'',
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
      modelOTPAuth:false,
      OTP:'',
      userDetail:'',
      resendButton:true,
      loading_message:'Loading...',
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
  ////////Encryption Function start////////

  
SHA256(s,key) {
 
var chrsz = 8;
var hexcase = 0;

function safe_add (x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF);
var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}

function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
function R (X, n) { return ( X >>> n ); }
function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

function core_sha256 (m, l) {
var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
var W = new Array(64);
var a, b, c, d, e, f, g, h, i, j;
var T1, T2;

m[l >> 5] |= 0x80 << (24 - l % 32);
m[((l + 64 >> 9) << 4) + 15] = l;

for ( var i = 0; i<m.length; i+=16 ) {
a = HASH[0];
b = HASH[1];
c = HASH[2];
d = HASH[3];
e = HASH[4];
f = HASH[5];
g = HASH[6];
h = HASH[7];

for ( var j = 0; j<64; j++) {
if (j < 16) W[j] = m[j + i];
else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
T2 = safe_add(Sigma0256(a), Maj(a, b, c));

h = g;
g = f;
f = e;
e = safe_add(d, T1);
d = c;
c = b;
b = a;
a = safe_add(T1, T2);
}

HASH[0] = safe_add(a, HASH[0]);
HASH[1] = safe_add(b, HASH[1]);
HASH[2] = safe_add(c, HASH[2]);
HASH[3] = safe_add(d, HASH[3]);
HASH[4] = safe_add(e, HASH[4]);
HASH[5] = safe_add(f, HASH[5]);
HASH[6] = safe_add(g, HASH[6]);
HASH[7] = safe_add(h, HASH[7]);
}
return HASH;
}

function str2binb (str) {
var bin = Array();
var mask = (1 << chrsz) - 1;
for(var i = 0; i < str.length * chrsz; i += chrsz) {
bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
}
return bin;
}

function Utf8Encode(string) {
string = string.replace(`/\r\n/g`,'\n');
var utftext = '';

for (var n = 0; n < string.length; n++) {

var c = string.charCodeAt(n);

if (c < 128) {
utftext += String.fromCharCode(c);
}
else if((c > 127) && (c < 2048)) {
utftext += String.fromCharCode((c >> 6) | 192);
utftext += String.fromCharCode((c & 63) | 128);
}
else {
utftext += String.fromCharCode((c >> 12) | 224);
utftext += String.fromCharCode(((c >> 6) & 63) | 128);
utftext += String.fromCharCode((c & 63) | 128);
}

}

return utftext;
}

  function binb2hex(binarray)
  {
   var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
   var str = '';
   for(var i = 0; i < binarray.length * 4; i++) {
   str += hex_tab.charAt((binarray[i>>2] >> ((3 - i % 4)*8+4)) & 0xF) +
   hex_tab.charAt((binarray[i>>2] >> ((3 - i % 4)*8 )) & 0xF);
   }
   return str;
  }
  s = Utf8Encode(s);
  s=  binb2hex(core_sha256(str2binb(s), s.length * chrsz))
  if (key != '' && key != null && key != 'undefined') {
      key = Utf8Encode(key);
      key = binb2hex(core_sha256(str2binb(key), key.length * chrsz))
      s = s + key;
  }
  return s;
 //return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

  ////////Encryption Function end////////

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

    var randomNumber=Math.floor(1000 + Math.random() * 9000).toString();
    console.log('randomNumber:',randomNumber);
   var shaPassword= this.SHA256(password,randomNumber);
   //this.setState({shaPassword:shaValue,key:randomNumber});
   
    console.log('shaPassword:',shaPassword);
   // console.log('key:',this.state.key);

    //this.setState({ isLoading: true });
    // Simulate an API call
  //  setTimeout(() => {
   //   LayoutAnimation.easeInEaseOut();
      this.setState({
       // isLoading: false,
        isLoginValid: this.validateLoginId(loginId) || this.userInput.shake(),
        isPasswordValid: password.length >=1 || this.passwordInput.shake(),
      });
      if(this.state.isLoginValid && this.state.isPasswordValid){
        this.getLoginInfo(loginId,shaPassword,randomNumber);
        //this.props.navigation.navigate("App");
      }else{
        this.setState({isLoading:false});
      }
      //this.props.navigation.navigate("App");
   // }, 0);
  }

  getLoginInfo = (loginid,shaPassword,key)=>{
    // console.log('Imei',IMEI.getImei());

    const data = {
      "loginId":loginid,
      "Pwd":shaPassword,
      "TokenNumber":this.state.token,
      "ImeiNumber":"",
      "OsVersion":"",
      "AuthKey":"MPP0L1CERHQ",
      "SaltKey":key
    }
  
    //this.setState({ isLoading: true })   
    console.log('data',data);
   // this.setState({ isLoading: true }) 
     Api.UserLogin(data).then(res => {
       
         console.log('loginresponse',JSON.stringify(res));
         this.setState({ isLoading: false })   
       if (res) {
         if (res.MessageType != 0) {
           // this.displayToast("Invalid Credentials!!","danger");
           Toast.show('Invalid Credentials!!');
           this.setState({ isLoading: false })
         } else {
         // this._signInAsync(res.Object);
         if(res.Object.is_otp_required==false){
             this._signInAsync(res.Object);
         }else{
          this.setState({userDetail:res.Object,modelOTPAuth:true});
          console.log('userDetail',this.state.userDetail);
          setTimeout(()=>this.setState({resendButton:false}),30000);
         }
         
         }
       }else{
        Toast.show('Login error..!!!');
        this.setState({ isLoading: false })
       }
     }).catch(err =>{
 
         console.log('loginerror',err)
         Toast.show("Please check network connection..");
         this.setState({isLoading:false})
     })
   }

   postOTP(){
   const data={
      userid:this.state.userDetail.UserID,
      OTP:this.state.OTP,
      AuthKey:'MPP0L1CERHQ'
     }
     console.log('postOTP data',data);
     this.setState({isLoading:true});
     Api.PostOTP(data).then(res=>{
      this.setState({isLoading:false});
      console.log('postOTP res',res);
      if(res){
        if(res.MessageType==0){
          this.setState({modelOTPAuth:false});
          this._signInAsync(this.state.userDetail);
          Toast.show(res.Message);
        }else{
          Toast.show('Invalid OTP..!!');
           this.setState({ isLoading: false })
        }

      }else{
        Toast.show('Login error..!!!');
        this.setState({ isLoading: false })
       }

     }).catch(err=>{
       console.log('PostOTP error:',err);
       Toast.show("Please check network connection..");
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


                    <LoginButton
                      onPress={()=>{this.requestPhonePermission(),Keyboard.dismiss()}} 
                      //onPress={()=>{this.setState({modelOTPAuth:true})}} 
                      />
              
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>                  

                   </View>
                
                </View>
               </View>          

              <View style={{ alignItems: 'center', justifyContent:'center', flex: 1, flexDirection: 'column',marginTop:30 }}>
             
                <Image style={{ width:80, resizeMode:"contain"}}
                      source={require('../../assets/DMT.png')} />                   
              </View>
            </View>
          :
          <Text>Loading...</Text>
        }


        </ImageBackground>
        {/* </LinearGradient> */}

       {/* model for OTP Authentication */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modelOTPAuth}
          onRequestClose={() => {
            this.setState({ modelOTPAuth: false })
          }}>  
          
           <View style={{ flex: 1, 
                         backgroundColor: '#00000070',
                         justifyContent:'center',
                         alignItems:'center',
                         alignContent:'center'}}>          
              <View style={{width:'95%',backgroundColor:'white',borderRadius:5,padding:10}}>
                <View style={{width:'100%',alignItems:'center'}}>
                <Text style={{fontSize:16,color:'#00b300',textAlign:'center'}}>OTP has sent to registered mobile number<Text> {this.state.userDetail.Mobile}</Text>
                </Text>
                <Text style={{fontSize:15}}>
                  {this.state.userDetail.FullName}
                </Text>
                </View>

                <View style={{alignItems:'center'}}>                
                <Input
                 inputContainerStyle={styles.input_container_style1}
                 inputStyle={styles.input_style1}
                 autoFocus={false}
                 autoCapitalize="none"
                 keyboardType="phone-pad"
                 maxLength={10}
                 keyboardAppearance="dark"
                 keyboardavoidingview={true}
                 errorStyle={styles.errorInputStyle1}
                 autoCorrect={false}
                 blurOnSubmit={false}
                 placeholder="OTP"
                 //placeholderTextColor="#000000"
                 onSubmitEditing={()=>{Keyboard.dismiss()}}
                 leftIcon={<FontAwesome name='mobile' size={25} color='#1d3d78' />}
                 onChangeText={otp => this.setState({ OTP:otp })}
                />               
                </View>

               <View style={{flexDirection:'row',marginTop:30,width:'100%'}}> 
                 <View style={{width:'50%',alignItems:'flex-start'}}>
                 <Button
                   title="Resend OTP"
                   //ViewComponent={require('react-native-linear-gradient').default}
                   containerViewStyle={{borderRadius:10}}
                   buttonStyle={[{width:200, height:50, marginTop:10,marginBottom:10,borderRadius:40,backgroundColor:'#fc4236' }]}
                   disabledStyle={{backgroundColor:'#b3b3b3'}}

                   disabled={this.state.resendButton}
                   
                   onPress={()=>{this.login()}}
                />
                </View>
                <View style={{width:'50%',alignItems:'flex-end'}}>
                 <Button
                   title="Submit"
                   //ViewComponent={require('react-native-linear-gradient').default}
                   containerViewStyle={{borderRadius:10}}
                   buttonStyle={[{width:200, height:50, marginTop:10,marginBottom:10,borderRadius:40,backgroundColor:'#fc4236' }]}
                   disabledStyle={{backgroundColor:'#b3b3b3'}}
                   //disabled={props.disabled}
                   
                   onPress={()=>{this.postOTP()}}
                />
                </View>
               </View>

              </View>
       
           </View>
       </Modal>       
     {/* model for OTP Authentication */}

     {/* {this.state.isLoading?
                          <View style={{flex:1, elevation:2, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center',
                           justifyContent: 'center', position: 'absolute', width: '100%', height: '100%' }}>
                              <ActivityIndicator color='white' size='large' />
                              <Text style={commonStyle.loading_text}>{this.state.loading_message}</Text>
                          </View> : null} */}
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
  input_style1:{
    backgroundColor:'#ffffff00', 
    color:'#000', 
    padding:10,
    height:50,
    marginLeft:0,
  },
  input_container_style1:{
    backgroundColor:'#ffffff',
    marginTop:30,
    borderColor: '#314399',
    borderWidth:1,
    borderRadius: 5,
  },
  errorInputStyle1: {
    marginTop: 0,
    textAlign: 'center',
    color: '#F44336',
  },
  // placehodr:{
  //   placeholderTextColor:"#000",
  // }
});


  
