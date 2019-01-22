import React,{Component} from 'react';
import {TouchableHighlight,Text} from 'react-native';
import {Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const SubmitButton = (props) => {
    return(
      <Button
        title={props.title?props.title:'Submit'}
        ViewComponent={require('react-native-linear-gradient').default}
        linearGradientProps={{
          colors: props.disabled?['#cbc7c8','#cbc7c8','#cbc7c8']:['#560eea','#5c33ad', '#55025a'],
          start:{ x: 0.0, y: 0.0 },
          end:{ x: 1.0, y: 1.0 },
        }}
        containerViewStyle={{borderRadius:10}}
        buttonStyle={[{marginTop:10,marginBottom:10,borderRadius:10},props.style]}
        disabledStyle={{backgroundColor:'#b3b3b3'}}
        disabled={props.disabled}
        onPress={props.onPress}
      />
    );
} 

const LoginButton = (props) => {
  return(
    <Button
      title={props.title?props.title:'Submit'}
      //ViewComponent={require('react-native-linear-gradient').default}
      containerViewStyle={{borderRadius:10}}
      buttonStyle={[{width:200, height:50, marginTop:30,marginBottom:10,borderRadius:40,backgroundColor:'#fc4236' },props.style]}
      disabledStyle={{backgroundColor:'#b3b3b3'}}
      disabled={props.disabled}
      onPress={props.onPress}    
    />
  );
} 

export {SubmitButton, LoginButton} ;