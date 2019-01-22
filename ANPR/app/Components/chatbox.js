import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  ScrollView,
  Platform,
  PermissionsAndroid,
  StatusBar,
  Linking,Keyboard,
  Dimensions,
  LayoutAnimation,
  UIManager,
  AsyncStorage,
  KeyboardAvoidingView,
} from 'react-native';
import { Input, Button, Icon,Card, } from 'react-native-elements';

import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
//import { Item } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/'
import Ionicons from 'react-native-vector-icons/Ionicons';




export default class ChatBox extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
       
      };
    }



    render() {
      
        return (
            this.props.isRight?
            <View style={{ width: "100%", flexDirection: "row", marginTop: 10, }}>

                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    <View style={{
                        margin: 0, borderTopLeftRadius: 10, backgroundColor: "#fff", marginLeft: 60,
                        borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: "center", padding: 5, paddingLeft: 15, paddingRight: 10
                    }} >
                        <Text style={{ fontSize: 14, textAlign: "right" }}>{this.props.item.comment}</Text>
                    </View>

                    <View style={styles.triangleRightCorner} />
                </View>

                <View style={{ flex: 0.2 }}>
                    <Card containerStyle={{ alignItems: "center", justifyContent: "center", width: 50, height: 50, margin: 0, borderRadius: 25, backgroundColor: "#8871f5" }}>
                        <Ionicons name="md-person" size={25} color="white" />
                    </Card>
                </View>

            </View>
          :

            <View style={{ width: "100%", flexDirection: "row", marginTop: 10, }}>

                     <View style={{ flex: 0.2,alignItems:"flex-end" }}>
                        <Card containerStyle={{ alignItems: "center", justifyContent: "center", width: 50, height: 50, margin: 0, borderRadius: 25, backgroundColor: "#fff" }}>
                            <Ionicons name="md-person" size={25} color="#8871f5" />
                        </Card>
                    </View>


                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
                   
                    <View style={styles.triangleLeftCorner} />

                    <View style={{
                        flexDirection:"column", flex:1,
                        margin: 0, borderTopRightRadius: 10, backgroundColor: "#8871f5", marginRight: 60,
                        borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: "center", padding: 5, paddingLeft: 15, paddingRight: 10
                    }} >
                        <Text style={{ fontSize: 14, textAlign: "left",color:"white" }}>{this.props.item.comment}</Text>
                        <Text style={{ fontSize: 10,color:"white" ,alignSelf:"flex-end",marginTop:5}}>By: {this.props.item.created_user_name}</Text>
                    </View>


                </View>

               

            </View>
        );
    }
}

const styles = StyleSheet.create({

    triangleRightCorner: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 20,
        borderTopWidth: 15,
        borderRightColor: 'transparent',
        borderTopColor: 'white'
        },

        triangleLeftCorner: {
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth:20,
            borderTopWidth: 15,
            borderLeftColor: 'transparent',
            borderTopColor: '#8871f5',
            // transform: [
            //     {rotate: '90deg'}
            //   ]
            },


});