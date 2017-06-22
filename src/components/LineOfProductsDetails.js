import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

import Header from './HeaderWithBack';
import CachedImage from 'react-native-cached-image';
import HTMLView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckoutHelper from '../lib/CheckoutHelper';

import { firebaseApp } from '../lib/firebase'

const search = (item, array) => {
  //get min, mid and max index
  let min = 0;
  let max = array.length - 1;
  let mid = Math.round(max / 2);

  //check bounds
  if (item.key < array[min].key || item.key > array[max].key){
    console.log("Item : " + item + " was not found...")
    return -1;
  }

  //get the value in the middle of the array to calculate the side
  let middleItem = array[mid];

  //check the item
  if (item.key < middleItem.key){
    // slice the array
    var slice = array.slice(min, mid);
    search(item, slice);
  } else if (item.key > middleItem.key){
    // slice the array
    var slice = array.slice(mid);
    search(item, slice);
  } else {
    console.log("The item has been found: " + item + " ...");
    return mid;
  }
  return mid;
}

class LineOfProductsDetails extends Component{
  constructor(props){
    super(props);
    this.state = {
      key: this.props.productKey,
      thumbnailUrl: null,
      title: null,
      bodyHtml: null,
      price: null,
      quantity: 1,
      showActivityIndicator: false,
      products: null,
      headerKey: 0,
    }
      console.log(props)
  }

  componentWillMount (){
    this.setState({
      showActivityIndicator : true
    })
  }

  componentDidMount (){
    try {
      // firebase
      let path = 'products/'
      let ref = firebaseApp.database().ref(path+this.state.key)
      ref.once('value').then((onResolve) => {
        if(onResolve.val()){
          setTimeout (()=> {
            this.setState({
              thumbnailUrl: onResolve.val().thumbnailUrl,
              title: onResolve.val().title,
              bodyHtml: onResolve.val().bodyHtml,
              price: onResolve.val().price,
              showActivityIndicator: false
            })
          }, 1000)
        } else {
          console.log(onResolve)
          this.setState({showActivityIndicator: false})
          Alert.alert('Ooops...', 'Something went wrong with this product.', [{text: 'OK', onPress: () => this.props.navigator.pop()}])
        }
      }, (onReject) => {
          console.log(onReject)
          this.setState({showActivityIndicator: false})
          Alert.alert('Ooops...', 'Something went wrong with this product.', [{text: 'OK', onPress: () => this.props.navigator.pop()}])
      })
    } catch (error) {
      console.log(error)
      this.setState({showActivityIndicator: false})
      Alert.alert('Ooops...', 'Something went wrong with this product.', [{text: 'OK', onPress: () => this.props.navigator.pop()}])
    }
  }

  _changeQuantity(value){
    if (this.state.quantity > 0){
      var newQuantity = this.state.quantity
      if (value === 0 && this.state.quantity > 1){
        newQuantity = (newQuantity - 1)
        this.setState({quantity: newQuantity})
      } else if (value !== 0){
        newQuantity = (newQuantity + 1)
        this.setState({quantity: newQuantity})
      }
    }
  }

  _addProductToCheckout(){
    console.log("top of _addProductToCheckout");
    var products = [];
    let item = {
      key: this.state.key,
      title: this.state.title,
      price: this.state.price,
      quantity: this.state.quantity,
    };
    products.push(item);
      CheckoutHelper.setItemAsyncStorage(item, (error) => {
        if (error){
          console.log(error);
        } else {
          this.setState({products: products, headerKey:  Math.random()});
          alert(this.state.title +' has been added to the car');
        }
      }, search);
  }



  render(){
    if (this.state.showActivityIndicator === false){
      return(
        <View style={styles.container}>
        <Header key={this.state.headerKey} navigator={this.props.navigator} products={this.state.products} _reRenderHeader={this.props._reRenderHeader}/>
        <ScrollView style={styles.scrollViewStyle}>
          <CachedImage
            style={styles.thumbnailStyle}
            source={{uri: this.state.thumbnailUrl}}
          />
          <View style={styles.articleTextContainer}>
            <Text style={styles.titleStyle}>{this.state.title}</Text>
            <Text style={styles.priseStyle}>${this.state.price}</Text>
            <View style={styles.verticalStyle}>
              <TouchableOpacity onPress={this._changeQuantity.bind(this,0)}>
                <Icon
                  name="minus-circle"
                  color="#07CF7C"
                  size={25}
                />
              </TouchableOpacity>
              <Text style={styles.quantityStyle}> {this.state.quantity} </Text>
              <TouchableOpacity onPress={this._changeQuantity.bind(this,1)}>
                <Icon
                  name="plus-circle"
                  color="#07CF7C"
                  size={25}
                />
              </TouchableOpacity>
            </View>
              <TouchableOpacity style={styles.verticalStyle} onPress={this._addProductToCheckout.bind(this)}>
              <Text style={styles.addStyle}> Add </Text>
                <Icon
                  name="shopping-bag"
                  color="#07CF7C"
                  size={20}
                />
              </TouchableOpacity>
            <HTMLView style={styles.bodyStyle} value={this.state.bodyHtml}/>
          </View>
        </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
           <Header navigator={this.props.navigator}/>
            <View style={styles.activityIndicatorStyle}>
              <ActivityIndicator
                animating={this.state.showActivityIndicator}
                style={{height: 80}}
                size="large"
              />
            </View>
        </View>
      )
    }
  }
}

export default LineOfProductsDetails

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  thumbnailStyle: {
    height: 160,
  },
  articleTextContainer: {
    marginHorizontal: 20,
  },
  titleStyle: {
    color: '#4A4A4A',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 20,
    marginBottom : 10,
  },
  bodyStyle: {
    marginTop: 10,
},
activityIndicatorStyle: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,1)',
},
scrollViewStyle: {
  flex: 1,
  marginBottom: 20,
},
priseStyle: {
	color: '#07CF7C',
	fontSize: 24,
	fontWeight: '500',
	textAlign: 'left',
  marginBottom : 10,
},
verticalStyle: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginBottom: 10,
},
quantityStyle: {
	color: '#4A4A4A',
  fontSize: 24,
  fontWeight: '500',
  marginHorizontal: 5,
},
addStyle: {
	color: '#07CF7C',
  fontSize: 20,
  fontWeight: '300',
  marginRight: 5,
}
});
