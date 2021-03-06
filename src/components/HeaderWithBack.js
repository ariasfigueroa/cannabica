import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import IonicIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckoutHelper from '../lib/CheckoutHelper';

class Header extends Component{
  constructor(props){
    super(props)
    this.state = {
      products: null
    }
    console.log(props)
  }

  componentWillMount(){
    if (this.props.products){
      if (this.props.products.length > 0){
        this.setState({products: this.props.products})
      }
    } else {
      CheckoutHelper.getGlobalCheckout((result)=> {
        let value = JSON.parse(result);
        if (value !== null && value.length > 0){
          this.setState({products: value})
        }
      });
    }
  }

  render(){
    return(
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={()=> {
        if (this.props._reRenderHeader){
          this.props._reRenderHeader()
        }
        this.props.navigator.pop()
      }} >
        <View>
          <IonicIcon
            name="ios-arrow-back"
            color="#07CF7C"
            size={30}
          />
        </View>
      </TouchableWithoutFeedback>
      <Image style={styles.logo} source={require('../../resources/images/logo.png')} />
      <TouchableWithoutFeedback onPress={()=> this.props.navigator.push({
          routeName: 'checkout',
      })}>
      <View>
        <Icon
          name="shopping-bag"
          color="#07CF7C"
          size={25}
        />
        {this.state.products? <View style={styles.checkOutIconStyle} /> : null}
       </View>
      </TouchableWithoutFeedback>
    </View>
  )
  }
}

export default Header

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECF0F1',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  checkOutIconStyle: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 0.5,
    position: 'absolute',
    left : 16,
    top: 0,
  }
});
