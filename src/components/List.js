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

class List extends Component{

_setTargetScreen(item){
  this.props.navigator.push({
      routeName: item.targetScreen,
      productKey: item.key,
  });
}
_renderItem(item) {
  return(
    <TouchableOpacity onPress={this._setTargetScreen.bind(this, item)}>
      <CachedImage style={this.props.isImageLage ? styles.imageLarge : styles.image} source={{uri: item.image}} />
    </TouchableOpacity>
  );
}

_renderItemVertical(item) {
  return(
    <TouchableOpacity onPress={this._setTargetScreen.bind(this, item)}>
      <View style={styles.verticalContainer}>
        <View style={styles.textVerticaTitleContainer}>
          <Text style={styles.textVerticaTitle}>{item.name}</Text>
        </View>
        <View style={styles.imageVerticalContainer}>
          <CachedImage style={styles.imageVerticalContainer} source={{uri: item.image}} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

  constructor(props) {
    super(props)
    if (this.props.menuSelected === 'home'){
        this.state = {
        topProducts: this.props.topProducts,
        topAllAboutCBD: this.props.topAllAboutCBD,
        topInspiringStories: this.props.topInspiringStories,
        menuSelected: this.props.menuSelected,
      }
    } else if (this.props.menuSelected === 'cbdUniversity'){
        this.state = {
        allAboutCBDVideoList: this.props.allAboutCBDVideoList,
        cbdAndLawList: this.props.cbdAndLawList,
        menuSelected: this.props.menuSelected,
      }
    }
    console.log(this.props.cbdAndLawList);
  }

  render(){
    if (this.state.menuSelected === 'home'){
      return (
        <View style={styles.container}>
          {this.state.topProducts ? <View style={styles.containerList}>
              <Text style={styles.listTitleText}>Top Products</Text>
              <FlatList
              removeClippedSubviews={false}
              horizontal={true}
              ItemSeparatorComponent={()=> <View style={{width: 10}}/>}
              renderItem={({item}) => this._renderItem(item)}
              data={this.state.topProducts}/>
            </View> : null}
          {this.state.topAllAboutCBD ?   <View style={styles.containerList}>
              <Text style={styles.listTitleText}>CBD University</Text>
              <FlatList
              removeClippedSubviews={false}
              horizontal={true}
              ItemSeparatorComponent={()=> <View style={{width: 10}}/>}
              renderItem={({item}) => this._renderItem(item)}
              data={this.state.topAllAboutCBD}/>
            </View> : null}
          {this.state.topInspiringStories ? <View style={styles.containerList}>
              <Text style={styles.listTitleText}>Inspiring Stories</Text>
              <FlatList
              removeClippedSubviews={false}
              horizontal={true}
              ItemSeparatorComponent={()=> <View style={{width: 10}}/>}
              renderItem={({item}) => this._renderItem(item)}
              data={this.state.topInspiringStories}/>
            </View> : null}
        </View>
      );
    } else if (this.state.menuSelected === 'cbdUniversity'){
      return (
        <View style={styles.container}>
        {this.state.allAboutCBDVideoList && this.state.allAboutCBDVideoList.length > 0 ? <View style={styles.containerList}>
          <Text style={styles.listTitleText}>All about CBD</Text>
          <FlatList
          removeClippedSubviews={false}
          horizontal={true}
          ItemSeparatorComponent={()=> <View style={{width: 10}}/>}
          renderItem={({item}) => this._renderItem(item)}
          data={this.state.allAboutCBDVideoList}/>
          </View> : null}
        {this.state.cbdAndLawList && this.state.cbdAndLawList.length > 0 ? <View style={styles.containerList}>
            <Text style={styles.listTitleText}>CBD and Law</Text>
            <FlatList
            removeClippedSubviews={false}
            horizontal={true}
            ItemSeparatorComponent={()=> <View style={{width: 10}}/>}
            renderItem={({item}) => this._renderItem(item)}
            data={this.state.cbdAndLawList}/>
            </View> : null}
        </View>
      );
    }

  }
}

export default List

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#ECF0F1'
  },
  verticalContainer: {
    flex: 1,
    flexDirection: 'row',
    width: 414,
    height: 120,
  },
  image: {
    width: 100,
    height: 144,
  },
  imageLarge: {
    width: 140,
    height: 202,
  },
  imageVerticalContainer: {
    width: 274,
    height: 120,
  },
  textVerticaTitleContainer: {
    width: 140,
    height: 120,
  },
  textVerticaTitle: {
    marginVertical: 10,
    marginVertical: 10,
  	color: '#4A4A4A',
  	fontSize: 20,
  	fontWeight: '300',
  },
  listTitleText:{
    fontSize: 20,
    fontWeight: '300',
    paddingHorizontal: 20,
    paddingBottom:10
  },
  containerList: {
    paddingTop: 20,
  },
  containerListVertical: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  }
});
