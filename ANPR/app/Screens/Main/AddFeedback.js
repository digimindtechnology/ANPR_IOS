import React,{Component} from 'react';
import {View,Text,StyleSheet,TextInput,Modal,TouchableOpacity, ScrollView,Picker,NetInfo,Image,AsyncStorage,ActivityIndicator} from 'react-native';
import Customheader from '../../Components/Header';
import {Card,Slider,Input,Button} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SubmitButton, LoginButton} from '../../Components/Button';
import LinearGradient from 'react-native-linear-gradient';
import LabelView from '../../Components/LabelView';
import Toast from 'react-native-simple-toast';
import commonStyle from '../../styles';

import mime from 'mime-types';
import moment from 'moment-timezone';

import API from '../../config/API';

var Api = null;


export default class AddFeedback extends Component{

    constructor(props){
        super(props);
        this.state = {
            user_name: props.navigation.getParam('feedback')?props.navigation.getParam('feedback').user_name:'',
            mobile: props.navigation.getParam('feedback')?props.navigation.getParam('feedback').mobile_number:'',
            email_id: props.navigation.getParam('feedback')?props.navigation.getParam('feedback').email_id:'',
            suggestion: props.navigation.getParam('feedback')?props.navigation.getParam('feedback').suggestion:'',
            userInfo: '',
            is_username_empty: false,
            is_mobile_empty: false,
            is_suggestion_empty: false,
            feedback_id: props.navigation.getParam('feedback')?props.navigation.getParam('feedback').feedback_id:''
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
      }

      async componentWillMount() {

          var NodeInfo = JSON.parse(await AsyncStorage.getItem('NodeUrl'));
          console.log("nodeinfo", NodeInfo.NodeURL);

          Api = new API(NodeInfo.NodeURL);

          AsyncStorage.getItem('userLoginDetail').then((value) => {
            console.log("JSON.stringify(res)");
            console.log(JSON.parse(value));
            this.setState({
              userInfo: JSON.parse(value)
            })
       
          NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log('connection',connectionInfo);
            if(connectionInfo!="none" && connectionInfo!="unknown" ){
              this.setState({isConnected:true})
            }else{
              Toast.show("No Internet Connection!!");
            }
          });

           });
      }

      showProgress = (state,message='Loading....') => {
        this.setState({ isLoading: state,loading_message:message });
    }

    ValidateEmail(email) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
      }
      return (false)
    }

    addEditFeedback(){
        this.showProgress(true);

        this.setState({
            is_username_empty: this.state.user_name.length>0 ? false :true,
            is_mobile_empty: this.state.mobile.length<10 ? true : false,
            is_suggestion_empty: this.state.suggestion.length>0 ? false :true
        })

        if(this.state.email_id.length>0 && !this.ValidateEmail(this.state.email_id)){
          Toast.show("Invalid email id",Toast.SHORT);
          this.showProgress(false);
          return ;
        }

        if(this.state.user_name.length>0 && this.state.mobile.length>=10 && this.state.suggestion.length>0){
          
          var data = {
            feedback_id: this.state.feedback_id,
            user_name: this.state.user_name,
            mobile_number: this.state.mobile,
            email_id: this.state.email_id,
            suggestion: this.state.suggestion,
            user_id: this.state.userInfo.UserID,
            AuthKey: 'MPP0L1CERHQ'
          }

          console.log('data',data);

          Api.PostFeedback(data).then((res)=>{
            this.showProgress(false);
              console.log('res',res);
              if (res) {
                if (res.MessageType != 0) {
                  Toast.show('We\'re facing some technical issues!');
                } else {
                    this.showProgress(false);
                  Toast.show(res.Message,Toast.SHORT);
                  this.props.navigation.goBack();
                }
              }else{
                this.showProgress(false);
               Toast.show('We\'re facing some technical issues!');
              }
              
            }).catch((err)=>{
              this.showProgress(false);
              console.log('err',err);
              Toast.show("Error in submitting !!!", Toast.SHORT);
            })
        }else{
          this.showProgress(false);
          Toast.show("please fill all fields !!!", Toast.SHORT);
        }
        
    }

    render(){
        return(
            <View style={{ flex: 1 }}>
                <Customheader height={350}
                    leftComponent={<Ionicons style={{padding:10}} color='white' name='ios-arrow-back' size={25}  onPress={()=>{this.props.navigation.goBack()}}/>} 
                    title={this.props.navigation.getParam('feedback')?'Edit Feedback':'Add Feedback'}
                    
                    />
                <View style={{ flex: 1, position: "relative", width:'100%', marginTop: -350, padding: 20, paddingTop: 0, paddingBottom:0 }}>
                        <Card containerStyle={{ padding:10, margin: 0, borderRadius:8, }} >
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
                            <View style={{ flex:1, height: '100%', flexDirection: "column", }}>
                                
                                <LabelView style={{ paddingBottom: 0 }} label='Username' empty={this.state.is_username_empty} >
                                    <TextInput
                                        editable={true}
                                        underlineColorAndroid='transparent'
                                        numberOfLines={1}
                                        style={{ fontSize: 13, width: '100%', paddingTop: 0, marginTop: 5 }}
                                        placeholder=" Enter Username"
                                        value={this.state.user_name}
                                        onChangeText={(value) => this.setState({ user_name: value })}
                                    />
                                </LabelView>

                                <LabelView label='Mobile' style={{ paddingBottom: 0 }} empty={this.state.is_mobile_empty} >
                                    <TextInput
                                        editable={true}
                                        underlineColorAndroid='transparent'
                                        numberOfLines={1}
                                        style={{ fontSize: 13, width: '100%', paddingTop: 0, marginTop: 5 }}
                                        placeholder="Enter Mobile"
                                        value={this.state.mobile}
                                        onChangeText={(value) => this.setState({ mobile: value })}
                                    />
                                </LabelView>

                                <LabelView label='Email Id' style={{ paddingBottom: 0 }}>
                                    <TextInput
                                        editable={true}
                                        underlineColorAndroid='transparent'
                                        numberOfLines={1}
                                        style={{ fontSize: 13, width: '100%', paddingTop: 0, marginTop: 5 }}
                                        placeholder="Enter Email Id"
                                        value={this.state.email_id}
                                        onChangeText={(value) => this.setState({ email_id: value })}
                                    />
                                </LabelView>

                                <LabelView label='Suggestion' style={{ paddingBottom: 0,minHeight:100 }} empty={this.state.is_suggestion_empty}>
                                    <TextInput
                                        editable={true}
                                        underlineColorAndroid='transparent'
                                        style={{ fontSize: 13, width: '100%', paddingTop: 0, marginTop: 5 }}
                                        multiline={true}
                                        placeholder="Enter Suggestion"
                                        value={this.state.suggestion}
                                        onChangeText={(value) => this.setState({ suggestion: value })}
                                    />
                                </LabelView>
                              

                                <LoginButton 
                                    style={{alignSelf:'center'}}
                                    onPress={()=>this.addEditFeedback()} 
                                    title='Submit' />
                            </View>

                        </ScrollView>  
                        </Card>

                </View>


                {this.state.isLoading?
                          <View style={{flex:1, elevation:2, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center',
                           justifyContent: 'center', position: 'absolute', width: '100%', height: '100%' }}>
                              <ActivityIndicator color='white' size='large' />
                              <Text style={commonStyle.loading_text}>{this.state.loading_message}</Text>
                          </View> : null}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    textTitle:{
        fontSize: 16,
        fontWeight: '500',
    }
})