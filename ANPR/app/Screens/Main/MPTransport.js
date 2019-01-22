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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import API from '../../config/API';
import Toast from 'react-native-simple-toast';
import FormInput from '../../Components/FormInput';
import moment from 'moment-timezone';
import commonStyle from '../../styles';
import LabelView from '../../Components/LabelView';
import colors from '../../colors';

import CodeInput from 'react-native-confirmation-code-input';

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
export default class MPTransport extends Component {

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
      vehicle_Detail:'',
      state_name:'',
      state_code:'',
      ref_code: '',
      num: '',
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
      // this.getVehicleHistoricalLocationList(dt);
      
    }).catch(err=>console.log('error occurred in user detail',err));
  }
  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getMpTransPortData = () => {

    var registration_number = this.state.state_name+this.state.state_code+this.state.ref_code+this.state.num;

    if(registration_number.length<=0){
      Toast.show('Enter vehicle number !!!',Toast.SHORT);
      return;
    }

    const data = {
      // registration_number:this.state.registration_number,
      registration_number:registration_number,
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
      // if (res.MessageType != 0) {
      //   Toast.show('We\'re facing some technical issues!');
      //   this.setState({ profileloading: false })
      // } else {
      //  this.setState({ profileloading: false })
      //   this.setUserInfo(res.Object);
      // }
      this.setState({vehicle_Detail:res.Object});
      console.log('vehicle_Detail',this.state.vehicle_Detail);
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


resetData(){
  //Toast.show('This is Reset Press');
  this.setState({vehicle_Detail:''})
  //this.setState({is_map_show:false})
  this.refs.state_code.clear()
  this.setState({state_code:''});
  this.refs.ref_code.clear()
  this.setState({ref_code:''});
  this.refs.num.clear()
  this.setState({num:''});
  this.refs.state.clear()
  this.setState({state_name:''});
}
  
  render() {
    const {userInfo} = this.state;
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader height={90} 
        leftComponent={<Entypo name='menu' color="#fff" style={{padding:10}} size={25} onPress={()=>this.props.navigation.toggleDrawer()} />} 
        title={userInfo.FullName?userInfo.FullName:'Vehicle List'} 
        // rightComponent={
        //   <Feather name="more-vertical" style={{ padding: 10 }} color="#fff" size={18} onPress={() => this.logout()} />
        // }
        />

        <View style={{ width: '100%', margin: 0, marginTop: -90, paddingTop: 5, alignSelf: 'center', padding: 10, paddingTop: 0 }}>
          {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ color: '#fff' }}>ANPR Log</Text>
          </View> */}
          <Card containerStyle={{ margin: 0, borderRadius: 8, padding:5 }} >
            {/* {this.state.userData.length<1 ? <ActivityIndicator style={{flex:1}} size="small"/> : */}
            <View style={{ flexDirection: 'column', alignItems: 'center' }} animationType="slide">
             
              <Text style={{fontSize:18}}>Enter Vehicle Number</Text>

              <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, backgroundColor: '#fafafa', padding:5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                {/* <TextInput
                  style={{ flex: 1 }}
                  inputContainerStyle={styles.input_container_style}
                  inputStyle={styles.input_style}
                  errorStyle={styles.errorInputStyle}
                  ref={input => this.userInput = input}
                  value={this.state.registration_number}
                  onChangeText={registration_number => this.setState({ registration_number })}
                  placeholder="Registration Number(eg:MP04MN1118)"
                  returnKeyType="next"
                /> */}

                <CodeInput
                  ref="state"
                  keyboardType='default'
                  size={25}
                  space={0}
                  placeholder='X'
                  codeLength={2}
                  activeColor='#3589c5'
                  inactiveColor='#000'
                  className='border-b'
                  cellBorderWidth={2}
                  containerStyle={{flex:0, marginTop:0, marginLeft:10}}
                  autoFocus={false}
                  codeInputStyle={{ color:'#3589c5' }}
                  onFulfill={(code) => {
                    console.log(code,/[a-zA-Z]{2}/.test(code));
                    if(/[a-zA-Z]{2}/.test(code)){
                      this.refs.state_code.clear()
                      this.setState({state_name:code});
                    }else{
                      this.refs.state.clear()
                      this.setState({state_name:''});
                    }
                  }}
                />

                <CodeInput
                  ref="state_code"
                  keyboardType='number-pad'
                  size={25}
                  space={0}
                  codeLength={2}
                  placeholder='0'
                  className='border-b'
                  containerStyle={{flex:0, marginTop:0, marginLeft:10}}
                  autoFocus={false}
                  activeColor='#3589c5'
                  inactiveColor='#000'
                  cellBorderWidth={2}
                
                  codeInputStyle={{ color:'#3589c5' }}
                  onFulfill={(code) => {
                   // console.log(code,/[0-9]{2}/.test(code));
                   if(/[0-9]{2}/.test(code)){
                     this.refs.ref_code.clear()
                      this.setState({state_code:code});
                     
                   }else{
                     this.refs.state_code.clear()
                     this.setState({state_code:''});
                   }
                  }}
                />

                <CodeInput
                  ref="ref_code"
                  keyboardType='default'
                  size={25}
                  space={0}
                  codeLength={2}
                  placeholder='X'
                  className='border-b'
                  cellBorderWidth={2}
                  containerStyle={{flex:0, marginTop:0, marginLeft:10}}
                  activeColor='#3589c5'
                  inactiveColor='#000'
                  autoFocus={false}
                  onSubmitEditing={()=>this.refs.num.clear()}
                  codeInputStyle={{ color:'#3589c5', }}
                  onFulfill={(code) => {
                    console.log(code,/[a-zA-Z]{2}/.test(code));
                    if(/[a-zA-Z]{2}/.test(code)){
                      this.refs.num.clear()
                      this.setState({ref_code:code});
                    }else{
                      this.refs.ref_code.clear()
                      this.setState({ref_code:''});
                    }
                  }}
                />

                <CodeInput
                  ref="num"
                  keyboardType='number-pad'
                  size={25}
                  space={0}
                  codeLength={4}
                  placeholder='0'
                  className='border-b'
                  cellBorderWidth={2}
                  containerStyle={{flex:0, marginTop:0, marginLeft:10}}
                  autoFocus={false}
                  activeColor='#3589c5'                
                  inactiveColor='#000'
                  codeInputStyle={{ color:'#3589c5' }}
                  onFulfill={(code) => {
                    //console.log(code,/[0-9]{4}/.test(code));
                   if(/[0-9]{4}/.test(code)){
                      this.setState({num:code});
                   }else{
                     this.refs.num.clear()
                     this.setState({num:''});
                   }
                  }}
                />

                {/* <Button title='search' /> */}
                {/* <FontAwesome style={{ padding: 5, marginLeft: 5 }} name='search' size={25} onPress={()=>this.getMpTransPortData()} /> */}
              </View>

              {/* <View style={{ width: '100%', height:30 }}>
                
              </View> */}

            </View>
            {/* } */}

            {/* <View style={{ position: 'absolute', bottom: -25, alignSelf:'center', paddingTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => this.getMpTransPortData()}>
              
                <View style={{ height: 40, width: 40, backgroundColor: colors.button_color, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome name="search" size={15} color="#fff" />
                  
                </View>
             
              </TouchableOpacity>
            </View> */}
             <View style={{ width: '100%', paddingRight:10,marginTop:20, flexDirection:'row', justifyContent:'center' }}>
                <TouchableOpacity onPress={()=>this.getMpTransPortData()}>
                  <Card containerStyle={{ margin:0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                    <View style={{ flexDirection: 'row' }}>
                      <FontAwesome name="search" size={20} color="#fff" />
                       <Text style={{ color: '#fff', marginLeft: 10 }}>Search</Text>
                   </View>
                  </Card>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:5}} onPress={()=>{
                  this.resetData();
                }}>
                  <Card containerStyle={{ margin:0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                    <View style={{ flexDirection: 'row' }}>
                      <MaterialCommunityIcons name="close-circle-outline" size={20} color="#fff" />
                       <Text style={{ color: '#fff', marginLeft: 10 }}>Clear</Text>
                   </View>
                  </Card>
                </TouchableOpacity>
            </View>

          </Card>
        </View>
        <View style={{ flex:1,marginTop:0 }}>
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
      
         {this.state.vehicle_Detail&&this.state.vehicle_Detail!='' ?
         
          <View style={{height:'100%',width:'100%'}}>
          <LabelView label='Owners Detail' style={{backgroundColor:'white'}}>
                <View style={{borderRadius:5,opacity:5,padding:5}}>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Owners Name</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.OWNERS_NAME}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Father/Husband Name</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.FATHER_HUSBAND_NAME}</Text>
                        </View>
                   </View>
                   
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Permanent Address</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.PARMANENT_ADDRESS}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Temporary Address</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.TEMPORARY_ADDRESS}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>City Name</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.CITY_NAME}</Text>
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
                        <Text style={{marginLeft:10}}>{this.state.vehicle_Detail.REGISTRATION_NO}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Registration Date</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.vehicle_Detail.REGISTRATION_DATE?this.getDatefromMilliseconds(this.state.vehicle_Detail.REGISTRATION_DATE):''}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Issue Date</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.ISSUE_DATE?this.getDatefromMilliseconds(this.state.vehicle_Detail.ISSUE_DATE):''}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Registration Expire</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.REGISTRATION_EXPIRY?this.getDatefromMilliseconds(this.state.vehicle_Detail.REGISTRATION_EXPIRY):""}</Text>
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
                        <Text style={{marginLeft:10}}>{this.state.vehicle_Detail.MAKER_NAME}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Maker Classification</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.vehicle_Detail.MAKER_CLASSIFICATION}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Class</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.vehicle_Detail.CLASS}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Year of Manufacture</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.vehicle_Detail.YEAR_OF_MANUFACTURE?this.getDatefromMilliseconds(this.state.vehicle_Detail.YEAR_OF_MANUFACTURE):""}</Text>
                        </View>
                   </View>    
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Chassis No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10}}>{this.state.vehicle_Detail.CHASSIS_NO}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Fuel Type</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.FUEL}</Text>
                        </View>
                   </View>  
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Engine No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.ENGINE_NO}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Horse Power</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.HORSE_POWER}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                        <Text style={{color:'black'}}>Wheelbase</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                        <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.WHEELBASE}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>GVW Registred</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.GVW_REGISTERED}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>GVW by Manufacture</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.GVW_BY_MANUFACTURE}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Laden Weight</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.LADEN_WEIGHT}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Color</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.COLOR}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>ULW</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.ULW}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>BTM Desc</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.BTM_DESC}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>CC</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.CC}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>No of Cylender</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.NO_OF_CYLENDER}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>RET Desc</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.RET_DESC}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Standard Seating Capacity</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.STANDARD_SEATING_CAPACITY}</Text>
                        </View>
                   </View> 
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>Sleeping Capacity</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.SLEEPING_CAPACITY}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:'#e6e6ff',marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>LPG Tank No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.LPG_TANK_NO}</Text>
                        </View>
                   </View>
                   <View style={{flexDirection:"row",marginTop:10,paddingBottom:10}}>
                        <View style={{width:'40%'}}>
                            <Text style={{color:'black'}}>LPG Toolkit No.</Text> 
                        </View>
                        <View style={{width:'60%',alignItems:'flex-end'}}>
                           <Text style={{marginLeft:10,textAlign:'right'}}>{this.state.vehicle_Detail.LPG_TOOLKIT_NO}</Text>
                        </View>
                   </View>                                                           
              </View> 
                                        
          </LabelView>

          </View>
          :
          <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                <Image
                    style={{ width: '100%', resizeMode: "contain",opacity:.2 }}
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

       
            {/* <View style={{ position: 'absolute', top: 132, alignSelf:'center', paddingTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 8 }} activeOpacity={0.2} onPress={() => this.getMpTransPortData()}>
                <View style={{ height: 50, width: 50, backgroundColor: colors.button_color, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome name="search" size={22} color="#fff" />
                </View>
              </TouchableOpacity>
            </View> */}

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
