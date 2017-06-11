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

addToShoppingCar(key){
  console.log(key)
}

_renderItem(item) {
  return(
    <View>
      <TouchableOpacity onPress={this.showProductDetails.bind(this, item.key)} >
        <CachedImage style={styles.image} source={{uri: item.image}} />
      </TouchableOpacity>
      <TouchableOpacity onPress={this.addToShoppingCar.bind(this, item.key)} >
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
  }
});
