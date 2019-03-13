import React, {Component} from 'react';
import {View,
  AsyncStorage,
  NetInfo,
  ActivityIndicator,
  Text,
} from 'react-native';
import PDFView from 'react-native-view-pdf';
import CustomHeader from '../../Components/Header';
import Entypo from 'react-native-vector-icons/Entypo';
import commonStyle from '../../styles';
export default class UserManual extends Component {

   constructor(props){
     super(props)
     this.state={
         userInfo:"",
         isConnected:false,
         isLoading:true,
         loading_message:'Loading...',
     }
   }


    async componentWillMount() {
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
         // console.log('login details', data);
          var dt = JSON.parse(data);
          // userInfo = dt;
          this.setState({userInfo: dt});
          console.log('dt',dt);
          // this.getVehicleHistoricalLocationList(dt);
          
        }).catch(err=>console.log('error occurred in user detail',err));
      }
  
 render() {
   return (
    <View style={{ flex: 1}}>
         <CustomHeader height={1} 
                      leftComponent={<Entypo name='menu' 
                                             color="#fff" 
                                             style={{padding:10}} 
                                             size={25} 
                                             onPress={()=>this.props.navigation.toggleDrawer()} />} 
                      title={this.state.userInfo.FullName?this.state.userInfo.FullName:'Vehicle List'} 
   
         />
                       <PDFView
                          style={{ flex: 1,padding:5 }}
                          onError={(error) => console.log('onError', error)}
                          onLoad={() => this.setState({isLoading:false})}
                          resource="https://mppvdp.com/Files/UserManual/MPPVDP_Portal_User%20manual.pdf"
                          resourceType="url"
                       />

                      {this.state.isLoading?
                          <View style={{flex:1, elevation:2, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center',
                           justifyContent: 'center', position: 'absolute', width: '100%', height: '100%' }}>
                              <ActivityIndicator color='white' size='large' />
                              <Text style={commonStyle.loading_text}>{this.state.loading_message}</Text>
                          </View> 
                          : 
                          null
                          }
     
      </View>
    );
  }
}