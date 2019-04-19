/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View,Text, ScrollView, TextInput, Keyboard,FlatList, Image,AsyncStorage, NetInfo, ActivityIndicator, Modal, TouchableOpacity, RefreshControl,TouchableHighlight,Platform} from 'react-native';
import { Card, Icon, Input, Button, ListItem, Avatar} from 'react-native-elements';
import ProjectListComponent from '../../Components/ProjectListComponent';
import CustomHeader from '../../Components/Header';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ReadMore from 'react-native-read-more-text';

import API from '../../config/API';
import Toast from 'react-native-simple-toast';
import FormInput from '../../Components/FormInput';
import moment from 'moment-timezone';
import commonStyle from '../../styles';
import colors from '../../colors';
import PhotoView from 'react-native-photo-view';

//import {SubmitButton, LoginButton} from '../../Components/Button';
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


export default class StolenVehicle extends Component {

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
      modalMessageVisible : false,
      refreshing : false,
      //start_date: moment(new Date()).subtract(1,'day').format("DD-MMM-YYYY"),
      start_date: moment(new Date()).format("DD-MMM-YYYY"),
      end_date: moment(new Date()).format("DD-MMM-YYYY"),
      registration_number: null,
      vehicle_list: [],
      is_map_show: false,
      image_url:'',
      alert_Message:'',
      mobile_No:'',
      page:0,
      showFooter: false,
      endOfList: false,
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
      this.getGetStolenVehicleList(dt);
      
    }).catch(err=>console.log('error occurred in user detail',err));
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getGetStolenVehicleList = () => {
    const data = {
      start_date:this.state.start_date,
      end_date:this.state.end_date,
      user_id:this.state.userInfo.UserID,
      page_index:this.state.page,
      page_size:5,
      company_id:this.state.userInfo.CompanyID,
      AuthKey:"MPP0L1CERHQ"
    }
    

    if(this.state.page==0){
      this.showProgress(true);
    }else{
      this.setState({showFooter:true});
    }

    // if (!this.state.endOfList) {
      Api.GetStolenVehicleList(data).then(res => {

        console.log('GetStolenVehicleList', res);

        this.showProgress(false);
        this.setState({ showFooter: false });
        if (res) {
          if (res.MessageType != 0) {
            Toast.show('We\'re facing some technical issues!');
          } else {
            //this.setState({vehicle_list:res.Object});
            this.setState({ vehicle_list: [...this.state.vehicle_list, ...res.Object] });

            if (res.Object.length == 0) {
              this.setState({ endOfList: true });
              Toast.show('No data available')
            }

          }
        } else {
          Toast.show('We\'re facing some technical issues!');
        }
      }).catch(err => {

        console.log('userinfoerror', err)
        this.showProgress(false);
        Toast.show("Please check network connection");
        this.setState({ profileloading: false, showFooter: false })
      })
    // }
    
  }

  getSendPartialMessage = () => {
    if(this.state.mobile_No.length==0){
      Toast.show("Please enter mobile number !!!",Toast.SHORT);
      return;
    }
    if(this.state.mobile_No.length<10){
      Toast.show("Please enter valid number !!!",Toast.SHORT);
      return;
    }
  

    const data = {
      user_id:this.state.userInfo.UserID,
      mobile_number:this.state.mobile_No,
      AuthKey:"MPP0L1CERHQ",
      message:this.state.alert_Message
    }
    
    console.log('stolen data',data);

    this.setState({modalMessageVisible:false});

    
    this.showProgress(true);

    Api.SendPartialMessage(data).then(res => {
       
      console.log('SendPartialMessage',res);
         
      this.showProgress(false);
    if (res) {
      if (res.MessageType != 0) {
        Toast.show('We\'re facing some technical issues!');
      } else {
        Toast.show('Message has been send...');
      }
    }else{
     Toast.show('We\'re facing some technical issues!');
    }
  }).catch(err =>{

      console.log('userinfoerror',err)
      Toast.show("Please check network connection");
      //this.setState({profileloading:false})
  })
  }

 _onRefresh = () => {
  this.setState({refreshing: true});
  setTimeout(() => this.setState({refreshing:false}),2000);
}
//comment

reload = () => {
  this.getGetStolenVehicleList()
}

  //renderList(vehicle_list) {
    renderList({item}){
    //return vehicle_list.map((item,key) => {
    return (<View style={{ marginBottom: 10 }} >
      <Card containerStyle={{ margin: 0, padding: 0, marginTop: 5, borderRadius: 10, backgroundColor: '#ffffff' }}>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row', padding: 10, borderBottomColor:'#bfbfbf', borderBottomWidth:1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <Text style={{ color: colors.statusColor, fontSize: 16, fontFamily: 'Montserrat-Semibold' }}>{item.LicenseNum}</Text>
            <Text style={{ flex:1, textAlign:'right', color: item.LPCategory==='Stolen'?'#e31509':'#4d4d4d', fontSize: 16, fontFamily: 'Montserrat-Semibold' }}>{item.LPCategory}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>
          <View style={{ flexDirection: 'column',alignItems:'center' }}>
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
              source={{ uri: item.image_name }}
              onPress={() => this.setState({ modalVisible: true,vehicle_number:item.LicenseNum},()=>this.setImageUrl(item.image_name))}
              activeOpacity={0.2}
            />
            :
            <Avatar
            size="medium"
            rounded
            icon={{name: 'camera-off', type: 'feather'}}
            containerStyle={{borderColor:'#ccc',borderWidth:1,padding:1}}
            imageProps={{style:{borderRadius:50}}}
            source={{ uri: item.image_name }}
            onPress={() => this.setState({ modalVisible: true,vehicle_number:item.LicenseNum},()=>this.setImageUrl(item.image_name))}
            activeOpacity={0.2}
          />
            }
            <View style={{height:1.5,width:50,backgroundColor:'#e6e6e6',marginTop:10}}></View>
           <View style={{marginTop:10}}>
           <TouchableOpacity activeOpacity={.2}  
                            style={{
                            width:30,
                            height:30, 
                          
                            }}
                            onPress={() => this.setState({ modalMessageVisible: true},()=>this.setAlertMessage(item.Alert))}>
              <Octicons name='mail'
                                     color={colors.button_color} 
                                      size={30}/>
            </TouchableOpacity>
     
           </View>
          </View>
         
          <View style={{ flex: 1, marginTop: 5, marginLeft: 10 }}>
              <Text style={styles.text_label}>Message : <Text style={styles.text}>{item.Alert}</Text></Text>
           
            <ReadMore
              numberOfLines={1}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
               <Text style={styles.text_label}>Recipient : <Text style={styles.text}>{item.out_going_sms_numbers_with_post + '\n'}</Text></Text>
               <Text style={styles.text_label}>FIR City: <Text style={styles.text}>{item.FirDistrict + '\n'}</Text></Text>
               <Text style={styles.text_label}>Seen City : <Text style={styles.text}>{item.city_name}</Text></Text>
             </ReadMore>
         
            {/* <Text style={styles.text}>{item.Time}</Text> */}
            
          </View>

        </View>
      </Card>
    </View>)
    //})
  }
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: "red", padding: 2,fontSize:12}} onPress={handlePress}>
        Read more...
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: "red", padding: 2,fontSize:12}} onPress={handlePress}>
        ...Show less
      </Text>
    );
  }
  _handleTextReady = () => {
    console.log('ready!');
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setImageUrl=(url)=>{
    
    this.setState({image_url:url})
    console.log('URL:',url)
  }
  
  setAlertMessage=(message)=>{
    this.setState({alert_Message:message})
  }

  render() {
    const {userInfo} = this.state;
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader height={90} 
        leftComponent={<Entypo name='menu' color="#fff" style={{padding:10}} size={25} onPress={()=>this.props.navigation.toggleDrawer()} />} 
        title={userInfo.FullName?userInfo.FullName:'Vehicle List'} 
        // RightComponent={
        //   <Feather name="more-vertical" style={{ padding: 10 }} color="#fff" size={18} onPress={() => this.logout()} />
        // } logout={() => this.logout()} 
        />

        <View style={{ width: '100%', margin: 0, marginTop: -90, paddingTop: 5, alignSelf: 'center', padding: 10, paddingTop: 0 }}>
          {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ color: '#fff' }}>ANPR Log</Text>
          </View> */}
          <Card containerStyle={{ margin: 0,minHeight:110, borderRadius: 8, padding:5 }} >
            {/* {this.state.userData.length<1 ? <ActivityIndicator style={{flex:1}} size="small"/> : */}
            <View style={{ flexDirection: 'column', alignItems: 'center' }} animationType="slide">

              <View style={{ width: '100%', flexDirection: 'row',alignItems:'center' }}>
              <Text style={styles.highlight_label}>From</Text>
                <DatePicker
                  style={{ padding:0,height:20}}
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
                  onDateChange={(date) => { this.setState({ start_date: date,page:0,vehicle_list:[] },() => this.getGetStolenVehicleList())}}
                />
              </View>

              <View style={{ marginTop: 5, width: '100%', flexDirection: 'row',alignItems:'center' }}>
              <Text style={styles.highlight_label}>To</Text>
                <DatePicker
                  style={{padding:0,height:20}}
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
                  onDateChange={(date) => { this.setState({ end_date: date,page:0,vehicle_list:[] },() => this.getGetStolenVehicleList()) }}
                />
              </View>

              {/* <View style={{ width: '100%',paddingTop:10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this.getGetStolenVehicleList()}>
                            <Card containerStyle={{ margin: 0, padding: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 20, backgroundColor: colors.headerColor }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesome name="search" size={15} color="#fff" />
                                    <Text style={{ color: '#fff', marginLeft: 10 }}>Search</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    </View> */}

            </View>
            {/* } */}



          </Card>
        </View>
        {this.state.is_map_show ?
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
           : null}

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
          >

            {this.state.vehicle_list.length > 0 ? this.renderList(this.state.vehicle_list) :
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ width: '100%', resizeMode: "contain" }}
                  source={require('../../assets/NoRecordFound.png')}
                />
              </View>
            }

          </ScrollView> */}
          {this.state.vehicle_list.length > 0 ? 
           <FlatList
           contentContainerStyle={{padding:10}}
           data={this.state.vehicle_list}
           renderItem={this.renderList.bind(this)}
           onEndReached={this.handleLoadMore}
           ListFooterComponent={this.state.showFooter?<ActivityIndicator color={colors.statusColor} size='large'/>:null}
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
        {/* model for larg  Image View with close options */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
          {/* backgroundColor: '#00000040' */}
          <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

            <View style={{ height: '25%' }}>
              <TouchableOpacity style={{ flex: 1 }}
              //onPress={() => { this.setState({ modalVisible: false }); console.log('onTouch', 'Touched') }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10, marginRight: 10, backgroundColor: 'white' }}>
              {/* <View style={{ flex: 1, flexDirection: "row" }}> */}
              <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>

                {/* <Image
               style={{flex:1}}
               source={{uri: this.state.image_url}}
              /> */}

                <PhotoView
                  source={{ uri: this.state.image_url }}
                  //minimumZoomScale={0.5}
                  maximumZoomScale={6}
                  androidScaleType="fitXY"
                  onLoad={() => console.log("Image loaded!")}
                  style={{ width: '100%', height: '100%' }} />

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
            <View style={{ height: '25%' }}>
              <TouchableOpacity style={{ flex: 1 }}
              //onPress={() => { this.setState({ modalVisible: false }); console.log('onTouch', 'Touched') }}
              />
            </View>
          </View>
          <View style={{ width:'100%', flexDirection: 'row',position:'absolute',backgroundColor:'#fff',alignItems:'center',marginTop:(Platform.OS=='ios'?20:0) }}>

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


          {/* model for Message options open */}
          <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalMessageVisible}
          onRequestClose={() => {
            this.setState({ modalMessageVisible: false })
          }}>
          {/* backgroundColor: '#00000040' */}
          
          <View style={{ flex: 1, backgroundColor: '#00000040',justifyContent:'center',alignItems:'center',alignContent:'center'}}>  
         
             {/* <View style={{ height:'25%',width:'100%' }}>
               <TouchableOpacity style={{ flex: 1}} 
               //onPress={() => { this.setState({ modalVisible: false }); console.log('onTouch', 'Touched') }}
               />
             </View> */}
           <View style={{marginLeft:10,marginRight:10, backgroundColor: 'white',borderRadius:10 }}>
  {/* <View style={{ flex: 1, flexDirection: "row" }}> */}
            <View style={{flexDirection: "column",padding:10 }}>
               <View style={{alignItems:'center',borderBottomColor:'#bfbfbf', borderBottomWidth:1,paddingBottom:10}}>
                 <Text style={{fontSize:20,color: colors.statusColor}}>Message to be Send</Text>
               </View>
                 <View style={{alignItems:'center',marginTop:10}}> 
                 <Text style={styles.text}>{this.state.alert_Message}</Text>
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
                errorStyle={styles.errorInputStyle1}
                autoCorrect={false}
                blurOnSubmit={false}
                placeholder="Enter Mobile No."
                //placeholderTextColor="#000000"
                onSubmitEditing={()=>{this.getSendPartialMessage()}}
                leftIcon={<FontAwesome name='mobile' size={20} color='#1d3d78' />}
                onChangeText={moblino => this.setState({ mobile_No:moblino })}
               />
              
               </View>
               <View style={{alignItems:"center"}}>
                 <Button
                   title="Send Message"
                   //ViewComponent={require('react-native-linear-gradient').default}
                   containerViewStyle={{borderRadius:10}}
                   buttonStyle={[{width:200, height:50, marginTop:10,marginBottom:10,borderRadius:40,backgroundColor:'#fc4236' }]}
                   disabledStyle={{backgroundColor:'#b3b3b3'}}
                   //disabled={props.disabled}
                   
                   onPress={()=>{this.getSendPartialMessage()}}
                />
               </View>
            <TouchableOpacity activeOpacity={1}  
                            style={{
                            width:30,
                            height:30, 
                            position: 'absolute',
                            left: 10,
                            right: 0,
                            top: 10,
                            bottom: 0}}
                            onPress={() => this.setState({ modalMessageVisible: false })}>
              <MaterialCommunityIcons name='close'
                                      color='red' 
                                      size={30}/>
            </TouchableOpacity>
     
           </View>
  {/* </View> */}
  

         </View>
        {/* <View style={{ height:'25%',width:'100%'}}>
            <TouchableOpacity style={{ flex: 1}} 
            //onPress={() => { this.setState({ modalVisible: false }); console.log('onTouch', 'Touched') }}
            />
        </View> */}
      </View>
     
        </Modal>
       
        {/* model for message close options  */}


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
        this.getGetStolenVehicleList();
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
  fontSize:18,
  flex:1
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
});
