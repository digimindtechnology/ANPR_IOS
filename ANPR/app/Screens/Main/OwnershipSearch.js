/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View,Text,ScrollView, FlatList, Picker, TextInput, Keyboard, Image, AsyncStorage, NetInfo, ActivityIndicator, Modal, TouchableOpacity, RefreshControl,Platform} from 'react-native';
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
import MultiSelect from 'react-native-multiple-select';
import moment from 'moment-timezone';
import commonStyle from '../../styles';
import colors from '../../colors';
import PhotoView from 'react-native-photo-view';
import LabelView from '../../Components/LabelView';
import FormInput from '../../Components/FormInput';
//import MultiselectPicker from '../../../component/MultiselectPicker/MultiselectPicker';
import MultiselectPicker from '../../Components/MultiselectPicker/MultiselectPicker';
//import SearchableDropdown from 'react-native-searchable-dropdown';
import Autocomplete from 'react-native-autocomplete-input';
var Api = null;


export default class OwnershipSearch extends Component {

 // _didFocusSubscription;
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
      owner_Ship_Search_Records: [],
      maker_Select_List: [],
      maker_Classification_Select_List: [],
      colors_Select_List:[],
      is_map_show: false,
     // maker_name:[],
      maker_name:'',
      maker_classification_name:'',
      colors_name:'',
      maker_id: '',
      Maker_Classification_id: '',
      colors_id:'',
      engine_no:'',
      chassis_no:'',
      isEngineNoValid:true,
      isChassisNoValid:true,
      ckeck_Variable:0,
      selectedItems:[],
      initialValue:['ALL'],
      makerNameSeached:'',
      modalMaker:false,
      modalModel:false,
      //focused:false
      page:0,
      
    }
    this.reload = this.reload.bind(this);
    this._didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        console.log('didFocus', payload);
        console.log('didFocus','screen focused');
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

  _getUserDetails = async () => {
    AsyncStorage.getItem('userLoginDetail').then(data => {
      console.log('login details', data);
      var dt = JSON.parse(data);
      // userInfo = dt;
      this.setState({userInfo: dt});
      console.log('dt',dt);
      // this.get(dt.UserID,dt.CompanyID);
      // this.getSuspectedVehicleNotMatchedList()
     this.getMakerSelectList();
    // this.getMakerClassificationSelectList();
    // this.getColorsSelectList();
    }).catch(err=>console.log('error occurred in user detail',err));
  }

  showProgress = (state, message = 'Loading....') => {
    this.setState({ isLoading: state, loading_message: message });
  }

  getMakerSelectList = () => {
      const data = {
        AuthKey: "MPP0L1CERHQ"

      }
      this.showProgress(true);
      Api.GetMakerSelectList(data).then(res => {
        console.log('GetMakerSelectList',res);
        this.showProgress(false);
      if (res) {
        if (res.MessageType != 0) {
          Toast.show('We\'re facing some technical issues!');
        } else {
          this.setState({maker_Select_List:res.Object?res.Object:[]});
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

  getMakerClassificationSelectList = () => {
      const data = {
        AuthKey: "MPP0L1CERHQ",
        //maker_name:this.state.maker_name.join(',')
        maker_name:this.state.maker_name
        //maker_name:'Hero Honda Motors'
       
      }
      console.log('classification data',data);
      this.showProgress(true);
      Api.GetMakerClassificationSelectList(data).then(res => {
        console.log('GetMakerClassificationSelectList',res);
        this.showProgress(false);
      if (res) {
        if (res.MessageType != 0) {
          Toast.show('We\'re facing some technical issues!');
        } else {
          this.setState({maker_Classification_Select_List:res.Object?[{Text:'ALL',Value:'ALL'},...res.Object]:[]});
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

//   getColorsSelectList = () => {
//     const data = {
//       AuthKey: "MPP0L1CERHQ"
//     }
//     this.showProgress(true);
//     Api.GetColorsSelectList(data).then(res => {
//       console.log('GetColorsSelectList',res);
//       this.showProgress(false);
//     if (res) {
//       if (res.MessageType != 0) {
//         Toast.show('We\'re facing some technical issues!');
//       } else {
//         this.setState({colors_Select_List:res.Object});
//       }
//     }else{
//      Toast.show('We\'re facing some technical issues!');
//     }
//   }).catch(err =>{
//       this.showProgress(false);
//       console.log('userinfoerror',err)
//       Toast.show("Please check network connection");
//   })
// }

//getOwnerShipSearchRecords = (maker_name,maker_classification_name,colors,engine_no,chassis_no) => {
  getOwnerShipSearchRecords=()=>{
    const data = {
      AuthKey:"MPP0L1CERHQ",
      //maker_name:this.state.maker_name.join(','),
      maker_name:this.state.maker_name,
      //maker_name:'Hero Honda Motors',
      maker_classification_name:this.state.maker_classification_name,
      //maker_classification_name:'HERO HONDA CD-DELUXE',
      colors:'',
      engine_no:this.state.engine_no,
      chassis_no:this.state.chassis_no,
      page_index:this.state.page,
      page_size:100
      }
   
    
    console.log('OwnerShip data',data);
    {this.state.owner_Ship_Search_Records.length==0?this.showProgress(true):this.showProgress(false)}  
    
    Api.GetOwnerShipSearchRecords(data).then(res => {
       
      console.log('GetOwnerShipSearchRecords',res);
     
      this.showProgress(false);
    if (res) {
      if (res.MessageType != 0) {
        Toast.show('We\'re facing some technical issues!');
      } else {
        this.setState({owner_Ship_Search_Records:[...this.state.owner_Ship_Search_Records,...res.Object]});
        console.log('owner_Ship_Search_Records:',this.state.owner_Ship_Search_Records);
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
 _onRefresh = () => {
  this.setState({refreshing: true});
  setTimeout(() => this.setState({refreshing:false}),2000);
}

reload = () => {
  this.getOwnerShipSearchRecords()
}

  renderList({item}) {
    return <View style={{ marginBottom: 10 }} >
     <TouchableOpacity onPress={()=>this.props.navigation.navigate('OwnerDetails',{owner_data:item})}>
      <Card containerStyle={{ margin: 0, padding: 0, marginTop: 5, borderRadius: 10, backgroundColor: '#ffffff' }}>
      <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row', padding: 10, borderBottomColor:'#bfbfbf', borderBottomWidth:1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <Text style={{ color: colors.statusColor, fontSize: 16, fontFamily: 'Montserrat-Semibold' }}>{item.REGISTRATION_NO}</Text>
         </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10 }}>
         <View style={{ flex: 1, marginLeft: 5,marginRight: 5 }}>
           
            <Text style={styles.text_label}>Owner Name : <Text style={styles.text}>{item.OWNERS_NAME}</Text></Text>
            <Text style={styles.text_label}>Maker      : <Text style={styles.text}>{item.MAKER_CLASSIFICATION}</Text></Text>
            <Text style={styles.text_label}>Engine No. : <Text style={styles.text}>{item.ENGINE_NO}</Text></Text>
            <Text style={styles.text_label}>Chasis No. : <Text style={styles.text}>{item.CHASSIS_NO}</Text></Text>
            <Text style={styles.text_label}>Color      : <Text style={styles.text}>{item.COLOR}</Text></Text>
        </View>
      </View>
      </Card>
      </TouchableOpacity>
    </View>
    
    // })
  }
  setImageUrl=(url)=>{
    
    this.setState({image_url:url})
    console.log('URL:',url)
  }
  validateEngineNo(engine_no) {
    //this.setState({focused:this.textInput.isFocused()})
    //console.log('focused',focused);
    if(engine_no.length>=5){
      this.setState({isEngineNoValid:true})
      return true
    }else{
      this.setState({isEngineNoValid:false})
      return false
    }
    // return engine_no.length>=5?true:false;
  }
  validateChassisNo(chassis_no) {
    //this.setState({focused:false})
    if(chassis_no.length>=5){
      this.setState({isChassisNoValid:true})
      return true
    }else{
      this.setState({isChassisNoValid:false})
      return false
    }
    // return engine_no.length>=5?true:false;
  }
 
  // onMakerNameChange = selectedItems => {
  //   if(this.state.makerNameSeached!=''){
  //   selectedItems=[this.state.makerNameSeached,...selectedItems];
  //  //this.setState({maker_Select_List:[{Text:this.state.makerNameSeached,Value:this.state.makerNameSeached},...this.state.maker_Select_List]})
  //   this.setState({makerNameSeached:''});
  //  }
  //   this.setState({ maker_name:selectedItems },()=>this.getMakerClassificationSelectList());
  //   console.log('maker_name',this.state.maker_name);
  // };
  // onMakerClassificationChange = selectedItems => {
  //   var items = selectedItems.filter((item)=>{
  //     return item==="ALL";
  //   })

  //   console.log('items',items);

  //   if(items.length>0){
  //     this.setState({maker_classification_name:items});
  //   }else{
  //     this.setState({maker_classification_name:selectedItems});
  //   }
    
  // };
  // onColorChange = selectedItems => {
  //   this.setState({ colors_name:selectedItems});
  // };
  findMakerName() {
    if (this.state.maker_name === '') {
      return [];
    }

    //const { films } = this.state;
    const regex = new RegExp(`${this.state.maker_name.trim()}`, 'i');
    return this.state.maker_Select_List.filter(maker => maker.Text.search(regex) >= 0);
  }
  findModelName() {
    if (this.state.maker_classification_name === '') {
      return [];
    }

    //const { films } = this.state;
    const regex = new RegExp(`${this.state.maker_classification_name.trim()}`, 'i');
    return this.state.maker_Classification_Select_List.filter(makerClassification => makerClassification.Text.search(regex) >= 0);
  }
  resetData(){
    //Toast.show('This is Reset Press');
    this.setState({maker_name:''});
    this.setState({maker_classification_name:''});    
    this.setState({engine_no:''});   
    this.setState({chassis_no:''});    
    this.setState({owner_Ship_Search_Records:[]});
    this.setState({page:0});    
  }
  render() {
    const {userInfo} = this.state;
    const makerData=this.findMakerName();
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const modelData=this.findModelName();
    //const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <ScrollView>
      <View style={{ flex: 1 }}>
        <CustomHeader height={90} 
        leftComponent={<Entypo name='menu' color="#fff" style={{padding:10}} size={25} onPress={()=>this.props.navigation.toggleDrawer()} />} 
        title={userInfo.FullName?userInfo.FullName:'Vehicle List'} 
        />
        
        <View style={{ width: '100%', margin: 0, marginTop: -90, paddingTop: 5, alignSelf: 'center', padding: 10, paddingTop: 0 }}>
        
          <Card containerStyle={{ margin: 0, borderRadius: 8, padding:5}} >
           {/* <ScrollView> */}
            <View style={{ flexDirection: 'column', alignItems: 'center' }} animationType="slide">
            {/* <FormInput 
                  //style={styles.placehodr}
                    refInput={input => this.userInput = input}
                    value={this.state.engine_no}
                    onChangeText={engine_no => this.setState({ engine_no })}
                    placeholder="Engine No - (Min 5 Char)"
                    returnKeyType="next"
                    inputStyle={styles.input_style}
                    inputContainerStyle={width='100%'}
                    errorMessage={this.validateEngineNo(this.state.engine_no) ? null : 'Engine No - (Min 5 Char)'}
                    onSubmitEditing={() => {
                      this.validateEngineNo(this.state.engine_no)
                      //this.passwordInput.focus()
                    }}
                  />  */}


                  {/* <MultiselectPicker 
                  //title={'Attendees Contact *'}
                 // items={this.state.makerNameSeached!=''?[{Text:this.state.makerNameSeached,Value:this.state.makerNameSeached},...this.state.maker_Select_List]:this.state.maker_Select_List}
                  items={this.state.maker_Select_List}
                  uniqueKey="Value"
                  onSelectedItemsChange={this.onMakerNameChange}
                  selectedItems={this.state.maker_name}
                  onChangeInput={(text) => this.setState({makerNameSeached:text})}
                  displayKey="Text"
                  placeholder='Makers Name' /> */}
                     <View style={{ marginTop:5,width:"100%",marginLeft:33}}>
                         <Input
                           ref={(input) => { this.textInputMaekersName = input; }}
                           value={this.state.maker_name}
                           style={{ width:'100%', padding: 0, margin: 0 }}
                           onChangeText={makersName => this.setState({ maker_name:makersName},()=>{this.textInputMaekersName.isFocused=false})}
                           //onPress={()=>{this.setState({modalMaker:true})}}
                           placeholder="Maker Name"
                           returnKeyType="next"
                           //autoCapitalize={true}
                           onFocus={()=>{this.setState({modalMaker:true})}}
                           inputStyle={{fontSize:15}}
                           //inputContainerStyle={}
                           //errorMessage={this.state.isEngineNoValid? null : 'Engine No - (Min 5 Char)'}
                           //onSubmitEditing={() => {
                          // this.validateEngineNo(this.state.engine_no)
                          //this.passwordInput.focus()
                          //}}
                        /> 
                     </View>
                 
                 {/* <MultiselectPicker 
                  //title={'Attendees Contact *'}
                  items={this.state.maker_Classification_Select_List}
                  uniqueKey="Value"
                  onSelectedItemsChange={this.onMakerClassificationChange}
                 
                  selectedItems={this.state.maker_classification_name}
                  onChangeInput={(text) => console.log('Maker Classification',text)}
                  displayKey="Text"
                  placeholder='Maker Classification' /> */}
                  <View style={{ marginTop:5,width:"100%",marginLeft:33 }}>
                         
                         <Input
                            ref={(input) => { this.textInputModel = input; }}
                            value={this.state.maker_classification_name}
                            style={{ width:'100%', padding: 0, margin: 0 }}
                            onChangeText={modelName => this.setState({ maker_classification_name:modelName},()=>{this.textInputModel.isFocused=false})}
                            //onPress={()=>{this.setState({modalMaker:true})}}
                            placeholder="Model"
                            returnKeyType="next"
                            //autoCapitalize={true}
                            onFocus={()=>{this.state.maker_name===''?Toast.show('Please Select Maker Name'):this.setState({modalModel:true})}}
                            inputStyle={{fontSize:15}}
                            //inputContainerStyle={}
                            //errorMessage={this.state.isEngineNoValid? null : 'Engine No - (Min 5 Char)'}
                            //onSubmitEditing={() => {
                           // this.validateEngineNo(this.state.engine_no)
                           //this.passwordInput.focus()
                           //}}
                         />
                      </View>
                  <View style={{ marginTop:5,width:"100%",marginLeft:33 }}>
                  <Input
                 ref={(input) => { this.textInput = input; }}
                  value={this.state.engine_no}
                  style={{ width:'100%', padding: 0, margin: 0 }}
                  onChangeText={engine_no => this.setState({ engine_no})}
                  placeholder="Engine No - (Min 5 Char)"
                  returnKeyType="next"
                  //autoCapitalize={true}
                  inputStyle={{fontSize:15}}
                  //inputContainerStyle={}
                  errorMessage={this.state.isEngineNoValid? null : 'Engine No - (Min 5 Char)'}
                  onSubmitEditing={() => {
                    this.validateEngineNo(this.state.engine_no)
                    //this.passwordInput.focus()
                  }}
                  />
                  </View>
                  <View style={{ marginTop:5,width:"100%",marginLeft:33 }}>
                  <Input
                  value={this.state.chassis_no}
                  style={{ width:'100%', padding: 0, margin: 0 }}
                  onChangeText={chassis_no => this.setState({ chassis_no})}
                  placeholder="Chassis Number - (Min 5 Char)"
                  returnKeyType="next"
                  //autoCapitalize={true}
                  inputStyle={{fontSize:15}}
                 // inputContainerStyle={width='100%'}
                  errorMessage={this.state.isChassisNoValid ? null : 'Chassis Number - (Min 5 Char)'}
                  onSubmitEditing={() => {
                    this.validateChassisNo(this.state.chassis_no)
                    //this.passwordInput.focus()
                  }}
                  />
                   </View>

               {/* <View style={{top: 10, alignSelf:'center',paddingTop:10}}>
                 <TouchableOpacity style={{ elevation: 8 }} 
                                activeOpacity={0.2} 
                                onPress={() => 
                                 { 
                                  if(this.state.maker_name.length>0)
                                  {
                                    if(this.state.maker_classification_name.length>0)
                                   {
                                   if(this.state.engine_no.length!=0&&this.state.chassis_no.length!=0){
                                     if(this.state.engine_no.length>0&&this.state.engine_no.length<5&&this.state.chassis_no.length>0&&this.state.chassis_no.length<5)
                                     {
                                      Toast.show('Please Enter Valid Engine No. or Chassis No. - (Min 5 Char)');
                                     }
                                     else if(this.state.engine_no.length>0&&this.state.engine_no.length<5){
                                       Toast.show('Please Enter Valid Engine No - (Min 5 Char)');
                                    }
                                    else if(this.state.chassis_no.length>0&&this.state.chassis_no.length<5) {
                                      Toast.show('Please Enter Valid Chassis No - (Min 5 Char)');
                                    } else if(this.state.engine_no.length>=5&&this.state.chassis_no.length>=5) {
                                      this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())
                                    }

                                  } 
                                  else if(this.state.engine_no.length==0&&this.state.chassis_no.length==0){
                                     Toast.show('Please Enter Engine No. or Chassis No.');
                                    }
                                    else if(this.state.engine_no.length>0&&this.state.engine_no.length<5&&this.state.chassis_no.length==0){
                                      Toast.show('Please Enter Valid Engine No - (Min 5 Char)');
                                     }else if(this.state.chassis_no.length>0&&this.state.chassis_no.length<5&&this.state.engine_no.length==0){
                                      Toast.show('Please Enter Valid Chassis No - (Min 5 Char)');
                                     }else if(this.state.chassis_no.length>=5&&this.state.engine_no.length==0){
                                      this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())
                                     }else if(this.state.engine_no.length>=5&&this.state.chassis_no.length==0){
                                      this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())
                                     }
                                    }else{
                                      Toast.show("Please select Maker Classification");
                                     }
                                }else{
                                Toast.show("Please select Makers Name");
                                }
                              }
                              }>
                    <View style={{height: 50, width: 50, backgroundColor: colors.button_color, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                      <FontAwesome name="search" size={22} color="#fff" />
                    </View>
                 </TouchableOpacity>
               </View> */}
               <View style={{ width: '100%', paddingRight:10,marginTop:20, flexDirection:'row', justifyContent:'center' }}>
                <TouchableOpacity onPress={()=>
                 { 
                 // if(this.state.maker_name.length>0)
                 if(this.state.maker_name!='')
                  {
                    if(this.state.maker_classification_name.length>0)
                   {
                   if(this.state.engine_no.length!=0&&this.state.chassis_no.length!=0){
                     if(this.state.engine_no.length>0&&this.state.engine_no.length<5&&this.state.chassis_no.length>0&&this.state.chassis_no.length<5)
                     {
                      Toast.show('Please Enter Valid Engine No. or Chassis No. - (Min 5 Char)');
                     }
                     else if(this.state.engine_no.length>0&&this.state.engine_no.length<5){
                       Toast.show('Please Enter Valid Engine No - (Min 5 Char)');
                    }
                    else if(this.state.chassis_no.length>0&&this.state.chassis_no.length<5) {
                      Toast.show('Please Enter Valid Chassis No - (Min 5 Char)');
                    } else if(this.state.engine_no.length>=5&&this.state.chassis_no.length>=5) {
                      this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())
                    }

                  } 
                  else if(this.state.engine_no.length==0&&this.state.chassis_no.length==0){
                     Toast.show('Please Enter Engine No. or Chassis No.');
                    }
                    else if(this.state.engine_no.length>0&&this.state.engine_no.length<5&&this.state.chassis_no.length==0){
                      Toast.show('Please Enter Valid Engine No - (Min 5 Char)');
                     }else if(this.state.chassis_no.length>0&&this.state.chassis_no.length<5&&this.state.engine_no.length==0){
                      Toast.show('Please Enter Valid Chassis No - (Min 5 Char)');
                     }else if(this.state.chassis_no.length>=5&&this.state.engine_no.length==0){
                      this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())
                     }else if(this.state.engine_no.length>=5&&this.state.chassis_no.length==0){
                      this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())
                     }
                    }else{
                      Toast.show("Please select Maker Classification");
                     }
                }else{
                Toast.show("Please select Makers Name");
                }
              }
              }>
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



             {/* <View style={{ width:'90%',marginTop:6}}>
                <MultiSelect
                  hideTags
                  selector
                  items={this.state.maker_Select_List}
                  uniqueKey="Value"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onMakerNameChange}
                  selectedItems={this.state.maker_name}
                  selectText="Maker Name"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={(text) => console.log(text)}
                  //onChangeInput={(text) => this.state.maker_name}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  single={true}
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="Text"
                  searchInputStyle={{ color: '#CCC' }}
                 // submitButtonColor="#CCC"
                  //submitButtonText="Submit"
                />
            </View>
                 */}
                 {/* <View style={{ width:'90%',marginTop:6}}> */}
                 {/* Single Select Picker*/}
                  {/* <MultiselectPicker 
                  //title={'Attendees Contact *'}
                  items={this.state.maker_Select_List}
                  uniqueKey="Value"
                  single
                  onSelectedItemsChange={this.onMakerNameChange}
                  selectedItems={this.state.maker_name}
                  displayKey="Text"
                  placeholder='Makers Name' /> */}
                 {/* Single Select Picker*/} 
                {/* </View> */}
                {/* Single Select Picker*/}   
                {/* <MultiselectPicker 
                  //title={'Attendees Contact *'}
                  items={this.state.maker_Classification_Select_List}
                  uniqueKey="Value"
                  single
                  onSelectedItemsChange={this.onMakerClassificationChange}
                  selectedItems={this.state.maker_classification_name}
                  displayKey="Text"
                  placeholder='Maker Classification' /> */}
                {/* Single Select Picker*/}  
                 {/* <MultiselectPicker 
                  //title={'Attendees Contact *'}
                  items={this.state.colors_Select_List}
                  uniqueKey="Value"
                  single
                  onSelectedItemsChange={this.onColorChange}
                  selectedItems={this.state.colors_name}
                  displayKey="Text"
                  placeholder='Colors' /> */}

            {/* <View style={{ width:'90%'}}>
                <MultiSelect
                  hideTags
                  selector
                  items={this.state.maker_Classification_Select_List}
                  uniqueKey="Value"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onMakerClassificationChange}
                  selectedItems={this.state.maker_classification_name}
                  selectText="Maker Classification"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={(text) => console.log(text)}
                  //onChangeInput={(text) => this.state.maker_classification_name}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  single={true}
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="Text"
                  searchInputStyle={{ color: '#CCC' }}
                 // submitButtonColor="#CCC"
                  //submitButtonText="Submit"
                />
            </View> */}
            {/* <View style={{ width:'90%'}}>
                <MultiSelect
                  hideTags
                  selector
                  items={this.state.colors_Select_List}
                  uniqueKey="Value"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onColorChange}
                  selectedItems={this.state.colors_name}
                  selectText="Colors"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={(text) => console.log(text)}
                 //onChangeInput={(text) => this.state.colors_name}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  single={true}
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="Text"
                  searchInputStyle={{ color: '#CCC' }}
                 // submitButtonColor="#CCC"
                  //submitButtonText="Submit"
                />
            </View> */}

              {/* <View style={{ flexDirection: 'column', width: '100%', marginTop: 10, backgroundColor: '#fafafa', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.maker_name}
                        style={{ width:'100%', padding: 0, margin: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if(itemIndex>0){
                                this.setState({ maker_name: itemValue })
                                ///this.getPoliceStationByCity(itemValue);
                               // this.getMakerClassificationSelectList();
                            }
                            // else{
                            //     this.setState({ maker_classification_name: null });
                            //     this.setState({maker_Classification_Select_List: []});
                            // }
                        }}>
                        <Picker.Item label="Maker Name " value={null} />
                        {this.state.maker_Select_List.map((item, key) => (
                            <Picker.Item label={item.Text} value={item.Value} />)
                        )}
                    </Picker>
                   
             
                 
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.maker_classification_name}
                        style={{ width:'100%', padding: 0, margin: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if(itemIndex>0){
                                this.setState({ maker_classification_name: itemValue })
                               // this.getColorsSelectList();
                            }
                            // else{
                            //     this.setState({ colors_name: null });
                            //     this.setState({ colors_Select_List: [] })
                            // }
                            
                        }}>
                        <Picker.Item label="Maker Classification " value={null} />
                        {this.state.maker_Classification_Select_List.map((item, key) => (
                            <Picker.Item label={item.Text} value={item.Value} />)
                        )}
                    </Picker>
                    <Picker
                        mode='dropdown'
                        selectedValue={this.state.colors_name}
                        style={{ width:'100%', padding: 0, margin: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if(itemIndex>0){
                                this.setState({ colors_name: itemValue })
                            }else{

                                this.setState({ owner_Ship_Search_Records: [] })
                            }
                            
                        }}>
                        <Picker.Item label="Colors " value={null} />
                        {this.state.colors_Select_List.map((item, key) => (
                            <Picker.Item label={item.Text} value={item.Value} />)
                        )}
                    </Picker>
              </View> */}
              {/* <View style={{height:30,width: '100%'}}></View> */}
             
            </View>
            {/* </ScrollView> */}
            {/* <View style={{ position: 'absolute', bottom: -25, alignSelf:'center',paddingTop:10}}>
              <TouchableOpacity style={{ elevation: 8 }} activeOpacity={0.2} onPress={() => this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())}>
                <View style={{height: 50, width: 50, backgroundColor: colors.button_color, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome name="search" size={22} color="#fff" />
                </View>
              </TouchableOpacity>
            </View> */}
           
          </Card>
       
        </View>

     
        <View style={{ flex:1 }}>
        {this.state.owner_Ship_Search_Records.length > 0 ? 
          <FlatList
           contentContainerStyle={{padding:10}}
           data={this.state.owner_Ship_Search_Records}
           renderItem={this.renderList.bind(this)}
           onEndReached={this.handleLoadMore}
           />
             :
       <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
         <Image
           style={{ width: '100%', resizeMode: "contain",opacity:.2}}
           source={require('../../assets/logo_bd.png')}
         />
       </View>
     }

        </View>
        {/* Maker Model Start*/}
        <Modal
         animationType="fade"
         transparent={true}
         visible={this.state.modalMaker}
         onRequestClose={()=>{
           this.setState({modalMaker:false})
         }}
        >
        
          <ScrollView style={{flex:1,backgroundColor:'#fff',padding:10}}>
            <View style={{marginTop:(Platform.OS=='ios'?20:0)}}>
              
          <Autocomplete
                            //data={this.findMakerName()}
                 data={makerData.length === 1&& comp(this.state.maker_name, makerData[0].Text) ? [] :makerData}
                 defaultValue={this.state.maker_name}
                 onChangeText={text => this.setState({ maker_name: text })}
                 placeholder="Maker Name"
                 autoFocus={true}
                 fontSize={16}
                 //lineStyle={{ overflow:'scroll'}}
                 //listContainerStyle={{ overflow:'scroll'}}
                 containerStyle={[styles.autocompleteContainer]}
                 inputContainerStyle={{marginLeft:10,marginRight:10,marginTop:10}}
                 //onChangeInput={()=>this.getMakerClassificationSelectList()}
                 renderItem={item => (
                 <TouchableOpacity onPress={() => this.setState({ maker_name: item.Text })}>
                   <Text style={{fontSize:16}}>{item.Text}</Text>
                 </TouchableOpacity>
                 )}
             />
       <View style={{flexDirection:'row',marginTop:50,marginBottom:50,marginLeft:50,marginRight:50,justifyContent:'center'}}>
                <View style={{width:'50%'}}>
                 <Button 
                  title="Back"
                  style={{ marginRight: 10, 
                           width: '30%', 
                           backgroundColor: colors.headerColor, 
                           justifyContent:'center', alignItems: 'center' 
                         
                          }} 
                           onPress={() => {this.setState({maker_name:'',modalMaker:false}),()=>{this.textInputMaekersName.isFocused=false}}}
                           >
                      {/* <Text style={{ color: 'white', textAlign:'center'}}> Back </Text> */}
                  </Button>
                  </View>
                  <View style={{width:'50%',marginLeft:50}}>
                  <Button 
                  title="Submit"
                  style={{ marginRight: 10, 
                           width: '30%', 
                           backgroundColor: colors.headerColor, 
                           justifyContent:'center', alignItems: 'center' }} 
                           onPress={() => {this.setState({modalMaker:false},()=>this.getMakerClassificationSelectList())
                          }}
                           >
                      {/* <Text style={{ color: 'white', textAlign:'center'}}> Back </Text> */}
                  </Button>
                  </View>
           </View>
        

           </View>  
          </ScrollView>
         
        </Modal>
        {/* Maker Model End*/}
        
        {/* Model Model Start*/}
        <Modal
         animationType="fade"
         transparent={true}
         visible={this.state.modalModel}
         onRequestClose={()=>{
           this.setState({modalModel:false})
         }}
        >
        
          <ScrollView style={{flex:1,backgroundColor:'#fff',padding:10}}>
            <View>
            <Autocomplete
                            data={modelData.length === 1&& comp(this.state.maker_classification_name, modelData[0].Text) ? [] :modelData}
                            defaultValue={this.state.maker_classification_name}
                            onChangeText={text => this.setState({ maker_classification_name: text })}
                            placeholder="Model"                         
                            autoFocus={true}
                            fontSize={16}
                            containerStyle={styles.autocompleteContainer}
                            inputContainerStyle={{marginLeft:10,marginRight:10,marginTop:10}}
                            //onChangeInput={()=>this.getMakerClassificationSelectList()}
                            renderItem={item => (
                            <TouchableOpacity onPress={() => this.setState({ maker_classification_name: item.Text })}>
                               <Text style={{fontSize:16}}>{item.Text}</Text>
                            </TouchableOpacity>
                             )}
                           />
           <View style={{flexDirection:'row',marginTop:50,marginBottom:50,marginLeft:50,marginRight:50,justifyContent:'center'}}>
                <View style={{width:'50%'}}>
                 <Button 
                  title="Back"
                  style={{ marginRight: 10, 
                           width: '30%', 
                           backgroundColor: colors.headerColor, 
                           justifyContent:'center', alignItems: 'center' 
                         
                          }} 
                           onPress={() => {this.setState({maker_classification_name:'',modalModel:false}),()=>{this.textInputMaekersName.isFocused=false}}}
                           >
                      {/* <Text style={{ color: 'white', textAlign:'center'}}> Back </Text> */}
                  </Button>
                  </View>
                  <View style={{width:'50%',marginLeft:50}}>
                  <Button 
                  title="Submit"
                  style={{ marginRight: 10, 
                           width: '30%', 
                           backgroundColor: colors.headerColor, 
                           justifyContent:'center', alignItems: 'center' }} 
                           onPress={() => {this.setState({modalModel:false})
                          }}
                           >
                      {/* <Text style={{ color: 'white', textAlign:'center'}}> Back </Text> */}
                  </Button>
                  </View>
           </View>

           </View>  
          </ScrollView>
         
        </Modal>

        {/* Model Model End*/}

        {/* model for larg  Image View with close options */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false,image_url:'' })
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
                onError={() =>{ <ActivityIndicator color='red' size='large' /> }}
                style={{width:'100%', height: '100%'}} />
         
           </View>
         </View>
        <View style={{ height:'25%'}}>
            <TouchableOpacity style={{ flex: 1}} 
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

           {/* <View style={{ position: 'absolute', top: 285, alignSelf:'center',paddingTop:10}}>
              <TouchableOpacity style={{ elevation: 8 }} 
                                activeOpacity={0.2} 
                                onPress={() => this.setState({owner_Ship_Search_Records:[]},()=>this.getOwnerShipSearchRecords())}>
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
 {/* model for Multi Select View options  */}
       
{/* model for Multi Select View options  */}
       
      </View >
    </ScrollView>  
    );
  }

/************Handle More Data*****************/
  handleLoadMore = () => {

    this.setState({
      page:this.state.owner_Ship_Search_Records.length
    }, () => {
        this.getOwnerShipSearchRecords();
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
 },
 autocompleteContainer: {
  flex: 1,
  left: 0,
  position: 'relative',
  right: 0,
  top: 0,
  
  //zIndex: 1,
  //fontSize:18
}
});
