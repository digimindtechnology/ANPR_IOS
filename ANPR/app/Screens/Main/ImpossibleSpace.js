/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View,Text, ScrollView,FlatList, TextInput, Keyboard, Image, AsyncStorage, NetInfo, ActivityIndicator, Modal, TouchableOpacity, RefreshControl} from 'react-native';
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
import ImageModal1 from '../../Components/ImageViewModal';

var Api = null;

const headerComponents = {
  title: { text: 'HONEYWELL', style: { color: '#fff', fontSize: 20,fontFamily:'Montserrat-Regular' } },
  right: function () {
    return <Feather name="more-vertical" color="#fff" size={18} onPress={()=>this.logout()}/>;
  },
  left: function (){
    return <Ionicons name='md-arrow-round-back' color="#fff" size={18} onPress={()=>this.props.navigation.goBack()} />;
  }
}


export default class ImpossibleSpace extends Component {

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
      is_map_show: false,
      image_url:'',
      page:0,
      vehicle_number:''
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
      this.getSuspectedVehicleImposibleSpace();
      console.log('Start_date:',this.state.start_date);
      console.log('End_Date:',this.state.end_date);
    }).catch(err=>console.log('error occurred in user detail',err));
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getSuspectedVehicleImposibleSpace = () => {
    const data = {
      user_id:this.state.userInfo.UserID,
      company_id:this.state.userInfo.CompanyID,
      start_time:this.state.start_date,
      end_time:this.state.end_date,
      //registration_number:this.state.registration_number,
      page_index:this.state.page,
      page_size:10,
      AuthKey:"MPP0L1CERHQ",
     
    }
    
    console.log('SuspectedVehicleImposibleSpace Data:',data);
    this.showProgress(true);
    Api.SuspectedVehicleImposibleSpace(data).then(res => {
       
      console.log('SuspectedVehicleImposibleSpace',res);
         
      this.showProgress(false);
    if (res) {
      if (res.MessageType != 0) {
        Toast.show('We\'re facing some technical issues!');
      } else {
        //this.setState({vehicle_list:res.Object});
        this.setState({vehicle_list:[...this.state.vehicle_list,...res.Object]});
        //Toast.show(res.Message);
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
  this.getSuspectedVehicleImposibleSpace()
}

 // renderList(vehicle_list) {
  renderList({item}) {
   // return vehicle_list.map((item,key) => {
    return (<View style={{ marginBottom: 10 }}>
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
              icon={{name: 'camera-off', type: 'feather'}}
              containerStyle={{borderColor:'#ccc',borderWidth:1,padding:1}}
              imageProps={{style:{borderRadius:50}}}
              source={{ uri: item.image_name }}
              onPress={() =>{this.setState({ modalVisible: true,vehicle_number:item.LicenseNum},()=>this.setImageUrl(item.image_name))}}
              //onPress={()=>this.props.navigation.navigate('LargePhotoView',{image_url:item.image_name,vehical_num:item.LicenseNum})}
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
    </View>)
    //})
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
        leftComponent={<Entypo name='menu' color="#fff" style={{paddingLeft:10}} size={25} onPress={()=>this.props.navigation.toggleDrawer()} />} 
        title={userInfo.FullName?userInfo.FullName:'Vehicle List'} 
        // RightComponent={
        //   <Feather name="more-vertical" style={{ padding: 10 }} color="#fff" size={18} onPress={() => this.logout()} />
        // } logout={() => this.logout()} 
        />

      <View style={{ width: '100%', margin: 0, marginTop: -90, paddingTop: 5, alignSelf: 'center', padding: 10, paddingTop: 0 }}>         
          <Card containerStyle={{ margin: 0, borderRadius: 8, padding:5 }} >        
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
            </View>
            <View style={{ width: '100%', paddingRight:10,marginTop:20, flexDirection:'row', justifyContent:'center' }}>
                <TouchableOpacity onPress={()=>this.setState({page:0,vehicle_list:[]},()=>this.getSuspectedVehicleImposibleSpace())}>
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




        <View style={{ flex:1 }}>
          {/* <ScrollView style={{ flex: 1 }}
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

        {/* <ImageModal1
         visible={this.state.modalVisible}
         onRequestClose={() => {
          this.setState({ modalVisible: false})
         }}
         source={{uri:this.state.image_url}}
         onPress={() => this.setState({ modalVisible: false })}
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
                //onLoad={() => console.log("Image loaded!")}
                style={{width:'100%', height: '100%'}} />
           </View> 
         </View>
        <View style={{ height:'25%'}}>
            <TouchableOpacity style={{ flex: 1}}          
            />
        </View>
      </View>     
              <View style={{ width:'100%', flexDirection: 'row',position:'absolute',backgroundColor:'#fff',alignItems:'center' }}>

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
        this.getSuspectedVehicleImposibleSpace();
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
