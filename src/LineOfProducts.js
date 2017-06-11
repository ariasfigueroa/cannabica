import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import List from './components/List';
import Header from './components/Header';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu'
import DynamicList from './components/DynamicList';
import { firebaseApp } from './lib/firebase';

const shopSections = ['/screens/shop/wellness','/screens/shop/kids','/screens/shop/skincare','/screens/shop/pets']

class LineOfProducts extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      wellnessData: null,
      kidsData: null,
      skincareData: null,
      petsData: null,
    }
    console.log(props);
  }

  componentWillMount(){
    try {
      for (var index = 0; index < shopSections.length; index++){
        var ref = firebaseApp.database().ref(shopSections[index])
        ref.once('value', (snapshot) => {
          if (snapshot.val()){
            this.getThumnails(snapshot, snapshot.key)
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getThumnails (snapshot, listType){
    var thumbnailsArray = [];
    await snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      if (childData){
        thumbnailsArray.push({key: childData.key, name: childData.name, image: childData.thumbnailUrl, targetScreen: 'lineOfProductsDetails'})
      }
    });
    switch(listType){
        case 'wellness' : {
          this.setState({wellnessData: thumbnailsArray})
          break
        }
        case 'kids' : {
          this.setState({kidsData: thumbnailsArray})
          break
        }
        case 'skincare' : {
          this.setState({skincareData: thumbnailsArray})
          break
        }
        case 'pets' : {
          this.setState({petsData: thumbnailsArray})
          break
        }
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

  render(){
    if (this.state.wellnessData && this.state.kidsData && this.state.skincareData && this.state.petsData){
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
            <ScrollView style={styles.scrollContainer}>
              <DynamicList data={this.state.wellnessData} title={'Wellness'} navigator={this.props.navigator}/>
              <DynamicList data={this.state.kidsData} title={'Kids'} navigator={this.props.navigator}/>
              <DynamicList data={this.state.skincareData} title={'Skin Care'} navigator={this.props.navigator}/>
              <DynamicList data={this.state.petsData} title={'Pets'} navigator={this.props.navigator}/>
            </ScrollView>
          </SideMenu>
        </View>
      );
    } else {
      return(
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
            <View style={[styles.scrollContainer, {flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
              <ActivityIndicator
                animating={(this.state.imagesSlider && this.state.topProducts && this.state.topAllAboutCBD && this.state.topInspiringStories) ? false : true}
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
    backgroundColor: '#ECF0F1',
  }
});

export default LineOfProducts
