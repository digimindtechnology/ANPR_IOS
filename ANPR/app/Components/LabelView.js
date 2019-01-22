import React,{Component} from 'react';
import {StyleSheet,View,Text} from 'react-native';
import {Input} from 'react-native-elements';
import colors from '../colors';


export default class LabelView extends Component{
    render(){
        
        return(
            <View style={{marginTop:10,marginBottom:10}} >
            <View style={[{backgroundColor:'#e6e7e9',borderColor:this.props.empty?'red':'#b3b3b3',borderWidth:1,borderRadius:8, padding:8, paddingLeft:10},this.props.style]} >
                {this.props.children}
            </View>
            <Text style={{paddingLeft:10,paddingRight:10,paddingBottom:3,paddingTop:2,
                backgroundColor:colors.statusColor,color:'#fff',fontSize:12,
                borderRadius:10, position:'absolute',marginTop:-8,marginLeft:15
            }}>
                {this.props.label}
            </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input_style:{
        backgroundColor:'#ffffff40', 
        color:'#fff', 
        padding:10,
        height:50,
        marginLeft:0,
      },
      input_container_style:{
        backgroundColor:'#ffffff00',
        marginTop:30,
        borderColor: '#bf8cce',
        borderWidth:1,
        borderRadius: 5,
      },
      errorInputStyle: {
        marginTop: 0,
        textAlign: 'center',
        color: '#F44336',
      },
});