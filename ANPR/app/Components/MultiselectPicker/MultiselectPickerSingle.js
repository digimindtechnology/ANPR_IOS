import React, {Component} from 'react';
import {View,Text,StyleSheet,TextInput,TouchableHighlight,TouchableOpacity, TouchableWithoutFeedback, Modal,DatePickerAndroid,TimePickerAndroid,AsyncStorage} from 'react-native';
//import {Container, Header, Left, Body, Right,Form,Label,Input, Fab,Item,Spinner,Row,Picker,Col,Card,CardItem,Icon,ListItem,  Content, Title, Textarea} from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MultiSelect from './react-native-multi-select';
import find from 'lodash/find';
import reject from 'lodash/reject';
import get from 'lodash/get';

import colors from '../../colors';



export default class MultiPickerSingle extends Component{
    constructor(props){
        super(props)

        this.state = {
            usermodalVisible:false,
        }

    }

    closeModal = ()=>{
        console.log('Contacts',this.multiselectUsers);
        this.setState({usermodalVisible:false});
      }

      _displaySelectedItems = optionalSelctedItems => {
        const {
          fontFamily,
          tagRemoveIconColor,
          tagBorderColor,
          uniqueKey,
          tagTextColor,
          selectedItems,
          displayKey
        } = this.props;
        const actualSelectedItems = optionalSelctedItems || selectedItems;
        return actualSelectedItems.map(singleSelectedItem => {
          const item = this._findItem(singleSelectedItem);
          if (!item[displayKey]) return null;
          console.log('item',item)
          return (
            <View
              style={[
                styles.selectedItem,
                {
                  width: item[displayKey].length * 8 + 60,
                  justifyContent: 'center',
                  height: 40,
                  borderColor: tagBorderColor
                }
              ]}
              key={item[uniqueKey]}
            >
              <Text
                style={[
                  {
                    flex: 1,
                    color: tagTextColor,
                    fontSize: 15
                  },
                  fontFamily ? { fontFamily } : {}
                ]}
                numberOfLines={1}
              >
                {item[displayKey]}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this._removeItem(item);
                }}
              >
                {/* <Icon
                  name="close-circle"
                  style={{
                    color: tagRemoveIconColor,
                    fontSize: 22,
                    marginLeft: 10
                  }}
                /> */}
              </TouchableOpacity>
            </View>
          );
        });
      };

      getSelectedItemsExt = (optionalSelctedItems) => (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
        {console.log('optionalSelctedItems',optionalSelctedItems)}
          {this._displaySelectedItems(optionalSelctedItems)}
        </View>
      );

      _removeItem = item => {
        const { uniqueKey, selectedItems, onSelectedItemsChange } = this.props;
        const newItems = reject(
          selectedItems,
          singleItem => item[uniqueKey] === singleItem
        );
        // broadcast new selected items state to parent component
        onSelectedItemsChange(newItems);
      };

      _findItem = itemKey => {
        const { items, uniqueKey } = this.props;
        return find(items, singleItem => singleItem[uniqueKey] === itemKey) || {};
      };

    render(){
        return(
            <View style={{width:'90%'}}>
                <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.usermodalVisible}
              onRequestClose={() => {
                this.setState({ usermodalVisible: false })
              }}>
              <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <MultiSelect
                  hideTags
                  selector
                  single={this.props.single}
                  autoFocusInput={false}
                  items={this.props.items}
                  uniqueKey={this.props.uniqueKey}
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.props.onSelectedItemsChange}
                  selectedItems={this.props.selectedItems}
                  selectText="Pick Items"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={(text) => console.log(text)}
                  altFontFamily="Courier new"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey={this.props.displayKey}
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#CCC"
                  submitButtonText="Submit"
                  close={this.closeModal}
                />
              </View>
            </Modal>

              <View style={styles.rowStyle}>
                  {/* <View styles={{ flexDirection:'column'}}> */}
                    {/* <Text style={{ fontSize: 15 }}>{this.props.title}</Text> */}
                    <View style={[styles.borderView, { padding: 5,width:'100%' }]}>
                        <View style={styles.dropdownView}>
                          <View style={[styles.subSection,{}]}>
                            <TouchableWithoutFeedback onPress={() => this.setState({ usermodalVisible: true })} >
                              <View style={{flex: 1,flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={[{ flex: 1 }]} numberOfLines={1}>
                                  {this.props.selectedItems.length>0?this.props.selectedItems[0]:this.props.placeholder}
                                </Text>
                                <MaterialCommunityIcons
                                  name={'menu-down'}
                                  style={styles.indicator}
                                />
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      {this.props.single?null:<View>
                        {this.getSelectedItemsExt(this.props.selectedItems)}
                      </View>}
                    </View>
                  </View>

            </View>
        );
    }
}

export const colorPack = {
    primary: '#00A5FF',
    primaryDark: '#215191',
    light: '#FFF',
    textPrimary: '#525966',
    placeholderTextColor: '#A9A9A9',
    danger: '#C62828',
    borderColor: '#e9e9e9',
    backgroundColor: '#b1b1b1',
  };

const styles = StyleSheet.create({

    containerStyle: {
      padding: 10,
      backgroundColor: '#fff',
    },
    borderView: {
      borderBottomWidth: 1, 
      marginTop: 5, 
      borderColor: '#b3b3b3'
    },
    rowStyle: {
      //marginTop: 5,
      flexDirection:'row',
      width: '100%',
     
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingTop: 3,
        paddingRight: 3,
        paddingBottom: 3,
        margin: 3,
        borderRadius: 20,
        borderWidth: 2,
      },
    buttonstyle:{
      backgroundColor: colors.colorBtn,
      borderRadius: 10,
      height: 50,
      width: 200,
     marginBottom: 10
    },
    dropdownView: {
      flexDirection: 'row',
      alignItems: 'center',
    //   height: 30,
    //   marginBottom: 10,
    },
    subSection: {
      backgroundColor: colorPack.light,
    //   borderBottomWidth: 1,
    //   borderColor: colorPack.borderColor,
      paddingLeft: 0,
      paddingRight: 10,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    indicator: {
      fontSize: 30,
      color: colorPack.placeholderTextColor,
    },
  
  });