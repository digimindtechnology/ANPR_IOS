/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View,Text, ScrollView, TextInput, Image, AsyncStorage,FlatList, NetInfo, ActivityIndicator, Modal, TouchableOpacity, RefreshControl} from 'react-native';
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


export default class Notification extends Component {

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
      notification_list: [],
      page:0
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

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('connection', connectionInfo);
      if (connectionInfo != "none" && connectionInfo != "unknown") {
        this.setState({ isConnected: true });
        this._getUserDetails();
      } else {
        Toast.show("No Internet Connection!!");
      }
    });
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
      this.getVehicleAlerts()
    }).catch(err=>console.log('error occurred in user detail',err));
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getVehicleAlerts = () => {
    const data = {
      // user_id:dt.UserID,
      // company_id:dt.CompanyID,
      user_id:this.state.userInfo.UserID,
      company_id:this.state.userInfo.CompanyID,
      page_index:this.state.page,
      page_size:5,
      AuthKey:"MPP0L1CERHQ"
    }
    
    this.showProgress(true);
    Api.VehicleAlerts(data).then(res => {
       
      console.log('VehicleAlerts',res);
         
      this.showProgress(false);
    if (res) {
      if (res.MessageType != 0) {
        Toast.show('We\'re facing some technical issues!');
      } else {
        //this.setState({notification_list:res.Object});
        this.setState({notification_list:[...this.state.notification_list,...res.Object]});
      }
    }else{
     Toast.show('We\'re facing some technical issues!');
    }
  }).catch(err =>{

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
  this.getVehicleAlerts()
}

  //renderList(vehicle_list) {
    renderList({item}) {
    //return vehicle_list.map((item) => {
    return (<View style={{ marginBottom: 10 }} >
      <Card containerStyle={{ margin: 0, padding: 0, marginTop: 5, borderRadius: 10, backgroundColor: '#ffffff' }}>

        <View>

        <View style={{ flex: 1,borderBottomColor:'#bfbfbf', borderBottomWidth:1, paddingTop: 10, paddingLeft:15, paddingRight:15, paddingBottom:10, flexDirection: 'row',alignItems:'center' }}>
          <Text style={{fontSize:16,color:colors.statusColor}}>{item.AlertCityName}</Text>
          <Text style={[styles.text, { flex: 1, fontSize: 16, textAlign: 'right', color: '#4d4d4d' }]}>{item.AlertCreatedDate}</Text>
        </View>

        <View style={{ flexDirection: 'row', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10, paddingTop:10 }}>
          {/* <View style={{ flexDirection: 'column',}}>
            <Avatar
              size="medium"
              rounded
              containerStyle={{borderColor:'#ccc',borderWidth:1,padding:1}}
              imageProps={{style:{borderRadius:50}}}
              source={{ uri: item.imageUrl }}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
          </View> */}
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.text}>{item.Alert}</Text>
            {/* <Text style={styles.text_label}>Police Station : <Text style={styles.text}>{item.police_station_name}</Text></Text>
            <Text style={styles.text_label}>City : <Text style={styles.text}>{item.AlertCityName}</Text></Text> */}
             
          </View>
        </View>

        </View>
      </Card>
    </View>)
    //})
  }

  render() {
    const {userInfo} = this.state;
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader height={1} 
        leftComponent={<Entypo name='menu' color="#fff" style={{padding:10}} size={25} onPress={()=>this.props.navigation.toggleDrawer()} />} 
        title={userInfo.FullName?userInfo.FullName:'Notification'}/>

        <View style={{ flex:1 }}>
          {/* <ScrollView style={{ flex: 1 }}
            contentContainerStyle={{padding:10}}
            refreshControl={
              <RefreshControl
                onRefresh={this._onRefresh.bind(this)}
                refreshing={this.state.refreshing}
                enabled={true}
              />
            }
          >

            {this.renderList(this.state.notification_list)}

          </ScrollView> */}
        {this.state.notification_list.length > 0 ? 
          <FlatList
           contentContainerStyle={{padding:10}}
           data={this.state.notification_list}
           renderItem={this.renderList.bind(this)}
           onEndReached={this.handleLoadMore}
           //onRefresh={this._onRefresh.bind(this)}
           />
           :
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ width: '100%', resizeMode: "contain",opacity:.2 }}
                  source={require('../../assets/logo_bd.png')}
                />
              </View>
            }
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
  /************Handle More Data*****************/
  handleLoadMore = () => {

    this.setState({

      //page: this.state.page + this.state.apiData.length
      page:this.state.notification_list.length
    }, () => {
      // if (this.state.page % 5 == 0) {
        //if(this.state.page!=this.state.ckeck_Variable){
        this.getVehicleAlerts();
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
  color:colors.headerColor
 },
 text:{
   color:'#4d4d4d',
   fontSize:16
 }
});
