/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View,Text, ScrollView, FlatList, Picker, TextInput, Keyboard, Image, AsyncStorage, NetInfo, ActivityIndicator, Modal, TouchableOpacity, RefreshControl} from 'react-native';
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


export default class VehicleNotMatched extends Component {

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
      start_date: moment(new Date()).subtract(1,'day').format("DD-MMM-YYYY"),
      end_date: moment(new Date()).format("DD-MMM-YYYY"),
      registration_number: null,
      vehicle_list: [],
      district_list: [],
      police_station_list: [],
      is_map_show: false,
      district_id: '',
      police_station_id: '',
      image_url:'',
      page:0,
      ckeck_Variable:0
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
    // _didFocusSubscription && _didFocusSubscription.remove();
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
      this.getDistrict(dt.UserID,dt.CompanyID);
      this.getSuspectedVehicleNotMatchedList()
    }).catch(err=>console.log('error occurred in user detail',err));
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getDistrict = (user_id,company_id) => {
      const data = {
        user_id: user_id,
        company_id: company_id,
        AuthKey: "MPP0L1CERHQ"
      }
     // this.showProgress(true);
      Api.GetDistrict(data).then(res => {
        console.log('GetDistrict',res);
        this.showProgress(false);
      if (res) {
        if (res.MessageType != 0) {
          Toast.show('We\'re facing some technical issues!');
        } else {
          this.setState({district_list:res.Object});
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

  getPoliceStationByCity = (district_id) => {
      const data = {
        district_id: district_id,
        AuthKey: "MPP0L1CERHQ"
      }
      this.showProgress(true);
      Api.GetPoliceStationByCity(data).then(res => {
        console.log('GetPoliceStationByCity',res);
        this.showProgress(false);
      if (res) {
        if (res.MessageType != 0) {
          Toast.show('We\'re facing some technical issues!');
        } else {
          this.setState({police_station_list:res.Object});
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

  getSuspectedVehicleNotMatchedList = (district_id,police_station_id) => {
    const data = {
      start_date:this.state.start_date,
      end_date:this.state.end_date,
      district_id:district_id,
      police_station_id:police_station_id,
      user_id:this.state.userInfo.UserID,
      company_id:this.state.userInfo.CompanyID,
      page_index:this.state.page,
      
      page_size:10,
      AuthKey:"MPP0L1CERHQ"
    }
    
    console.log('data',data);

    this.showProgress(true);
    Api.SuspectedVehicleNotMatchedMpTransport(data).then(res => {
       
      console.log('SuspectedVehicleNotMatchedMpTransport',res);
         
      this.showProgress(false);
    if (res) {
      if (res.MessageType != 0) {
        Toast.show('We\'re facing some technical issues!');
      } else {
        this.setState({vehicle_list:[...this.state.vehicle_list,...res.Object]});
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
  //this.getSuspectedVehicleNotMatchedList()
  this.getSuspectedVehicleNotMatchedList(this.state.district_id,this.state.police_station_id);
}

  renderList({item}) {
    // return vehicle_list.map((item,key) => {
    return <View style={{ marginBottom: 10 }} >
      <Card containerStyle={{ margin: 0, padding: 0, marginTop: 5, borderRadius: 10, backgroundColor: '#ffffff' }}>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row', padding: 10, borderBottomColor:'#bfbfbf', borderBottomWidth:1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <Text style={{ color: colors.statusColor, fontSize: 16, fontFamily: 'Montserrat-Semibold' }}>{item.LicenseNum}</Text>
            <Text style={{ flex:1, textAlign:'right', color: item.LPCategory==='Stolen'?'#e31509':'#4d4d4d', fontSize: 16, fontFamily: 'Montserrat-Semibold' }}>{item.LPCategory}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>
          <View style={{ flexDirection: 'row', }}>

            <Avatar
              size="medium"
              rounded
              containerStyle={{borderColor:'#ccc',borderWidth:1,padding:1}}
              imageProps={{style:{borderRadius:50}}}
              containerStyle={{borderColor:'#ccc',borderWidth:1,padding:1}}
              imageProps={{style:{borderRadius:50}}}
              source={{ uri: item.image_name }}
              onPress={() => {this.setState({ image_url: item.image_name, modalVisible: true})}}
              activeOpacity={0.2}
            />

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
    
    this.setState({image_url:url})
    console.log('URL:',url)
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

        <View style={{ width: '100%', margin: 0, marginTop: -90, paddingTop: 5, alignSelf: 'center', padding: 10, paddingTop: 0 }}>
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
                  mode="date"
                  placeholder="select date"
                  showIcon={true}
                  format="DD-MMM-YYYY"
                  minDate="01-Jan-2010"
                  maxDate="31-Dec-2030"
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
                  mode="date"
                  placeholder="select date"
                  showIcon={true}
                  format="DD-MMM-YYYY"
                  minDate="01-Jan-2010"
                  maxDate="31-Dec-2030"
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
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.district_id}
                        style={{ width:'100%', padding: 0, margin: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if(itemIndex>0){
                                this.setState({ district_id: itemValue })
                                this.getPoliceStationByCity(itemValue);
                            }else{
                                this.setState({ district_id: null });
                                this.setState({police_station_list: []});
                            }
                        }}>
                        <Picker.Item label="Please select district" value={null} />
                        {this.state.district_list.map((item, key) => (
                            <Picker.Item label={item.Text} value={item.Value} />)
                        )}
                    </Picker>
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.police_station_id}
                        style={{ width:'100%', padding: 0, margin: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if(itemIndex>0){
                                this.setState({ police_station_id: itemValue })
                                // this.getSuspectedVehicleNotMatchedList(this.state.district_id,itemValue)
                            }else{
                                this.setState({ vehicle_list: [] })
                            }
                            
                        }}>
                        <Picker.Item label="Please select Police Station" value={null} />
                        {this.state.police_station_list.map((item, key) => (
                            <Picker.Item label={item.Text} value={item.Value} />)
                        )}
                    </Picker>
                    {/* <View style={{ width: '100%', paddingRight: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this.getSuspectedVehicleNotMatchedList(this.state.district_id,this.state.police_station_id)}>
                            <Card containerStyle={{ margin: 0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <MaterialCommunityIcons name="search" size={20} color="#fff" />
                                    <Text style={{ color: '#fff', marginLeft: 10 }}>Search</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    </View> */}
              </View>
              {/* <View style={{height:30,width: '100%'}}></View> */}
            </View>
            {/* } */}
            {/* <View style={{ position: 'absolute', bottom: -25, alignSelf:'center',paddingTop:10}}>
              <TouchableOpacity onPress={() => this.setState({page:0,vehicle_list:[]},()=>this.getSuspectedVehicleNotMatchedList(this.state.district_id,this.state.police_station_id))}>
               
                <View style={{height: 40, width: 40, backgroundColor: colors.button_color, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome name="search" size={15} color="#fff" />
                 
                </View>
             
              </TouchableOpacity>
            </View> */}

               <View style={{ width: '100%', paddingRight:10,marginTop:20, flexDirection:'row', justifyContent:'center' }}>
                <TouchableOpacity onPress={()=>this.setState({page:0,vehicle_list:[]},()=>this.getSuspectedVehicleNotMatchedList(this.state.district_id,this.state.police_station_id))}>
                  <Card containerStyle={{ margin:0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                    <View style={{ flexDirection: 'row' }}>
                      <FontAwesome name="search" size={20} color="#fff" />
                       <Text style={{ color: '#fff', marginLeft: 10 }}>Search</Text>
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
       
        {/* model for larg  Image View with close options */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false,image_url:'' })
          }}>
          {/* backgroundColor: '#00000040' */}
          <View style={{ flex: 1, backgroundColor: '#ffffff'}}>  
         
             <View style={{ height:'25%' }}>
               <TouchableOpacity style={{ flex: 1}} 
               //onPress={() => { this.setState({ modalVisible: false }); console.log('onTouch', 'Touched') }}
               />
             </View>
           <View style={{ flex:1,marginLeft:10,marginRight:10, backgroundColor: 'white' }}>
  {/* <View style={{ flex: 1, flexDirection: "row" }}> */}
            <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
           
              {/* <Image
               style={{flex:1}}
               source={{uri: this.state.image_url}}
              /> */}
                <PhotoView
                source={{uri: this.state.image_url}}
                //minimumZoomScale={0.5}
                maximumZoomScale={6}
                androidScaleType="fitXY"
                onError={() =>{ <ActivityIndicator color='red' size='large' /> }}
                style={{width:'100%', height: '100%'}} />
              
                
              {/* <TouchableOpacity activeOpacity={1}  
                            style={{
                            width:30,
                            height:30, 
                            position: 'relative',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0}}
                            onPress={() => this.setState({ modalVisible: false })}>
              <MaterialCommunityIcons name='close'
                                      color='red' 
                                      size={30}/>
            </TouchableOpacity> */}
     
           </View>
  {/* </View> */}
  

         </View>
        <View style={{ height:'25%'}}>
            <TouchableOpacity style={{ flex: 1}} 
            //onPress={() => { this.setState({ modalVisible: false }); console.log('onTouch', 'Touched') }}
            />
        </View>
      </View>
      <TouchableOpacity activeOpacity={.3}  
                            style={{
                            width:30,
                            height:30, 
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0}}
                            onPress={() => this.setState({ modalVisible: false,image_url:'' })}>
              <MaterialCommunityIcons name='close'
                                      color='red' 
                                      size={30}/>
            </TouchableOpacity>
        </Modal>
       
        {/* model for larg  Image View with close options  */}
{/* 
           <View style={{ position: 'absolute', top: 225, alignSelf:'center',paddingTop:10}}>
              <TouchableOpacity style={{ elevation: 8 }} activeOpacity={0.2} onPress={() => this.setState({page:0,vehicle_list:[]},()=>this.getSuspectedVehicleNotMatchedList(this.state.district_id,this.state.police_station_id))}>
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
        this.getSuspectedVehicleNotMatchedList(this.state.district_id,this.state.police_station_id);
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
