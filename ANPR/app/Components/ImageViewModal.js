import React,{Component} from 'react';
import {Text,Modal,TouchableOpacity,View} from 'react-native';
import PhotoView from 'react-native-photo-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default class ImageViewModal extends Component{

render(){        
    return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
     
        <View style={{ flex: 1, backgroundColor: '#ffffff'}}>  
       
           <View style={{ height:'25%' }}>
             <TouchableOpacity style={{ flex: 1}} 
          
             />
           </View>
         <View style={{ flex:1,marginLeft:10,marginRight:10, backgroundColor: 'white' }}>
  
          <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
         
              <PhotoView
              source={this.props.source}               
              maximumZoomScale={6}
              androidScaleType="fitXY"
              onLoad={() => console.log("Image loaded!")}
              style={{width:'100%', height: '100%'}} />   
        
         </View>
  
    
       </View>
      <View style={{ height:'25%'}}>
          <TouchableOpacity style={{ flex: 1}} 
         
          />
      </View>
    </View>
    
           <View style={{ width:'100%', flexDirection: 'row',position:'absolute',backgroundColor:'#fff',alignItems:'center' }}>
    
    <TouchableOpacity activeOpacity={.3}
    style={{
       width: 30,
       height: 30
     }}
    onPress={this.props.onPress}>
    <MaterialCommunityIcons name='close'
                        color='red'
                        size={30} />
    </TouchableOpacity>
    
    <Text style={{ textAlign:'center', flex:1, fontSize: 20 }}>{this.props.Text}</Text>
    
    </View>
      </Modal>
     
    );
  }
}