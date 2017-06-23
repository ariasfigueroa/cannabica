import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimentions,
  TouchableOpacity,
} from 'react-native';

import CachedImage from 'react-native-cached-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckoutHelper from '../lib/CheckoutHelper';

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


class DynamicList extends Component{
constructor(props){
  super(props);
  this.state = {
    data: this.props.data,
    title: this.props.title,
  }

}

  showProductDetails(key){
    this.props.navigator.push({
        routeName: 'lineOfProductsDetails',
        productKey: key,
    });
  }

  addToShoppingCar(item){
    var itemConverted = {
      title : item.name,
      quantity : 1,
      key : item.key,
      price : item.price,
    }
    CheckoutHelper.setItemAsyncStorage(itemConverted, (error) => {
      if (error){
        console.log(error);
      } else {
        this.props.refreshHeaderKey();
        alert(itemConverted.title +' has been added to the car');
      }
    }, search);
  }

_renderItem(item) {
  return(
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={this.showProductDetails.bind(this, item.key)} >
        <CachedImage style={styles.image} source={{uri: item.image}} />
        <Text style={styles.textTitleStyle}>
          {item.name}
        </Text>
        <Text style={[styles.textTitleStyle, styles.textPriceStyle]}>
          ${item.price}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={this.addToShoppingCar.bind(this, item)} >
        <View style={styles.buttonContainer}>
          <Text style={styles.textButton}>
            Add to
          </Text>
          <Icon
            name="shopping-bag"
            color="#07CF7C"
            size={18}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.containerList}>
          <Text style={styles.listTitleText}>{this.state.title}</Text>
          <FlatList
          removeClippedSubviews={false}
          horizontal={true}
          ItemSeparatorComponent={()=> <View style={{width: 10}}/>}
          renderItem={({item}) => this._renderItem(item)}
          data={this.state.data}/>
        </View>

      </View>
    );
  }
}

export default DynamicList

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#ECF0F1'
  },
  image: {
    width: 120,
    height: 174,
  },
  listTitleText:{
    fontSize: 20,
    fontWeight: '300',
    paddingHorizontal: 20,
    paddingBottom:10
  },
  containerList: {
    paddingBottom: 20,
  },
  textButton: {
    fontSize: 18,
    fontWeight: '100',
    paddingTop: 5,
    color: '#07CF7C',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textTitleStyle: {
    width: 120,
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: '#4A4A4A',
    paddingHorizontal: 4,
  },
  productContainer: {
    backgroundColor: '#FFFFFF'
  },
  textPriceStyle: {
    fontWeight: '700',
  }
});
