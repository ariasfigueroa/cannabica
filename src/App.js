import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import List from './components/List';
import Slide from './components/Slider';
import Header from './components/Header';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu'
import { firebaseApp } from './lib/firebase';

const homeSections = ['/screens/home/news','/screens/home/topProducts','/screens/home/allAboutCBD','/screens/home/topInspiringStories']


class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      imagesSlider: null,
      topProducts: null,
      topAllAboutCBD: null,
      topInspiringStories: null,
      showActivityIndicator: false,
      headerKey: 0,
    }
    console.log(this.props)
  }

  componentWillMount(){
    try {
      for (var index = 0; index < homeSections.length; index++){
        var ref = firebaseApp.database().ref(homeSections[index])
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
      let childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      if (childData){
        thumbnailsArray.push({key: childKey, name: childData.title, image: childData.thumbnailUrl, targetScreen: childData.targetScreen})
      }
    });
    switch(listType){
        case 'news' : {
          this.setState({imagesSlider: thumbnailsArray})
          break
        }
        case 'topProducts' : {
          this.setState({topProducts: thumbnailsArray})
          break
        }
        case 'allAboutCBD' : {
          this.setState({topAllAboutCBD: thumbnailsArray})
          break
        }
        case 'topInspiringStories' : {
          this.setState({topInspiringStories: thumbnailsArray})
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

_reRenderHeader(){
  this.setState({headerKey: Math.random()})
  console.log('_reRenderHeader')
}

  render(){
    if ((this.state.imagesSlider && this.state.topProducts && this.state.topAllAboutCBD && this.state.topInspiringStories) || this.state.showActivityIndicator){
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            <Header key={this.state.headerKey} toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
            <ScrollView style={styles.scrollContainer}>
              <Slide navigator={this.props.navigator} imagesSlider={this.state.imagesSlider} _reRenderHeader={this._reRenderHeader.bind(this)}/>
              <List navigator={this.props.navigator} topProducts={this.state.topProducts} topAllAboutCBD={this.state.topAllAboutCBD} topInspiringStories={this.state.topInspiringStories} menuSelected={this.props.menuSelected}/>
            </ScrollView>
          </SideMenu>
        </View>
      )
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

export default App
