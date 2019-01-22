import React,{Component} from 'react';
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
import colors from '../../colors';

export default class Menu extends Component {
    constructor(prop){
        super(prop);
        this.state = {
            userInfo: "",
            base_url: "",
        }
    }

    async componentWillMount(){
        var NodeInfo = JSON.parse(await AsyncStorage.getItem('NodeUrl'));
        console.log("nodeinfo", NodeInfo.NodeURL);
        this.setState({base_url:NodeInfo.NodeURL});

        this.getUserDetails();
    }

    getUserDetails = () => {
        AsyncStorage.getItem('userLoginDetail').then(data => {
          console.log('login details', data);
          var dt = JSON.parse(data);
          // userInfo = dt;
          this.setState({userInfo: dt});
          console.log('dt',dt);
          // this.getVehicleHistoricalLocationList(dt);
          
        }).catch(err=>console.log('error occurred in user detail',err));
    }

    getUserPhoto(){
        if(this.state.userInfo.Photo){
            if(this.state.userInfo.Photo==="NA.jpg" || this.state.userInfo.Photo==="M.jpg" || this.state.userInfo.Photo==="F.jpg"){
                return this.state.base_url + "Files/COMPANY/"+ this.state.userInfo.Photo;
            }else{
                return this.state.base_url + "Files/COMPANY/"+ this.state.userInfo.CompanyFolderName + this.state.userInfo.Photo;
            }
        }
        return "";
    }

    render(){
        return(
            <View style={styles.container}>
                <CustomHeader
                    leftComponent={<Image
                        style={{ width: 40, height: 40, resizeMode: 'center' }}
                        source={require('../../assets/logo_bd.png')} />}
                    centerComponent={{ text: 'ANPR LIVE', style: { color: '#fff', fontSize: 20, fontFamily: 'Montserrat-Regular' } }}
                    // rightComponent={
                    //     <Feather name="more-vertical" style={{ padding: 10 }} color="#fff" size={18} onPress={() => this.logout()} />
                    // } 
                    />
                <View style={{ flex:1, marginTop:-150 }}>
                    <View style={{ height:150, padding:10, alignItems:'center', justifyContent:'center' }}>
                        <Avatar
                            size="large"
                            rounded
                            source={{ uri: this.getUserPhoto() }}
                            onPress={() => console.log("Works!")}
                            activeOpacity={0.7}
                        />
                        <Text style={styles.title_text}>{this.state.userInfo.FullName}</Text>
                        <Text style={styles.subtitle_text}>{this.state.userInfo.Email}</Text>
                        <Text style={styles.subtitle_text}>({this.state.userInfo.RoleName})</Text>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('VehicleNotMatched')}>
                            <View style={styles.menu_view}>
                                <Text style={{ flex: 1 }}>Suspected Vehicle Not Matched Mp Transport</Text>
                                <FontAwesome name="angle-right" size={20} style={{ padding: 10 }} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('ImpossibleSpace')}>
                            <View style={styles.menu_view}>
                                <Text style={{ flex: 1 }}>Suspected Vehicle Imposible Space</Text>
                                <FontAwesome name="angle-right" size={20} style={{ padding: 10 }} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('VehicleExpire')}>
                            <View style={styles.menu_view}>
                                <Text style={{ flex: 1 }}>Vehicle Expiry Registration</Text>
                                <FontAwesome name="angle-right" size={20} style={{ padding: 10 }} />
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    title_text:{
        fontSize:18,
        color:'#fff',
        marginTop:10
    },
    subtitle_text:{
        color:'#fff'
    },
    text:{
    },
    menu_view:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:20,
        borderBottomWidth:1,
        borderBottomColor:'#cacaca',
        padding:10,
        paddingLeft:0
    }
});