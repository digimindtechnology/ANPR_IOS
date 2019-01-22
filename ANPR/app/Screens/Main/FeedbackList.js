/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View,Text, ScrollView, FlatList, TextInput, Keyboard, Image, AsyncStorage, NetInfo, ActivityIndicator, Modal, TouchableOpacity, RefreshControl} from 'react-native';
import { Card, Icon, Input, Button, ListItem, Avatar} from 'react-native-elements';
import ProjectListComponent from '../../Components/ProjectListComponent';
import CustomHeader from '../../Components/Header';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../../config/API';
import Toast from 'react-native-simple-toast';
import FormInput from '../../Components/FormInput';
import moment from 'moment-timezone';
import commonStyle from '../../styles';
import colors from '../../colors';

import CodeInput from 'react-native-confirmation-code-input';


var Api = null;


export default class Home extends Component {

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
      start_date: moment(new Date()).subtract(1,'day').format("DD-MMM-YYYY HH:mm"),
      end_date: moment(new Date()).format("DD-MMM-YYYY HH:mm"),
      registration_number: null,
      vehicle_list: [],
      is_map_show: false,
      state_name:'',
      state_code:'',
      ref_code: '',
      num: '',
      page:0
    }
    this.reload = this.reload.bind(this);
    this._didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        console.log('didFocus', payload);
        console.log('didFocus','screen focused')
        if(this.state.userInfo.UserID){
          this.showProgress(true);
          this.getFeedbackList(this.state.userInfo);
        }
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

  _getUserDetails = async () => {
    AsyncStorage.getItem('userLoginDetail').then(data => {
      console.log('login details', data);
      var dt = JSON.parse(data);
      // userInfo = dt;
      this.setState({userInfo: dt});
      console.log('dt',dt);
      
    this.showProgress(true);
      this.getFeedbackList();
      
    }).catch(err=>console.log('error occurred in user detail',err));
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getFeedbackList = () => {
    const data = {
      //user_id:dt.UserID,
      user_id:this.state.userInfo.UserID,
      page_index:this.state.page,
      page_size:5,
      AuthKey:"MPP0L1CERHQ"
    }  

    console.log('data',data);

    Api.GetFeedbackUserWiseList(data).then(res => {
       
      console.log('GetFeedbackUserWiseList',res);
         
      this.showProgress(false);
      this.setState({refreshing:false})
    if (res) {
      if (res.MessageType != 0) {
        Toast.show('We\'re facing some technical issues!');
      } else {
        //this.setState({vehicle_list:res.Object});
        this.setState({vehicle_list:[...this.state.vehicle_list,...res.Object]});
      }
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
      this.setState({refreshing:false});
  })
  }

 _onRefresh = () => {
  this.setState({refreshing: true});
  this.getFeedbackList(this.state.userInfo);
  // setTimeout(() => this.setState({refreshing:false}),2000);
}
//comment

reload = () => {
  this.getFeedbackList()
}

  //renderList(vehicle_list) {
    renderList({item}){
    //return vehicle_list.map((item) => {
    return (<View style={{ marginBottom: 10 }} >
      <Card containerStyle={{ margin: 0, padding: 0, marginTop: 5, borderRadius: 15, backgroundColor: '#ffffff' }}>

        <View style={{ flexDirection: 'row', borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, alignItems: 'center' }}>
          <View style={{ flex: 1, }}>

            <View style={{ borderBottomColor:'#bfbfbf', borderBottomWidth:1,  padding:10,borderTopLeftRadius:10, borderTopRightRadius:10 }}>
              <View style={{ alignSelf: 'flex-end', position: 'absolute', right: 0, top: 0, height: 28, width: 28, backgroundColor: colors.button_color, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
                <Entypo name="edit" size={15} style={{ padding: 5 }} color='#fff' onPress={() => this.props.navigation.navigate('AddFeedback', { feedback: item })} />
              </View>
              <View style={{ flexDirection: 'row',paddingBottom:5 }}>
                <Text numberOfLines={1} style={[styles.text,{flex:1}]}>{item.user_name}</Text>
              </View>

              <View style={{ flexDirection: 'row',paddingBottom:5 }}>
                <Text numberOfLines={1} style={[styles.text,{flex:1}]}>{item.email_id}</Text>
                <Text numberOfLines={1} style={styles.text}>{item.mobile_number}</Text>
              </View>
              
              <View style={{ flexDirection: 'row',paddingBottom:5 }}>
              <Text numberOfLines={1} style={[styles.text,{flex:1}]}>{item.created_by}</Text>
              <Text numberOfLines={1} style={styles.text}>{item.created_date}</Text>
              </View>
              
            </View>

            <View style={{ flexDirection: 'row', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
              <Text style={[styles.text, { flex: 1, textAlignVertical: 'center' }]}>{item.suggestion}</Text>
            
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
        title={userInfo.FullName?userInfo.FullName:'Vehicle List'}
        // rightComponent={
        //   <MaterialIcons name="add" style={{ padding: 10 }} color="#fff" size={25} onPress={() => this.props.navigation.navigate('AddFeedback')} />
        // }
         />

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

            {this.renderList(this.state.vehicle_list)}

          </ScrollView> */}
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

        </View>
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
        this.getFeedbackList();
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
