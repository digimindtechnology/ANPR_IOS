/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View,Text, ScrollView, TextInput, Image, AsyncStorage, NetInfo, ActivityIndicator, Modal, TouchableOpacity, RefreshControl} from 'react-native';
import { Card, Icon, Input, Button, ListItem, Avatar} from 'react-native-elements';
import ProjectListComponent from '../../Components/ProjectListComponent';
import CustomHeader from '../../Components/Header';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import API from '../../config/API';
import Toast from 'react-native-simple-toast';
import FormInput from '../../Components/FormInput';
import moment from 'moment-timezone';
import commonStyle from '../../styles';
import LabelView from '../../Components/LabelView';
import colors from '../../colors';

var Api = null;

const headerComponents = {
  title: { text: 'HONEYWELL', style: { color: '#fff', fontSize: 20,fontFamily:'Montserrat-Regular' } },
  right: function () {
    return <Feather name="more-vertical" color="#fff" size={18} onPress={()=>this.logout()}/>;
  },
  left: function (){
    return <Image
      style={{ width: 40,height:40, resizeMode: 'center' }}
      source={require('../../assets/logo_bd.png')} />
    // <Entypo name='menu' color="#fff" size={25} />
  }
}

//var userInfo = null;
export default class OwnerDetails extends Component {

  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props)
    this.state={
      loading:true,
      loading_message:'Loading...',
      isConnected : false,
      projectData : [],
      userData : [],
      userInfo : "",
      profileloading : true,
      companyLogo : '',
      modalVisible : false,
      refreshing : false,
      registration_number: null,
      vehicle_Detail:this.props.navigation.getParam('owner_data'),
      items:''
    }
    this.reload = this.reload.bind(this);
    this._didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        console.log('didFocus', payload);
        console.log('didFocus','screen focused')
        // if(userInfo){
        //   this.getProjectInfo(userInfo);
        // }
      }
    );
  }

  static navigationOptions = ({ navigation }) => {
    return {
        title:navigation.getParam('owner_data').REGISTRATION_NO,
        headerStyle: {backgroundColor: colors.headerColor},
        headerTintColor: '#fff',
    }
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
    //_didFocusSubscription.remove();
  }


  async componentWillMount() {
    var NodeInfo = JSON.parse(await AsyncStorage.getItem('NodeUrl'));
    console.log("nodeinfo", NodeInfo.NodeURL);
    this.setState({registration_number:this.state.vehicle_Detail.REGISTRATION_NO});
    console.log("REGISTRATION_NO", this.state.registration_number);
    Api = new API(NodeInfo.NodeURL);
    this._getUserDetails();

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('connection', connectionInfo);
      if (connectionInfo != "none" && connectionInfo != "unknown") {
        this.setState({ isConnected: true })
      } else {
        Toast.show("No Internet Connection!!");
      }
    });
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  navigateNow(data) {
    // console.log('navigate props',data);
    this.props.navigation.navigate('Dashboard', { data: data })
    // this.props.navigation.navigate('TicketDetail',{data:'1012'})
  }

  logout(){
    this.setState({
      modalVisible :true
    })
  }

  processLogout(){
      this.setState({modalVisible:false})
      this.props.navigation.navigate('LogIn');
      AsyncStorage.removeItem("isLogin").then(()=>{
          console.log('remove item','logoutsuccess')
          Toast.show('Logout Succesfull!!');
      })
  }

  _getUserDetails = async () => {
    AsyncStorage.getItem('userLoginDetail').then(data => {
      console.log('login details', data);
      var dt = JSON.parse(data);
      // userInfo = dt;
      this.setState({userInfo: dt});
      console.log('dt',dt);
      //this.getMpTransPortData(dt,this.props.navigation.getParam('vehicle_data').LicenseNum);
      
      this.getMpTransPortData();
    }).catch(err=>console.log('error occurred in user detail',err));
  }
  getMpTransPortData = () => {
    const data = {
      registration_number:this.state.registration_number.trim(),
      user_id:this.state.userInfo.UserID,
      company_id:this.state.userInfo.CompanyID,
      AuthKey:"MPP0L1CERHQ"
    }
    
    console.log('data',data);
    this.showProgress(true);
    Api.MpTransPortData(data).then(res => {
       
      console.log('MpTransPortData',res);
      this.showProgress(false); 
    if (res) {
      this.setState({items:res.Object});
      console.log('items',this.state.items);
      this.showProgress(false);
    }else{
      this.showProgress(false);
     Toast.show('We\'re facing some technical issues!');
    }
  }).catch(err =>{
       this.showProgress(false);
      console.log('userinfoerror',err)
      Toast.show("Please check network connection");
      this.setState({profileloading:false})
  })
  }

 _onRefresh = () => {
  this.setState({refreshing: true});
  setTimeout(() => this.setState({refreshing:false}),2000);
}
//comment

reload = () => {
  this.getMpTransPortData()
}

getDatefromMilliseconds(data){
  var milis = '';
  milis = data.substring(data.indexOf('(')+1,data.lastIndexOf(')'));
  console.log('milis',milis);
  return moment(milis,"x").format("DD-MMM-YYYY");
}

  
  render() {
    const {userInfo} = this.state;
    return (
      <View style={{ flex: 1 }}>
        {/* <CustomHeader height={1} leftComponent={(headerComponents.left)} title={userInfo.FullName?userInfo.FullName:'Vehicle List'} rightComponent={
          <Feather name="more-vertical" style={{ padding: 10 }} color="#fff" size={18} onPress={() => this.logout()} />
        } logout={() => this.logout()} /> */}

        <View style={{ flex:1,marginTop:10 }}>
          <ScrollView style={{ flex: 1 }}
            contentContainerStyle={{padding:10}}
            // refreshControl={
            //   <RefreshControl
            //     onRefresh={this._onRefresh.bind(this)}
            //     refreshing={this.state.refreshing}
            //     enabled={true}
            //   />
            // }
          >
      
         {this.state.items && this.state.items!=="" ?
         
          <View style={{height:'100%',width:'100%'}}>
             <LabelView label='Owners Detail' style={{backgroundColor:'white'}}>
                <View style={{borderRadius:5,opacity:5,padding:5}}>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Owners Name</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.OWNERS_NAME}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Father/Husband Name</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.FATHER_HUSBAND_NAME}</Text>
                        </View>
                   </View>
                   
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Permanent Address</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.PARMANENT_ADDRESS}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Temporary Address</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.TEMPORARY_ADDRESS}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>City Name</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.CITY_NAME}</Text>
                        </View>
                   </View> 
                        
              </View> 
                                        
          </LabelView>
             
           <LabelView label='Registration Detail' style={{backgroundColor:'white'}}>
                <View style={{borderRadius:5,opacity:5,padding:5}}>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Registration No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.items.REGISTRATION_NO}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Registration Date</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.items.REGISTRATION_DATE?this.getDatefromMilliseconds(this.state.items.REGISTRATION_DATE):''}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Issue Date</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.ISSUE_DATE?this.getDatefromMilliseconds(this.state.items.ISSUE_DATE):''}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Registration Expire</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.REGISTRATION_EXPIRY?this.getDatefromMilliseconds(this.state.items.REGISTRATION_EXPIRY):""}</Text>
                        </View>
                   </View>  
              </View> 
                                        
          </LabelView>
          <LabelView label='Vehicle Detail' style={{backgroundColor:'white'}}>
                <View style={{borderRadius:5,opacity:5,padding:5}}>
                  <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Maker Name</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.items.MAKER_NAME}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Maker Classification</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.items.MAKER_CLASSIFICATION}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Class</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.items.CLASS}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Year of Manufacture</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.items.YEAR_OF_MANUFACTURE?this.getDatefromMilliseconds(this.state.items.YEAR_OF_MANUFACTURE):""}</Text>
                        </View>
                   </View>    
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Chassis No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.items.CHASSIS_NO}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Fuel Type</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.FUEL}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Engine No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.ENGINE_NO}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Horse Power</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.HORSE_POWER}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Wheelbase</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.WHEELBASE}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>GVW Registred</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.GVW_REGISTERED}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>GVW by Manufacture</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.GVW_BY_MANUFACTURE}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Laden Weight</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.LADEN_WEIGHT}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Color</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.COLOR}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>ULW</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.ULW}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>BTM Desc</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.BTM_DESC}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>CC</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.CC}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>No of Cylender</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.NO_OF_CYLENDER}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>RET Desc</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.RET_DESC}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Standard Seating Capacity</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.STANDARD_SEATING_CAPACITY}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Sleeping Capacity</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.SLEEPING_CAPACITY}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>LPG Tank No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.LPG_TANK_NO}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>LPG Toolkit No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.items.LPG_TOOLKIT_NO}</Text>
                        </View>
                   </View>                                                           
              </View> 
                                        
          </LabelView>
        
          </View>
          :
          <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                <Image
                  style={{ width: '100%', resizeMode: "contain",opacity:.2}}
                  source={require('../../assets/logo_bd.png')}
                />
          </View>
          }
          
          </ScrollView>
        </View>
        {/* model for logout and options */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
          <View style={{ flex: 1, backgroundColor: '#00000040', }}>

            <View style={{ flex: 1 }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ modalVisible: false }); console.log('onTouch', 'Touched') }} />
            </View>

            <View style={{ height: 100, backgroundColor: 'white' }}>

              <View style={{ flex: 1, flexDirection: "row" }}>
                {/* <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                                          <TouchableOpacity activeOpacity={1} onPress={()=> this.props.navigation.navigate('Profile',this.setState({modalVisible:false}))} >
                                              <Card containerStyle={[styles.cardstyle2, { alignSelf: "center", backgroundColor: "#8342f4" }]}>
                                                  <FontAwesome name='user' color='white' size={20} />
                                              </Card>
                                              <Text style={{ textAlign: "center" }}>My Profile</Text>
                                          </TouchableOpacity>
                                      </View> */}

                {/* <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                                          <TouchableOpacity activeOpacity={1} onPress={()=>this.props.navigation.navigate('ChangePassword',{reloadworkorder:this.GetProjectTicketCount},this.setState({modalVisible:false}))} >
                                              <Card containerStyle={[styles.cardstyle2, { alignSelf: "center", backgroundColor: "#8342f4" }]}>
                                                  <MaterialCommunityIcons name='key-change' color='white' size={20} />
                                              </Card>
                                              <Text style={{ textAlign: "center" }}>Change Password</Text>
                                          </TouchableOpacity>
                                      </View> */}

                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                  <TouchableOpacity activeOpacity={1}
                    onPress={() => this.processLogout()}>
                    <Card containerStyle={[styles.cardstyle2, { alignSelf: "center", backgroundColor: "#8342f4" }]}>
                      <FontAwesome name='power-off' color='white' size={20} />
                    </Card>
                    <Text style={{ textAlign: "center", fontFamily: 'Montserrat-Regular' }}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        </Modal>
        {/* model ends for logout and options */}

        {this.state.isLoading?
                          <View style={{flex:1, elevation:2, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center',
                           justifyContent: 'center', position: 'absolute', width: '100%', height: '100%' }}>
                              <ActivityIndicator color='white' size='large' />
                              <Text style={commonStyle.loading_text}>{this.state.loading_message}</Text>
                          </View> : null}

      </View >
    );
  }
}

const styles = StyleSheet.create({
  input_style:{
    backgroundColor:'#ffffff00', 
    color:'#000', 
    padding:10,
    marginLeft:0,
  },
  input_container_style:{
    backgroundColor:'#ffffff40',
    marginTop:10,
    // borderColor: '#bf8cce',
    // borderWidth:1,
    // borderRadius: 1,
  },
  errorInputStyle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#F44336',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  linearGradient: {
    flex: 1,
  },
  cardstyle2:{
    width:50,
    height:50,
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center'
 }
});
