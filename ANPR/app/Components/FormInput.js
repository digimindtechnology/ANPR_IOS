import React,{Component} from 'react';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';


export default class FormInput extends Component{
    render(){
        const { icon, refInput, ...otherProps } = this.props;
        return(
            <Input
                {...otherProps}
                ref={refInput}
                inputContainerStyle={styles.input_container_style}
                inputStyle={styles.input_style}
                autoFocus={false}
                autoCapitalize="none"
                keyboardAppearance="dark"
                errorStyle={styles.errorInputStyle}
                autoCorrect={false}
                blurOnSubmit={false}
                placeholderTextColor={'#a3a3a3'}
            />
        );
    }
}

const styles = StyleSheet.create({
    input_style:{
        backgroundColor:'#ffffff00', 
        color:'#000', 
        padding:10,
        height:50,
        marginLeft:0,
      },
      input_container_style:{
        backgroundColor:'#ffffff',
        marginTop:30,
        borderColor: '#314399',
        borderWidth:1,
        borderRadius: 5,
      },
      errorInputStyle: {
        marginTop: 0,
        textAlign: 'center',
        color: '#F44336',
      },
});