import React,{Component} from 'react';
import {View,StyleSheet, Dimensions,Text, Platform, TouchableOpacity} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker, Callout } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import colors from '../../colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

//import PriceMarker from '../../../examples/PriceMarker';

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 23.259933;
const LONGITUDE = 77.412613;
const LATITUDE_DELTA = 20.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

// const marker = [
//     {
//         latitude: 23.230624,
//         longitude: 77.428923
//     },
//     {
//         latitude: 23.232168,
//         longitude: 77.472000
//     },
//     {
//         latitude: 23.250000,
//         longitude: 77.466183
//     },
//     {
//         latitude: 23.275828,
//         longitude: 77.414857
//     },
//     {
//         latitude: 23.278693,
//         longitude: 77.393290
//     },
//     {
//         latitude: 23.271854,
//         longitude: 77.340397
//     }
// ]

const MarkerPoint = (props) => {
    return (
        <View style={styles.point_container}>
        <View style={[styles.bubble,props.style]}>
          <Text style={[styles.amount, { fontSize: props.fontSize }]}>{props.amount}</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    )
}

export default class CustomMap extends Component {
    constructor(prop){
        super(prop);
        //console.log('Markers',this.getMapDatafromList(prop.navigation.getParam('vehicle_data')));
        this.state = {
            markers: this.getMapDatafromList(prop.navigation.getParam('vehicle_data')),
            // markers: marker,
            start_coordinate: this.getMapDatafromList(prop.navigation.getParam('vehicle_data')).length>0?this.getMapDatafromList(prop.navigation.getParam('vehicle_data'))[0]:
            {
                latitude: 0.0,
                longitude: 0.0
            },
            count: 1,
            //intialCoordinate:markers[0]
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            this.fitAllMarkers(this.state.markers);
        },1000)
        
    }

    static navigationOptions = ({ navigation }) => {
        return {
            //title:navigation.getParam('vehicle_data')[0].LicenseNum,
            headerStyle: {backgroundColor: colors.headerColor},
            headerTintColor: '#fff',
        }
    }

    getMapDatafromList(data){
        var markers = [];
        data.map((item)=>{
            var object = {};
            object['latitude'] = parseFloat(item.Latitude);
            object['longitude'] = parseFloat(item.Longitude);
            markers.push(object);
        })
        return markers;
    }

    fitAllMarkers(markers) {
        this.map.fitToCoordinates(markers, {
          edgePadding: DEFAULT_PADDING,
          animated: true,
        });
    }

    animate=()=>{
        if (this.state.count < this.state.markers.length) {
        if (Platform.OS === 'android') {
            if (this.marker) {
              this.marker._component.animateMarkerToCoordinate(this.state.markers[this.state.count], 1600);
            }
          } else {
            coordinate.timing(this.state.markers[this.state.count]).start();
        }
            this.setState({ count: this.state.count + 1 });
            setTimeout(() => {
                this.animate()
            }, 1600);
        }
        else{
            this.setState({ count: 1 });
            if (Platform.OS === 'android') {
                if (this.marker) {
                  this.marker._component.animateMarkerToCoordinate(this.state.markers[0], 1600);
                }
              } else {
                coordinate.timing(this.state.markers[0]).start();
            }
        }
        // else{
        //     this.setState({count:1});
        //     this.marker.coordinate = this.state.markers[0];
        //     //()=>this.animate();
        // }
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <CustomHeader height={1}
                    leftComponent={<Image
                        style={{ width: 40, height: 40, resizeMode: 'center' }}
                        source={require('../../assets/logo_bd.png')} />}
                    centerComponent={{ text: 'ANPR LIVE', style: { color: '#fff', fontSize: 20, fontFamily: 'Montserrat-Regular' } }}
                    /> */}
                <MapView
                    ref={ref => { this.map = ref; }}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    // region={{
                    //     latitude: 37.78825,
                    //     longitude: -122.4324,
                    //     latitudeDelta: 0.015,
                    //     longitudeDelta: 0.0121,
                    // }}
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >

                    <Polyline
                        // {this.state.markers.map(marker => (
                        // <Marker
                        // coordinate={marker.coordinate}
                        // // title={marker.title}
                        // // description={marker.description}
                        // />
                        // ))} 

                        coordinates={this.state.markers}
                        strokeColor="#000"
                        strokeColors={[
                            '#7F0000',
                            '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                            '#B24112',
                            '#E5845C',
                            '#238C23',
                            '#7F0000'
                        ]}
                        strokeWidth={3}

                    />

                    {/* <Marker
                        coordinate={this.state.markers[0]}
                    /> */}
                     <Marker.Animated
                              ref={marker => { this.marker = marker; }}
                              coordinate={this.state.markers[0]}
                              // onPress={()=>this.animate()}
                              >
                           {/* <MarkerPoint amount={'Start'}  style={{backgroundColor:'green'}} fontSize={13}/> */}
                           {/* <FontAwesome name="dot-circle-o" size={30} style={{color:'green'}}/> */}
                           <Entypo name="location-pin" size={35} style={{color:'green'}}/>
                     </Marker.Animated>

                    {this.state.markers.map((marker,key) => {
                        if(key==0){
                            return ( 
                                // <Marker.Animated
                                //     ref={marker => { this.marker = marker; }}
                                //     key={key}
                                //     coordinate={marker}
                                //     pinColor='green'
                                //     onPress={()=>this.animate()}
                                //     zIndex={this.state.markers.length}
                                // >
                                // {/* <MarkerPoint amount={'Start'}  style={{backgroundColor:'green'}} fontSize={13}/> */}
                                //     {/* <Callout style={styles.plainView}> */}

                                //         {/* <View style={{padding:5, backgroundColor:'green'}}>
                                //             <Text style={{color:'#fff'}}>Start</Text>
                                //         </View> */}
                                //     {/* </Callout> */}
                                // </Marker.Animated>
                          <Marker
                                //ref={marker => { this.marker = marker; }}
                                key={key}
                                coordinate={marker}
                                pinColor='green'
                                //onPress={()=>this.animate()}
                                >
                               
                           <MarkerPoint amount={'Start'}  style={{backgroundColor:'green'}} fontSize={13}/>
                          </Marker>
                            )
                        }else if(key>=this.state.markers.length-1){
                            return ( 
                                <Marker
                                    key={key}
                                    coordinate={marker}
                                >
                                <MarkerPoint amount={'End'} style={{backgroundColor:'blue'}}  fontSize={13}/>
                                    {/* <Callout style={styles.plainView}> */}
                                        {/* <View  style={{padding:5,backgroundColor:'blue'}}>
                                            <Text style={{color:'#fff'}}>End</Text>
                                        </View> */}
                                    {/* </Callout> */}
                                </Marker>
                            )
                        }else{
                            return ( 
                                <Marker
                                    key={key}
                                    coordinate={marker}
                                >
                                </Marker>
                            )
                        }
                        
                    })}

                    

                </MapView>

                <View style = {styles.buttonContainer}>
                    <TouchableOpacity onPress = {() => {this.animate()}}
                        style = {[styles.bubble_button, styles.button]}>
                        <Text>Movement's</Text> 
                    </TouchableOpacity> 
                </View>
               

       </View>
       
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: "100%",
        width: "100%",
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    point_container: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
    },
    bubble: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#FF5A5F',
        padding: 5,
        borderRadius: 3,
        borderColor: '#D23F44',
        borderWidth: 0.5,
    },
    dollar: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    amount: {
        color: '#FFFFFF',
        fontSize: 13,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#FF5A5F',
        alignSelf: 'center',
        marginTop: -9,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#D23F44',
        alignSelf: 'center',
        marginTop: -0.5,
    },
    bubble_button: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
      },
      latlng: {
        width: 200,
        alignItems: 'stretch',
      },
      button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
      },
      buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
      },
});