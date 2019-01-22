import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  Image,
  StyleSheet,
  View,
  Text,
  ImageBackground
} from 'react-native';
import styles from './../../styles';
 import colors from './../../colors';
 import ProgressBar from 'react-native-progress/Bar';
 import LinearGradient from 'react-native-linear-gradient';

export default class SplashScreen extends React.Component {
  
  state={
    ready: false,
    }

  constructor(props) {
      super(props);
    }
  
    componentWillMount(){
      //this._loadInitialState();
          this.GetNodeUrl();
          setTimeout(() => this._bootstrapAsync(),2000);
      }



      GetNodeUrl(){
        // console.log("inside node url")
        //  fetch('http://app.maintick.com/Json/GetNodeServerURL',{
        //   method: 'POST',
        //   headers:{
        //     Accept:'applictaion/json',
        //     'Content-Type':'applictaion/json'
        //  }
        //})
       // .then((response)=> response.json())
       // .then((responseJson)=>{
          //console.log("dynamic url",responseJson);
          var data ={
              //"NodeURL":"http://anprlive.dsolve.in/MobileAPI/",
              //"NodeURL":"http://59.92.3.23:81/MobileAPI/",
              "NodeURL":"https://mppvdp.com/MobileAPI/",
              "Type":"API"
            }
          console.log("static url",data);

          // AsyncStorage.setItem("NodeUrl",JSON.stringify(responseJson));
          AsyncStorage.setItem("NodeUrl",JSON.stringify(data));
          return data;
        //}) 
       // .catch((error) => {
        //  console.error(error);
       // });
      }

     

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('isLogin');
      console.log('islogin',userToken);
  
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };
  
    // Render any loading content that you like here
    render() {
      return (
        <View style={styles.container}>

        <StatusBar hidden backgroundColor={colors.colorPrimaryDark} barStyle='dark-content' />
        <ImageBackground 
         imageStyle={{resizeMode:'stretch'}}
         style={{flex:1,
                top:0,
                left:0,
                width:"100%",
                height:"100%",
                justifyContent:"center",
                alignItems:"center", }}
         source={require('../../assets/map.jpg')}>
          {/* <LinearGradient
            colors={['#ffffff', '#abb3d5', '#314399']}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 0.5, y: 1.0 }}
            style={{ flex: 1, width: '100%' }}> */}

         <View 
         style={{ flex: 1,width:"100%" , justifyContent:"center",
                alignItems:"center",marginTop:50}}>
          <View 
          style={{ flex: 1, flexDirection:'column', alignItems: 'center' }}>
        
            <Image
              style={{resizeMode:'stretch',width:275,height:350}}
              source={require('../../assets/logo_bd.png')} />

            

          </View>
          
          <View style={{marginBottom:50, flexDirection:'column', alignItems: 'center' }}>

            <Text style={{marginBottom:10,color:colors.headerColor,fontSize:18}}>MP POLICE VEHICLE DETECTION PORTAL</Text>

          <ProgressBar

           animationType={"decay"}
           borderRadius={5}
           borderColor={"transparent"}
           unfilledColor={'#fafafa40'}
           indeterminate={true}
           color={colors.statusColor}
           width={300} />
            
          </View>
          </View>
          </ImageBackground>
          {/* </LinearGradient> */}
        </View>
      );
    }
  }