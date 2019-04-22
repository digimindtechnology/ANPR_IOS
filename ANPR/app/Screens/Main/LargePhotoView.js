import React,{Component} from 'react';
import {Text,Modal,TouchableOpacity,View,Image} from 'react-native';
import PhotoView from 'react-native-photo-view';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomHeader from '../../Components/Header';

export default class LargePhotoView extends Component{
constructor(props){
  super(props);
  this.state={
    image_url:this.props.navigation.getParam('image_url'),
    vehical_num:this.props.navigation.getParam('vehical_num')
  }
}
 

render(){   
  console.log('Image Url:',this.state.image_url);     
    return(
       <View style={{flex:1}}>
           <CustomHeader height={1} 
           leftComponent={<Entypo name='chevron-left' color="#fff" style={{padding:10}} size={25} onPress={()=>this.props.navigation.goBack()} />} 
           title={this.state.vehical_num}         
           />
             <View style={{ flex:1 }}>          
             <PhotoView
              source={{uri:this.state.image_url}}               
              maximumZoomScale={6}
              androidScaleType="fitXY"
              //onLoad={() => console.log("Image loaded!")}
              style={{width:'100%', height: '100%'}} />
             </View>
        </View>  
        
    );
  }
}
