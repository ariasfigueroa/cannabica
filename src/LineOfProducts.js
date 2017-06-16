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

const productsPath = '/products';

class LineOfProducts extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      wellnessData: null,
      kidsData: null,
      skincareData: null,
      petsData: null,
      showActivityIndicator: false,
    }
    console.log(props);
  }

  componentWillMount(){
    try {
      this.setState({showActivityIndicator: true})
      var ref = firebaseApp.database().ref(productsPath)
      ref.once('value', (snapshot) => {
        if (snapshot.val()){
          this.getThumnails(snapshot)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getThumnails (snapshot){
    var thumbnailsArray = [];
    await snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      if (childData){
        thumbnailsArray.push({key: childKey, name: childData.title, image: childData.thumbnailUrlSmall, targetScreen: 'lineOfProductsDetails', category: childData.category})
      }
    });

    const kids = thumbnailsArray.filter(asset => {
        return asset.category.indexOf('kids') > -1;
      })

    const wellness = thumbnailsArray.filter(asset => {
        return asset.category.indexOf('wellness') > -1;
      })

    const skincare = thumbnailsArray.filter(asset => {
        return asset.category.indexOf('skincare') > -1;
      })

    const pets = thumbnailsArray.filter(asset => {
        return asset.category.indexOf('pets') > -1;
      })
    this.setState({petsData: pets, kidsData: kids, wellnessData: wellness, skincareData: skincare, showActivityIndicator: false});


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
    if (this.state.showActivityIndicator === false){
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
            <ScrollView style={styles.scrollContainer}>
              {this.state.wellnessData ? <DynamicList data={this.state.wellnessData} title={'Wellness'} navigator={this.props.navigator}/> : null}
              {this.state.kidsData ? <DynamicList data={this.state.kidsData} title={'Kids'} navigator={this.props.navigator}/> : null}
              {this.state.skincareData ? <DynamicList data={this.state.skincareData} title={'Skin Care'} navigator={this.props.navigator}/> : null}
              {this.state.petsData ? <DynamicList data={this.state.petsData} title={'Pets'} navigator={this.props.navigator}/> : null}
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
