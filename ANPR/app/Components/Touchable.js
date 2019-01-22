import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class Touchable extends Component {
    constructor(props) {
        super(props);
        this.state={
            active : false
        }
    }
    render(){
        return (
            <TouchableHighlight style={{flex: 1, padding: 5,}}
                onPress={this.props.onPress}
                underlayColor="#5d2eb3"
                onHideUnderlay={() => { this.setState({ active: false }) }}
                onShowUnderlay={() => { this.setState({ active: true }) }}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    {/* <FontAwesome name={'line-chart'} color={'#4d4d4d'} /> */}
                    <FontAwesome name={this.props.iconname} color={this.state.active ? "#FFFFFF" : '#4d4d4d'} />
                    <Text style={{ color: this.state.active ? "#FFFFFF" : '#4d4d4d', fontSize: 8, marginLeft: 5 ,fontFamily:'Montserrat-Regular' }}>{this.props.text}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}


// const Touchable = (props) => {
//     this.state={
//         active : false
//     }
//     return (
//         <TouchableHighlight style={{flex: 1, padding: 5,}}
//             onPress={props.onPress}
//             underlayColor="#5d2eb3"
//             onHideUnderlay={() => { this.setState({ active: false }) }}
//             onShowUnderlay={() => { this.setState({ active: true }) }}>
//             <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
//                 {/* <FontAwesome name={'line-chart'} color={'#4d4d4d'} /> */}
//                 <FontAwesome name={props.iconname} color={this.state.active ? "#FFFFFF" : '#4d4d4d'} />
//                 <Text style={{ color: this.state.active ? "#FFFFFF" : '#4d4d4d', fontSize: 8, marginLeft: 5 }}>{props.text}</Text>
//             </View>
//         </TouchableHighlight>
//     );
// }

//export { Touchable };