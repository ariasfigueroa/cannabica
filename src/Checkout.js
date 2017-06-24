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
      <Text style={[styles.productTextStyle, {width: 70}]}>${(props.price * props.quantity).toFixed(2)}</Text>
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

class Checkout extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      products: null,
      showActivityIndicator: false,
      headerKey: 0,
      subtotal: 0.00,
      total: 0.00,
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
          this.setState({products: value, showActivityIndicator: false});
          this._updateTotals();
        } else {
          this.setState({showActivityIndicator: false});
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

_reduceQuantity(item){
  var currentProducts = null;
  this.state.products.forEach((itemLocal, indexLocal, array) => {
    if (item.key === itemLocal.key && item.quantity > 1){
      itemLocal.quantity -= 1;
      item.quantity = itemLocal.quantity;
      currentProducts = array
    }
  });
  if (currentProducts){
    // update the AsyncStorage
    CheckoutHelper.updateItemAsyncStorage(item, (error) => {
      if (error){
        console.log(error);
      } else {
        this.setState({products: currentProducts, headerKey: Math.random()});
        this._updateTotals();
      }
    }, search);
  }
}

_addQuantity(item){
  var currentProducts = null;
  this.state.products.forEach((itemLocal, indexLocal, array) => {
    if (item.key === itemLocal.key && itemLocal.quantity > 0){
      itemLocal.quantity += 1;
      item.quantity = itemLocal.quantity;
      currentProducts = array
    }
  });
  if (currentProducts){
    // update the AsyncStorage
    CheckoutHelper.updateItemAsyncStorage(item, (error) => {
      if (error){
        console.log(error);
      } else {
        this.setState({products: currentProducts, headerKey: Math.random()});
        this._updateTotals();
      }
    }, search);
  }
}

async _deleteProduct(index){
  var currentProduct = this.state.products[index];
  var currentProducts = this.state.products;
  currentProducts.splice(index, 1);
  // delete product from AsyncStorage
  await CheckoutHelper.deleteGlobalCheckout([currentProduct], (error) => {
    if (error !== null){
      console.log(error);
    }
  });
  this.setState({products: currentProducts, headerKey: Math.random()});
  this._updateTotals();
}

_updateTotals(){
  if (this.state.products){
    var sutotal = 0;
    this.state.products.forEach((itemLocal, indexLocal, array) => {
      if (itemLocal.quantity > 0){
        sutotal += (itemLocal.price * itemLocal.quantity);
      }
    });
    this.setState({subtotal: sutotal.toFixed(2), total: sutotal.toFixed(2)});
  }
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
              {this.state.products.length > 0 ?
                <View>
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
                      reduceQuantity={this._reduceQuantity.bind(this, item)}
                      addQuantity={this._addQuantity.bind(this, item)}
                      deleteProduct={this._deleteProduct.bind(this, i)}
                      />
                    )}
                  </View>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={styles.productTotalsStyle}>
                      <View style={styles.marginBetweenTotals}>
                        <Text style={styles.subtotalTextStyle}>Subtotal</Text>
                        <Text style={styles.subtotalTextStyle}>Shipping</Text>
                        <Text style={styles.subtotalTextStyleBold}>Total</Text>
                        <View style={styles.taxMessageStyle}>
                          <Text style={styles.taxMessageTextStyle}>*Tax calculated in checkout</Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.subtotalTextStyle}>$ {this.state.subtotal}</Text>
                        <Text style={styles.subtotalTextStyle}>Free</Text>
                        <Text style={styles.subtotalTextStyleBold}>$ {this.state.total}</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity style={styles.checkoutViewButtonStyle}>
                        <Text style={styles.checkoutTextButtonStyle}>PROCESS TO CHECK OUT</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
            : <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text> There are not products added to this cart </Text>
                <Icon
                name="remove-shopping-cart"
                color="#4A4A4A"
                size={50}
                />
              </View>
            }
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
},
productTotalsStyle: {
  marginRight: 20,
  marginTop: 20,
  flexDirection: 'row',
  justifyContent: 'flex-end',
},
subtotalTextStyle: {
  color: '#4A4A4A',
  fontSize: 16,
  marginBottom: 10,
},
subtotalTextStyleBold: {
  color: '#4A4A4A',
  fontSize: 16,
  marginBottom: 10,
  fontWeight: 'bold',
},
marginBetweenTotals: {
  marginRight: 50,
},
taxMessageViewStyle: {
  alignItems: 'center',
  justifyContent: 'flex-end',
  flex: 1,
},
taxMessageTextStyle: {
  color: '#4A4A4A',
  fontSize: 10,
},
checkoutTextButtonStyle: {
  color: '#07CF7C',
  fontSize: 14,
  fontWeight: '300',
},
checkoutViewButtonStyle: {
  marginTop: 20,
  marginBottom: 20,
  height: 25,
  width: 200,
  borderWidth: 1,
  borderColor: '#979797',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
}
});

export default Checkout
