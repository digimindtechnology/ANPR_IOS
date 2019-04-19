/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, 
  View,
  Text, 
  ScrollView, 
  FlatList, 
  Picker, 
  TextInput, 
  Keyboard, 
  Image, 
  AsyncStorage,
  NetInfo, 
  ActivityIndicator, 
  Modal, 
  TouchableOpacity, 
  RefreshControl,
  Platform
} from 'react-native';
import { Card, Icon, Input, Button, ListItem, Avatar} from 'react-native-elements';
import ProjectListComponent from '../../Components/ProjectListComponent';
import CustomHeader from '../../Components/Header';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../../config/API';
import Toast from 'react-native-simple-toast';
import FormInput from '../../Components/FormInput';
import moment from 'moment-timezone';
import commonStyle from '../../styles';
import colors from '../../colors';
import PhotoView from 'react-native-photo-view';
import CodeInput from 'react-native-confirmation-code-input';
import RNPickerSelect from 'react-native-picker-select'
//import ImageModal from '../../Components/ImageViewModal';
var Api = null;

// const headerComponents = {
//   title: { text: 'HONEYWELL', style: { color: '#fff', fontSize: 20,fontFamily:'Montserrat-Regular' } },
//   right: function () {
//     return <Feather name="more-vertical" color="#fff" size={18} onPress={()=>this.logout()}/>;
//   },
//   left: function (){
//     return <Ionicons name='md-arrow-round-back' color="#fff" size={18} onPress={()=>this.props.navigation.goBack()} />;
//   }
// }


export default class VehicleSearch extends Component {

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
      //start_date: moment(new Date()).subtract(1,'day').format("DD-MMM-YYYY"),
      start_date: moment(new Date()).subtract(1,'hour').format("DD-MMM-YYYY HH:mm"),
      end_date: moment(new Date()).format("DD-MMM-YYYY HH:mm"),
      registration_number: null,
      vehicle_list: [],
     subCityList: [],
      locationList: [],
      formated_subCityList: [],
      formated_locationList: [],
      is_map_show: false,
      city_id: '',
      location_id: '',
      image_url:'',
      page:0,
      ckeck_Variable:0,
      state_name:'',
      state_code:'',
      ref_code: '',
      num: '',
      vehicle_number:'',
      
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
        //this._getUserDetails();
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
     //_didFocusSubscription && _didFocusSubscription.remove();
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

  // logout(){
  //   this.setState({
  //     modalVisible :true
  //   })
  // }

  // processLogout(){
  //     this.setState({modalVisible:false})
  //     this.props.navigation.navigate('LogIn');
  //     AsyncStorage.removeItem("isLogin").then(()=>{
  //         console.log('remove item','logoutsuccess')
  //         Toast.show('Logout Succesfull!!');
  //     })
  // }

  _getUserDetails = async () => {
    AsyncStorage.getItem('userLoginDetail').then(data => {
      console.log('login details', data);
      var dt = JSON.parse(data);
      // userInfo = dt;
      this.setState({userInfo: dt});
      console.log('dt',dt);
      this.getGetSubCityList();
      //this.VehicleHistoryByCity()
    }).catch(err=>console.log('error occurred in user detail',err));
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getGetSubCityList = () => {
      const data = {        
        AuthKey: "MPP0L1CERHQ"
      }
     // this.showProgress(true);
      Api.GetSubCityList(data).then(res => {
        console.log('GetSubCityList:',res);
       // this.showProgress(false);
      if (res) {
        if (res.MessageType != 0) {
          Toast.show('We\'re facing some technical issues!');
        } else {
          this.setState({subCityList:res.Object});
          if(Platform.OS=='ios'){
            this.setState({formated_subCityList:res.Object})
          }
        }
      }else{
       Toast.show('We\'re facing some technical issues!');
      }
    }).catch(err =>{
        this.showProgress(false);
        console.log('userinfoerror',err)
        Toast.show("Please check network connection");
    })
  }

  getGetLocationList = (id) => {
      const data = {
        id: id,
        AuthKey: "MPP0L1CERHQ"
      }
      this.showProgress(true);
      Api.GetLocationList(data).then(res => {
        console.log('GetLocationList',res);
        this.showProgress(false);
      if (res) {
        if (res.MessageType != 0) {
          Toast.show('We\'re facing some technical issues!');
        } else {
          this.setState({locationList:res.Object});
          if(Platform.OS=='ios'){
            this.setState({formated_locationList:res.Object})
          }
        }
      }else{
       Toast.show('We\'re facing some technical issues!');
      }
    }).catch(err =>{
        this.showProgress(false);
        console.log('userinfoerror',err)
        Toast.show("Please check network connection");
    })
  }

  VehicleHistoryByCity = (city_id,location_id) => {
  //  if(this.state.city_id==null){
  //    Toast.show('Please Select City');
  //    return
  //  }


    const data = {
      start_date:this.state.start_date,
      end_date:this.state.end_date,
      subCityId:city_id,
      locationId:location_id==null?0:location_id,
      RegNum1:this.state.state_name,
      RegNum2:this.state.state_code,
      RegNum3:this.state.ref_code,
      RegNum4:this.state.num,
      UserID:this.state.userInfo.UserID,
      CompanyID:this.state.userInfo.CompanyID,
      page_index:this.state.page,
      page_size:10,
      AuthKey:"MPP0L1CERHQ"  
    }
    
    console.log('VehicleHistoryByCity data:',data);

    this.showProgress(true);
    Api.VehicleHistoryByCity(data).then(res => {
       
      console.log('VehicleHistoryByCity',res);
         
      this.showProgress(false);
    if (res) {
      if (res.MessageType != 0) {
        Toast.show('We\'re facing some technical issues!');
      } else {
        this.setState({vehicle_list:[...this.state.vehicle_list,...res.Object]});
       
          Toast.show(res.Message);
     
      }
    }else{
     Toast.show('We\'re facing some technical issues!');
    }
  }).catch(err =>{
        this.showProgress(false);
      console.log('userinfoerror',err)
      Toast.show("Please check network connection..!!!");
  })
  }

 _onRefresh = () => {
  this.setState({refreshing: true});
  setTimeout(() => this.setState({refreshing:false}),2000);
}
//comment

reload = () => {
  //this.VehicleHistoryByCity()
  this.VehicleHistoryByCity(this.state.city_id,this.state.location_id);
}



  renderList({item,key}) {
    // return vehicle_list.map((item,key) => {
  return <View style={{ marginBottom: 10 }} key={key}> 
      <Card containerStyle={{ margin: 0, padding: 0, marginTop: 5, borderRadius: 10, backgroundColor: '#ffffff' }}>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row', padding: 10, borderBottomColor:'#bfbfbf', borderBottomWidth:1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <Text style={{ color: colors.statusColor, fontSize: 16, fontFamily: 'Montserrat-Semibold' }}>{item.LicenseNum}</Text>
            <Text style={{ flex:1, textAlign:'right', color: item.LPCategory==='Stolen'?'#e31509':'#4d4d4d', fontSize: 16, fontFamily: 'Montserrat-Semibold' }}>{item.LPCategory}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>
          <View style={{ flexDirection: 'row', }}>
          {Platform.OS=='ios'?
            <Avatar
              size="medium"
              rounded
              icon={{name: 'camera-off', type: 'feather'}}
              containerStyle={{
                borderColor:'#ccc',
                borderWidth:1,
               // padding:1
              }}
              //imageProps={{style:{borderRadius:50}}}
              source={{uri:item.image_name}}
              // onPress={() => {this.setState({modalVisible: true,vehicle_number:item.LicenseNum},()=>this.setImageUrl(item.image_name))}}
              onPress={() => {this.setState({image_url:item.image_name,vehicle_number:item.LicenseNum,modalVisible: true},()=>console.log('Url:',this.state.image_url))}}
              // onPress={()=>this.props.navigation.navigate('LargePhotoView',{image_url:item.image_name,vehical_num:item.LicenseNum})}
              activeOpacity={0.2}
            />
            :
            <Avatar
              size="medium"
              rounded
              icon={{name: 'camera-off', type: 'feather'}}
              containerStyle={{borderColor:'#ccc',borderWidth:1,padding:1}}
              imageProps={{style:{borderRadius:50}}}
              source={{uri:item.image_name}}
              // onPress={() => {this.setState({modalVisible: true,vehicle_number:item.LicenseNum},()=>this.setImageUrl(item.image_name))}}
              onPress={() => {this.setState({image_url:item.image_name,vehicle_number:item.LicenseNum,modalVisible: true},()=>console.log('Url:',this.state.image_url))}}
              // onPress={()=>this.props.navigation.navigate('LargePhotoView',{image_url:item.image_name,vehical_num:item.LicenseNum})}
              activeOpacity={0.2}
            />
            }
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.text}>{item.location_name} {item.city_name}</Text>
            <Text style={styles.text_label}>Police Station : <Text style={styles.text}>{item.police_station_name}</Text></Text>
            <Text style={styles.text}>{item.Time}</Text>
          </View>
        </View>
      </Card>
    </View>
    
    // })
  }
  setImageUrl=(url)=>{
    this.setState({image_url:url});
    console.log('URL:',this.state.image_url);
  }
  resetData(){
    //Toast.show('This is Reset Press');
    this.setState({vehicle_list:[]});
    //this.setState({is_map_show:false})
    this.refs.state_code.clear();
    this.setState({state_code:''});
    this.refs.ref_code.clear();
    this.setState({ref_code:''});
    this.refs.num.clear();
    this.setState({num:''});
    this.refs.state.clear();
    this.setState({state_name:'',locationList:[],location_id:null,city_id:null});
    this.setState({ start_date: moment(new Date()).subtract(1,'hour').format("DD-MMM-YYYY HH:mm"),
    end_date: moment(new Date()).format("DD-MMM-YYYY HH:mm")});
    
  }

  getFormatedCity(items){
    var format_item=[];
    items.map((item)=>{
      format_item.push({
      label:item.Text,
      value:item.Value,
      });
    })
    this.setState({formated_subCityList:format_item});
  }
  getFormatedLocation(items){
    var format_item=[];
    items.map((item)=>{
      format_item.push({
      label:item.Text,
      value:item.Value,
      });
    })
    this.setState({formated_locationList:format_item});
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
        // } logout={() => this.logout()} 
        
        />

        <View style={{width: '100%', margin: 0, marginTop: -90, paddingTop: 5, alignSelf: 'center', padding: 10, paddingTop: 0 }}>
          {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ color: '#fff' }}>ANPR Log</Text>
          </View> */}
          <Card containerStyle={{ margin: 0, borderRadius: 8, padding:5 }} >
            {/* {this.state.userData.length<1 ? <ActivityIndicator style={{flex:1}} size="small"/> : */}
            <View style={{ flexDirection: 'column', alignItems: 'center' }} animationType="slide">

              <View style={{ width: '100%', flexDirection: 'row' }}>
              <Text style={styles.highlight_label}>From</Text>
                <DatePicker
                  style={{flex:1,  padding:0,height:20}}
                  date={this.state.start_date}
                  mode="datetime"
                  placeholder="select date"
                  showIcon={true}
                  format="DD-MMM-YYYY HH:mm"
                  minDate="01-Jan-2010 00:00"
                  maxDate="31-Dec-2030 24:60"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateTouchBody:{
                      flex:0,
                      justifyContent:'flex-end',
                      padding:0,
                      margin:0,
                      height:20,
                    },
                    dateInput: {
                      flex:0,
                      padding:0,
                      margin:0,
                      height:20,
                      borderColor: "#d0cece00"
                    },
                    dateText: {
                      fontSize:16,
                      color:colors.statusColor
                    },
                    dateIcon: {
                      width: 22,
                      height: 22
                    }
                  }}
                  onDateChange={(date) => { this.setState({ start_date: date }) }}
                />
              </View>

              <View style={{ marginTop: 5, width: '100%', flexDirection: 'row' }}>
              <Text style={styles.highlight_label}>To</Text>
                <DatePicker
                  style={{flex:1,padding:0,height:20}}
                  date={this.state.end_date}
                  mode="datetime"
                  placeholder="select date"
                  showIcon={true}
                  format="DD-MMM-YYYY HH:mm"
                  minDate="01-Jan-2010 00:00"
                  maxDate="31-Dec-2030 24:60"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateTouchBody:{
                      flex:0,
                      justifyContent:'flex-end',
                      padding:0,
                      margin:0,
                      height:20,
                    },
                    dateInput: {
                      flex:0,
                      padding:0,
                      margin:0,
                      height:20,
                      borderColor: "#d0cece00"
                    },
                    dateText: {
                      fontSize:16,
                      color:colors.statusColor
                    },
                    dateIcon: {
                      width: 22,
                      height: 22
                    }
                  }}
                  onDateChange={(date) => { this.setState({ end_date: date }) }}
                />
              </View>

              <View style={{ flexDirection: 'column', width: '100%', marginTop: 10, backgroundColor: '#fafafa', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                    
              {Platform.OS=='ios'?
                      <RNPickerSelect
                        placeholder={{
                          label:'Please select city',
                          value:null,
                        }}
                        items={this.state.formated_subCityList}
                        style={{...pickerSelectStyles}}
                        onValueChange={(itemValue)=>{
                          if(itemValue){
                            this.setState({city_id:itemValue})
                            this.getGetLocationList(itemValue);
                          }else{
                            this.setState({ city_id: null });
                            this.setState({locationList: []});                            
                        }
                        }}
                        value={this.state.city_id}
                      />
                    :                      
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.city_id}
                        style={{ width:'100%', padding: 0, margin: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if(itemIndex>0){
                                this.setState({ city_id: itemValue })
                                this.getGetLocationList(itemValue);
                            }else{
                                this.setState({ city_id: null });
                                this.setState({locationList: []});
                                
                            }
                        }}>
                        <Picker.Item label="Please select city" value={null} />
                        {this.state.subCityList.map((item, key) => (
                            <Picker.Item label={item.Text} value={item.Value} key={key}/>)
                        )}
                    </Picker>
              }
               {Platform.OS=='ios'?
                      <RNPickerSelect
                        placeholder={{
                          label:'Please select location',
                          value:null,
                        }}
                        items={this.state.formated_locationList}
                        style={{...pickerSelectStyles}}
                        onValueChange={(itemValue,itemIndex)=>{
                          if(itemIndex>0){
                            this.setState({ location_id: itemValue })
                          }else{
                            this.setState({ vehicle_list: [] })
                            this.setState({ location_id: null });
                          }
                        }}
                        value={this.state.location_id}
                      />
                    :  
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.location_id}
                        style={{ width:'100%', padding: 0, margin: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if(itemIndex>0){
                                this.setState({ location_id: itemValue })
                                // this.VehicleHistoryByCity(this.state.city_id,itemValue)
                            }else{
                                this.setState({ vehicle_list: [] })
                                this.setState({ location_id: null });
                            }
                            
                        }}>
                        <Picker.Item label="Please select location" value={null} />
                        {this.state.locationList.map((item, key) => (
                            <Picker.Item label={item.Text} value={item.Value} key={key}/>)
                        )}
                    </Picker>
               }
                    {/* <View style={{ width: '100%', paddingRight: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this.VehicleHistoryByCity(this.state.city_id,this.state.location_id)}>
                            <Card containerStyle={{ margin: 0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <MaterialCommunityIcons name="search" size={20} color="#fff" />
                                    <Text style={{ color: '#fff', marginLeft: 10 }}>Search</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    </View> */}
              </View>

              <Text style={{fontSize:17,marginTop: 10}}>Enter Vehicle Number</Text>
              <View style={{ flexDirection: 'row', width: '100%',  backgroundColor: '#fafafa', padding:5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
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
                  containerStyle={{flex:0, marginTop:0}}
                  autoFocus={false}
                  codeInputStyle={{ color:'#3589c5' }}
                  onChangeText={(code) => this.setState({state_name:code})}
                  onFulfill={(code) => {
                    console.log(code,/[a-zA-Z]{2}/.test(code));
                    if(/[a-zA-Z]{2}/.test(code)){
                      this.refs.state_code.clear()
                      this.setState({state_name:code});
                    }
                    else{
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
                  cellBorderWidth={2}
                  containerStyle={{flex:0, marginTop:0,marginLeft:10}}
                   autoFocus={false}
                  activeColor='#3589c5'
                  inactiveColor='#000'
                  codeInputStyle={{ color:'#3589c5' }}
                  onFulfill={(code) => {
                    //console.log(code,/[0-9]{2}/.test(code));
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
                  activeColor={'#3589c5'}
                  inactiveColor='#000'
                   autoFocus={false}
                  //onSubmitEditing={()=>this.refs.num.clear()}
                  codeInputStyle={{ color:'#3589c5', }}               

                  onFulfill={(code) => {
                    console.log(code,/[a-zA-Z]{2}/.test(code));
                    if(code.length>0&&/[a-zA-Z]/.test(code)){
                      this.refs.num.clear()
                      this.setState({ref_code:code});
                    }else{
                      //this.refs.ref_code.clear()
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
                   // console.log(code,/[0-9]{4}/.test(code));
                   if(/[0-9]{4}/.test(code)){
                      this.setState({num:code});
                   }else{
                     this.refs.num.clear()
                     this.setState({num:''});
                   }
                  }}
                />

                {/* <Button title='search' /> */}
              </View>
              {/* <View style={{height:30,width: '100%'}}></View> */}
            </View>
            {/* } */}
            {/* <View style={{ position: 'absolute', bottom: -25, alignSelf:'center',paddingTop:10}}>
              <TouchableOpacity onPress={() => this.setState({page:0,vehicle_list:[]},()=>this.VehicleHistoryByCity(this.state.city_id,this.state.location_id))}>
               
                <View style={{height: 40, width: 40, backgroundColor: colors.button_color, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome name="search" size={15} color="#fff" />
                 
                </View>
             
              </TouchableOpacity>
            </View> */}

               {/* <View style={{width: '100%', paddingRight:10,marginTop:20, flexDirection:'row', justifyContent:'center' }}>
                <TouchableOpacity onPress={()=>this.setState({page:0,vehicle_list:[]},()=>this.VehicleHistoryByCity(this.state.city_id,this.state.location_id))}>
                  <Card containerStyle={{ margin:0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                    <View style={{ flexDirection: 'row' }}>
                      <FontAwesome name="search" size={20} color="#fff" />
                       <Text style={{ color: '#fff', marginLeft: 10 }}>Search</Text>
                   </View>
                  </Card>
                </TouchableOpacity>
              </View> */}
               <View style={{width: '100%', paddingRight:10,marginTop:20, flexDirection:'row', justifyContent:'center' }}>
                <TouchableOpacity onPress={()=>{
                if(this.state.subCityList.length!=0){
                  if(this.state.city_id!=null){
                    this.setState({page:0,vehicle_list:[]},()=>this.VehicleHistoryByCity(this.state.city_id,this.state.location_id))

                  }else{
                    Toast.show('Please select city.')
                  }
                 
                }else{
                  Toast.show('City list not available.')
                }
             
              }}>
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
        {/* {this.state.is_map_show ?
          <View style={{ width: '100%', paddingRight:10, flexDirection:'row', justifyContent:'flex-end' }}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('MapView',{vehicle_data:this.state.vehicle_list})}>
              <Card containerStyle={{ margin:0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                <View style={{ flexDirection: 'row' }}>
                  <MaterialCommunityIcons name="google-maps" size={20} color="#fff" />
                  <Text style={{ color: '#fff', marginLeft: 10 }}>Map</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
           : null} */}

        <View style={{ flex:1 }}>
          {/* <ScrollView style={{ flex: 1 }}
            //onScrollEndDrag={this.handleLoadMore}
            onMomentumScrollEnd={this.handleLoadMore}
            contentContainerStyle={{padding:10}}
            // refreshControl={
            //   <RefreshControl
            //     onRefresh={this._onRefresh.bind(this)}
            //     refreshing={this.state.refreshing}
            //     enabled={true}
            //   />
            // }
          > */}

           {this.state.vehicle_list.length > 0 ? 
           
           <FlatList
            contentContainerStyle={{padding:10}}
            data={this.state.vehicle_list}
            renderItem={this.renderList.bind(this)}
            onEndReached={this.handleLoadMore}
            keyExtractor={(item, index) => index.toString()}    
            />
            :
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ width: '100%', resizeMode: "contain",opacity:.2 }}
                  source={require('../../assets/logo_bd.png')}
                />
              </View>
            }
            {/* {this.state.vehicle_list.length > 0 ? this.renderList(this.state.vehicle_list) :
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ width: '100%', resizeMode: "contain" }}
                  source={require('../../assets/NoRecordFound.png')}
                />
              </View>
            }

          </ScrollView> */}
        </View>
        {/* <ImageModal
         visible={this.state.modalVisible1}
         onRequestClose={() => {
          this.setState({ modalVisible1: false})
         }}
         source={{uri:this.state.image_url}}
         onPress={() => this.setState({ modalVisible1: false })}
         Text={this.state.vehicle_number}
         /> */}

         {/* model for larg  Image View with close options */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
       
          <View style={{ flex: 1, backgroundColor: '#ffffff'}}>  
         
             <View style={{ height:'25%' }}>
               <TouchableOpacity style={{ flex: 1}}               
               />
             </View>
           <View style={{ flex:1,marginLeft:10,marginRight:10, backgroundColor: 'white' }}> 
            <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}> 

              <PhotoView                
                source={{uri: this.state.image_url}}               
                maximumZoomScale={6}
                androidScaleType="fitXY"
               // onLoad={() => console.log("Image loaded!")}
               //onLoadStart={()=>console.log('onLoadStart url:',this.state.image_url)}
                style={{width:'100%', height:'100%'}} />

           </View> 
         </View>
        <View style={{ height:'25%'}}>
            <TouchableOpacity style={{ flex: 1}}          
            />
        </View>
      </View>     
              <View style={{ width:'100%', flexDirection: 'row',position:'absolute',backgroundColor:'#fff',alignItems:'center',marginTop:(Platform.OS=='ios'?20:0)}}>

               <TouchableOpacity activeOpacity={.3}
                style={{
                        width: 30,
                        height: 30
                      }}
                onPress={() => this.setState({ modalVisible: false })}>
                 <MaterialCommunityIcons name='close'
                                         color='red'
                                         size={30} />
               </TouchableOpacity>
              <Text style={{ textAlign:'center', flex:1, fontSize: 20 }}>{this.state.vehicle_number}</Text>
              </View>
        </Modal>
       
        {/* model for larg  Image View with close options  */}
       
{/* 
           <View style={{ position: 'absolute', top: 225, alignSelf:'center',paddingTop:10}}>
              <TouchableOpacity style={{ elevation: 8 }} activeOpacity={0.2} onPress={() => this.setState({page:0,vehicle_list:[]},()=>this.VehicleHistoryByCity(this.state.city_id,this.state.location_id))}>
                <View style={{height: 50, width: 50, backgroundColor: colors.button_color, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
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

/************Handle More Data*****************/
  handleLoadMore = () => {

    this.setState({

      //page: this.state.page + this.state.apiData.length
      page:this.state.vehicle_list.length
    }, () => {
      // if (this.state.page % 5 == 0) {
        //if(this.state.page!=this.state.ckeck_Variable){
        this.VehicleHistoryByCity(this.state.city_id,this.state.location_id);
        //}
     // }
    });
  };
/************Handle More Data*****************/

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
 },
 text_label:{
  color:colors.statusColor,
  fontSize:16
 },
 text:{
   color:'#4d4d4d',
   fontSize:16
 },
 highlight_label:{
   fontSize:18
 }
});
const pickerSelectStyles=StyleSheet.create({
  inputIOS:{
    fontSize:16,
    paddingTop:13,
    paddingHorizontal:10,
    paddingBottom:12,
    color:'black',
  }
})