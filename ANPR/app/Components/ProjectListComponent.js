
import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, View, TouchableOpacity, Image} from 'react-native';
import {List, ListItem, Text, Slider, Card, Avatar } from 'react-native-elements';
const colorbg = [
    '#2CC5EE',
    '#4BECCB',
    '#6BA1EB',
    '#8871F5',
    '#F4C573'
]

export default class ProjectListComponent extends Component {
    constructor(props){
        super(props);
    }
    // shouldComponentUpdate (nextProps, nextState) {
    //     return this.props.projectListData != nextProps.projectListData ||
    //         this.props.loading != nextProps.loading;
    // }

    generateColor(){
        var co = Math.floor(Math.random() * (4+1));
        return colorbg[co];
        // return 5;
        
    }
    generatePercentage(dt){
        var co = Math.round(dt);
        return co;
        // return 5;
        
    }
    generateAvatar(dt){
        var a = dt;
        var b = a.split(" ");
        var rt = "";
        if(b.length>=2){
            var ab = b[0].charAt(0)+b[1].charAt(0);
            rt = ab.toUpperCase();
        }
        else{
            var ab = b[0].charAt(0)+b[0].charAt(1);
            rt = ab.toUpperCase();
        }
        return rt;
    }
    componentDidMount(){
        console.log('projects are',this.props)
    }
  
  render() {
    const {projectListData, loading, navigate} = this.props;
    console.log('Projects are; ',projectListData);
    if(loading){
        return <ActivityIndicator style={styles.activityIndicator} size="large"/>
    }
    if(projectListData==null){
        return <Text h4 style={styles.oops}>No projects available</Text>
    }
    if(projectListData.length==0 || projectListData==null){
        return <Text h4 style={styles.oops}>No projects available</Text>
    }
    return (
        <View>
  {
    projectListData.map((item, i) => (
        <TouchableOpacity onPress={()=>navigate(item)}>
        <View>
        <Card containerStyle={{margin:15,marginLeft:20,flex:1,padding:2, borderRadius:7}}>
        
        <ListItem
        key={i}
        containerStyle={styles.listItem}
        leftIcon={
            <View style={{
                backgroundColor: 'transparent',
                borderRadius:10,
                width:40,
                height:40
            }}>
            
              {/* <Text style={styles.subtitleText}>{item.icontext}</Text> */}
            </View>
          }
          title={
            <View style={styles.titleView}>
                <Text style={styles.titleText}>{item.activity_name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                <Slider
                    animateTransitions={true}
                    animationType='timing'
                    minimumValue={0}
                    maximumValue={100}
                    value={item.progress_percentage}
                    disabled={true}
                    minimumTrackTintColor={item.progress_percentage> 0 ? '#0dc629' : 'transparent'}
                    maximumTrackTintColor={item.progress_percentage>99 ? '#0dc629' : '#b3b3b3'}
                    thumbTintColor='transparent' style={{/*width:'85%',*/flex:10,marginLeft:10,}}/>
                    <Text style={{fontWeight:'400',fontSize:10,flex:2,color:'#000',marginLeft:1,fontFamily:'Montserrat-Regular'}}>{this.generatePercentage(item.progress_percentage)}%</Text>
                </View>
                
            </View>
          }

          rightIcon={
            <View style={styles.rightIconView}>
            {
                // item.isOwner ? <Image source={require('../assets/app_icon/owner.png')} borderRadius={15} style={styles.rightbadgeIcon}/>
                // :null
                //<Image source={require('../assets/app_icon/blank.png')} borderRadius={15} style={styles.rightbadgeIcon}/>
            }
            
            <View style={{flexDirection:'row',alignContent:'center',alignItems:'center'}}>
                <Text style={[styles.rightIconText,{textAlign:'right'}]}>{item.CompletedActivities}</Text><Text style={[styles.rightIconText,{color:'#520459'}]}>/ {item.TotalActivities}</Text>
            </View>
              
              <Text style={styles.rightIconSubText}>TASK</Text>
            </View>
          }
      />  
      {/* </TouchableOpacity> */}
      </Card>
      <Avatar
      size="medium"
      title={this.generateAvatar(item.activity_name)}
      height={60}
      width={60}
      overlayContainerStyle={{backgroundColor: 'rgba(255,255,255,0.4)'}}
      containerStyle={{ backgroundColor: this.generateColor(), borderRadius: 4,marginLeft:15,marginTop:-68,marginBottom:12, elevation: 2, fontFamily:'Montserrat-SemiBold' }}
  />
  </View>
  </TouchableOpacity>
    ))
  }
</View>
    )
  }
}

const styles = StyleSheet.create({
    listHead: {
        backgroundColor:'transparent'
    },
    listItem: {
        margin:0,
        padding:0,
        paddingTop:3,
        paddingBottom:5,
        borderColor:'rgba(0,0,0,0.5)',
        borderWidth:0,
    },
    activityIndicator: {
        marginTop: '50%',
    },
    oops:{
        marginTop: '50%',
        color:'grey',
        alignSelf : 'center'
    },
    subtitleText: {
        alignSelf:'center',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 30,
        padding:8
    },
    subtitleView:{
        backgroundColor: '#8342f4',
        borderRadius:5,
        width:60,
        height:60
    },
    titleText: {
        color: '#8342f4',
        fontSize: 14,
        fontWeight:'400',
        paddingLeft:8,
        fontFamily:'Montserrat-Regular'
    },
    titleView:{
        backgroundColor: 'transparent',
    },
    rightIconView : {
        backgroundColor: '#dbd7e2',
        borderRadius:5,
        width:60,
        height:60,
        alignContent:'center',
    },
    rightIconText: {
        flex:1,
        // alignSelf:'center',
        color: 'rgba(0,0,0,0.5)',
        fontSize: 10,
        padding:1,
        fontFamily:'Montserrat-Regular'
    },
    rightIconSubText: {
        alignSelf:'center',
        color: '#253672',
        fontSize: 12,
        padding:1,
        fontFamily:'Montserrat-Regular'
    },
    rightbadge : {
        alignSelf:'flex-end',
        color: '#39B54A',
        backgroundColor:'#39B54A',
        fontSize: 1,
        padding:6,
        borderRadius:10
    },
    rightbadgeIcon : {
        alignSelf:'flex-end',
        borderRadius:50,
        borderTopLeftRadius: 10,
        width:15,
        height:15
    }
  })

