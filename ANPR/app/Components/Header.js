import React,{Component} from 'react';
import {View,Platform} from 'react-native';
import {Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import col from '../colors';


const size = 150;

export default class AppHeader extends Component{

    render(){
        return(
            <View>
                <Header 
                    // statusBarProps={{ backgroundColor: '#93e7ff' }}
                    statusBarProps={{ backgroundColor: '#1e3d7d' }}
                    // backgroundColor='#93e7ff'
                    backgroundColor='#1e3d7d'
                   // containerStyle={{ borderBottomWidth: 0 }}
                    containerStyle={{ marginTop:0, paddingTop:(Platform.OS=='ios'?10:0), borderBottomWidth: 0, height: (Platform.OS === 'ios' ? 70 : 50) }}
                    leftComponent={this.props.leftComponent}
                    rightComponent={this.props.rightComponent}
                    centerComponent={this.props.title?{ text: this.props.title, style: { color: "#fff", fontSize: 20,fontFamily:'Montserrat-Regular' } }:this.props.centerComponent}
                />
                <LinearGradient
                    // colors={['#93e7ff', '#3176bb', '#0c1125']}
                    colors={['#1e3d7d', '#1e3d7d', '#1e3d7d']}
                    // start={{ x: 0.0, y: 0.25 }}
                    // end={{ x: 0.5, y: 1.0 }}
                    style={{ height: this.props.height ? this.props.height : size }}>
                </LinearGradient>
            </View>
        );
    }

}