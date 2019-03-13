import React from 'react';
import {StackNavigator,TabNavigator,TabBarBottom, DrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import {
    Platform,
    StyleSheet,
    Text,
    AsyncStorage,
    ScrollView,
    Image,
    DrawerLayoutAndroid,
    View,TouchableOpacity,
} from 'react-native';
import VehicleHistoricalLocation from './VehicleHistoricalLocation';
import MapView from './MapView';
import More from './MenuScreen';
import Notification from './Notification';
import MPTransport from './MPTransport';
import VehicleNotMatched from './VehicleNotMatched';
import ImpossibleSpace from './ImpossibleSpace';
import StolenVehicle from './StolenVehicle';
import VehicleDetail from './VehicleDetail';
import OwnerDetails from './OwnerDetails'
import Feedback from './FeedbackList';
import AddFeedback from './AddFeedback';
import OwnershipSearch from './OwnershipSearch';
import Assets from '../../assets/stolen_icon.png'
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import UserManual from './UserManual';

const HomeTab = TabNavigator(
    {
        ALERT: {
            screen: Notification,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarIcon: ({ tintColor }) => <MaterialIcons name="notifications" color={tintColor} size={20} />,
                tabBarLabel: 'Notification',
            })
        },
        ANPRLOG: {
            screen: VehicleHistoricalLocation,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="car-connected" color={tintColor} size={20} />,
                tabBarLabel: 'Vehicle Location',
            })
        },
        MPTRANSPORT: {
            screen: MPTransport,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarIcon: ({ tintColor }) => <MaterialIcons name="directions-car" color={tintColor} size={20} />,
                tabBarLabel: 'MP Transport',
            })
        },
        MORE:{
            screen: More,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarIcon: ({ tintColor }) => <MaterialIcons name="more-vert" color={tintColor} size={18}/>,
                tabBarLabel: 'MORE',
            })
        }

    },
    {
        tabBarOptions: {
          activeTintColor: '#3949ab',
          inactiveTintColor: 'gray',
          //showLabel: false,
        },
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled:false,
        animationEnabled: true,
        initialRouteName: 'ALERT',
      //   lazy:false,
        
      }
);

const SuspectedVehicleTab = TabNavigator(
    {
        VehicleNotMatched: {
            screen: VehicleNotMatched,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarLabel: 'Not Found In MPTransport',
                tabBarIcon: <Image style={{width:25, height:25}} source={require('../../assets/data_base.png')} />
            })
        },
        ImpossibleSpace: {
            screen: ImpossibleSpace,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarLabel: 'Impossible Space Time',
                tabBarIcon: <Image style={{width:25, height:25}} source={require('../../assets/time.png')} />
            })
        },
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled:true,
        initialRouteName: 'VehicleNotMatched'
    }
)

const FeedbackStack = StackNavigator(
    {
        Feedback: {
            screen: Feedback,
            navigationOptions: ({ navigation }) => ({
                header: null,
            })
        },
        AddFeedback: {
            screen: AddFeedback,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        }
    },{
        initialRouteName: 'Feedback'
    }
)

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={{width:'100%',height:200}}>
            <Image source={require('../../assets/logo_bd.png')} style={{width:'100%',height:200}} resizeMode='center' />
        </View>
        <DrawerItems {...props} />
      </SafeAreaView>
    </ScrollView>
  );

const HomeDrawer = DrawerNavigator(
    {
        ANPRLOG: {
            screen: VehicleHistoricalLocation,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'Vehicle Historical Location',
                //drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="map-marker-multiple" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 27, height: 27}}
                source={require('../../assets/place-marker.png')}
                />
            })
        },
        VehicleExpire: {
            screen: StolenVehicle,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'Stolen Vehicle',
                //drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="car-wash" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 26, height: 26}}
                source={require('../../assets/stolen_icon.png')}
                />
            })
        },
        MPTRANSPORT: {
            screen: MPTransport,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'MPTransport',
                //drawerIcon: ({ tintColor }) => <MaterialIcons name="search" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 27, height: 27}}
                source={require('../../assets/tranport.png')}
                />
            })
        },
        SuspectedVehicle: {
            screen: SuspectedVehicleTab,
            navigationOptions: ({ navigation }) =>({
                drawerLabel: 'Suspected Vehicle',
                //drawerIcon: ({ tintColor }) => <SimpleLineIcons name="question" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 22, height: 22}}
                source={require('../../assets/suspected_icon.png')}
                />
            })
        },
        FeedbackStack: {
            screen: FeedbackStack,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'Feedback',
                //drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="comment-processing-outline" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 27, height: 27}}
                source={require('../../assets/feedback.png')}
                />
            })
        },
        OwnershipSearch: {
            screen: OwnershipSearch,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'Ownership Search',
                //drawerIcon: ({ tintColor }) => <FontAwesome name="id-card-o" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 28, height: 28}}
                source={require('../../assets/ownership.png')}
                />
            })
        },
        Notification: {
            screen: Notification,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'Notification',
                //drawerIcon: ({ tintColor }) => <MaterialIcons name="notifications-none" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 28, height: 28}}
                source={require('../../assets/notification.png')}
                />
            })
        },
        UserManual:{
            screen: UserManual,
            navigationOptions: ({navigation})=>({
                header:null,
                drawerLabel:'User Manual',
                drawerIcon:<Image
                style={{width:25,height:25}}
                source={require('../../assets/usermanual.png')}
                />
            })
        },
        Logout: {
            screen: ({navigation})=>{
                navigation.navigate('Auth'); 
                AsyncStorage.removeItem("isLogin").then(()=>{
                    console.log('remove item','logoutsuccess')
                    Toast.show('Logout Succesfull!!');
                })
                return null;
            },
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'Logout',
                //drawerIcon: ({ tintColor }) => <Feather name="power" color={tintColor} size={20} />,
                drawerIcon: <Image 
                style={{width: 26, height: 26}}
                source={require('../../assets/logout.png')}
                />,
            })
        }
    },
    {
        contentOptions: {
          activeTintColor: '#3949ab',
          inactiveTintColor: 'gray',
          labelStyle :{
              fontSize:16,
          }
        },
        contentComponent: CustomDrawerContentComponent,
        drawerType: 'slide',
        initialRouteName: 'ANPRLOG',
      //   lazy:false,
        
      }
)

const HomeStack = StackNavigator(
    {
        HomeDrawer: {
            screen: HomeDrawer,
            navigationOptions: ({ navigation }) => ({
                header: null,
            })
        },
        MapView: {
            screen: MapView,
        },
        VehicleDetail: {
            screen: VehicleDetail,
        }, OwnerDetails: {
            screen: OwnerDetails,
        },
        // VehicleNotMatched: {
        //     screen: VehicleNotMatched,
        //     navigationOptions: ({ navigation }) => ({
        //         header: null,
        //     })
        // },
        // VehicleDetail: {
        //     screen: VehicleDetail,
        // },
        // ImpossibleSpace: {
        //     screen: ImpossibleSpace,
        //     navigationOptions: ({ navigation }) => ({
        //         header: null,
        //     })
        // },
        // VehicleExpire: {
        //     screen: VehicleExpire,
        //     navigationOptions: ({ navigation }) => ({
        //         header: null,
        //     })
        // }
    },
    {
        initialRouteName: 'HomeDrawer',
    }
  );

  

  
  export default HomeStack;


  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });