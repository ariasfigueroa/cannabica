import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import List from './components/List';
import Header from './components/Header';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import CheckoutHelper from './lib/CheckoutHelper';

const Product = (props) => {
  return(
    <View style={[styles.headerColumnStyle, styles.productTopMargingStyle]}>
      <Text style={[styles.productTextStyle, {width: 180}]}>{props.title}</Text>
      <View style={[styles.verticalComponentsStyle, {width: 60}]}>
        <TouchableOpacity onPress={props.reduceQuantity}>
          <IconFontAwesome
            name="minus-circle"
            color="#4A4A4A"
            size={14}
          />
        </TouchableOpacity>
        <Text style={[styles.productTextStyle, {marginHorizontal: 5}]}>{props.quantity}</Text>
        <TouchableOpacity onPress={props.addQuantity}>
          <IconFontAwesome
            name="plus-circle"
            color="#4A4A4A"
            size={14}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.productTextStyle, {width: 70}]}>${(props.price * props.quantity)}</Text>
      <TouchableOpacity onPress={props.deleteProduct}>
        <Icon
          name="delete"
          color="#4A4A4A"
          size={20}
        />
      </TouchableOpacity>
    </View>
  )
}

class Checkout extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      products: null,
      showActivityIndicator: false,
      headerKey: 0,
    }
    console.log(props)
  }

  componentWillMount(){
    this.setState({showActivityIndicator: true})
  }

  componentDidMount(){
    try {
      CheckoutHelper.getGlobalCheckout((result)=> {
        let value = JSON.parse(result);
        if (value !== null){
          this.setState({products: value, showActivityIndicator: false})
        } else {
          this.setState({showActivityIndicator: false})
        }
      });
    } catch(error) {
      console.log(error)
    }
  }

toggle(){
  this.setState({
    isOpen: !this.state.isOpen
  });
}

updateMenu(isOpen){
  this.setState({isOpen});
}

_reduceQuantity(key){
  var currentProducts = null;
  this.state.products.forEach((item, index, array) => {
    if (key === item.key && item.quantity > 1){
      item.quantity -= 1;
      currentProducts = array
    }
  });
  if (currentProducts !== null){
    // update the AsyncStorage
    CheckoutHelper.setGlobalCheckout(currentProducts, false, (error) => {
      if (error !== null){
        console.log(error);
      }
    });
    this.setState({products: currentProducts, headerKey: Math.random()});
  }
}

_addQuantity(key){
  var currentProducts = null;
  this.state.products.forEach((item, index, array) => {
    if (key === item.key && item.quantity > 0){
      item.quantity += 1;
      currentProducts = array
    }
  });
  if (currentProducts){
    // update the AsyncStorage
    CheckoutHelper.setGlobalCheckout(currentProducts, false, (error) => {
      if (error !== null){
        console.log(error);
      }
    });
    this.setState({products: currentProducts, headerKey: Math.random()});
  }
}

async _deleteProduct(index){
  var currentProducts = this.state.products;
  let itemRemoved = currentProducts.splice(index, 1)
  // delete product from AsyncStorage
  await CheckoutHelper.setGlobalCheckout(currentProducts, false, (error) => {
    if (error !== null){
      console.log(error);
    }
  });
  this.setState({products: currentProducts, headerKey: Math.random()})
}

  render(){
    if (this.state.showActivityIndicator === false) {
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            <Header key={this.state.headerKey} toggle={this.toggle.bind(this)} navigator={this.props.navigator} products={this.state.products}/>
            <ScrollView style={styles.scrollContainer}>
              {this.state.products.length > 0 ? <View>
                <Text style={styles.orderDetailsStyle}>
                  Order Details
                </Text>
                <View style={styles.productListStyle}>
                  <View style={styles.headerColumnStyle}>
                    <Text style={[styles.headerTextStyle, {width: 190}]}>Product</Text>
                    <Text style={[styles.headerTextStyle, {width: 50}]}>Qty</Text>
                    <Text style={[styles.headerTextStyle]}>Cost</Text>
                  </View>
                  {this.state.products.map((item, i) => <Product
                    title={item.title}
                    key={i}
                    productKey={item.key}
                    quantity={item.quantity}
                    price={item.price}
                    reduceQuantity={this._reduceQuantity.bind(this, item.key)}
                    addQuantity={this._addQuantity.bind(this, item.key)}
                    deleteProduct={this._deleteProduct.bind(this, i)}
                    />
                  )}
                  </View>
              </View>
            : <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Text> There are not products added to this cart </Text>
                <Icon
                name="remove-shopping-cart"
                color="#4A4A4A"
                size={50}
                />
            </View>}
            </ScrollView>
          </SideMenu>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
            <View style={styles.activityIndicatorStyle}>
              <ActivityIndicator
                animating={this.state.showActivityIndicator}
                style={{height: 80}}
                size="large"
              />
            </View>
          </SideMenu>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  orderDetailsStyle: {
	color: '#000000',
	fontSize: 20,
	fontWeight: '300',
},
productListStyle: {
  flex: 1,
  paddingTop: 10,
  paddingBottom: 20,
  borderBottomWidth: 0.5,
  borderBottomColor: '#9B9B9B',
},
headerColumnStyle: {
  flexDirection: 'row',

},
headerTextStyle: {
	color: '#4A4A4A',
	fontSize: 16,
},
productTextStyle: {
	color: '#4A4A4A',
  fontSize: 14,
	fontWeight: '300',
},
costTextStyle: {
  marginRight: 50,
},
productTopMargingStyle: {
  marginTop: 10,
},
verticalComponentsStyle: {
  flexDirection: 'row'
},
activityIndicatorStyle: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,1)',
}
});

export default Checkout
