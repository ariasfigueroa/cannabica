import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import List from './components/List';
import Header from './components/Header';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu';
import { firebaseApp } from './lib/firebase';

const cbdUniversitySections = ['/screens/cbdUniversity/allAboutCBD']

class CBDUniversity extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      allAboutCBD: null,
    }
    console.log(props);
  }

  componentWillMount(){
    // get components and set allAboutCBDVideoList
    try {
      for (var index = 0; index < cbdUniversitySections.length; index++){
        var ref = firebaseApp.database().ref(cbdUniversitySections[index])
        ref.once('value', (snapshot) => {
          if (snapshot.val()){
            this.getThumnails(snapshot, snapshot.key)
          }
        });
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
        case 'allAboutCBD' : {
          this.setState({allAboutCBD: thumbnailsArray})
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
    if (this.state.allAboutCBD && this.state.allAboutCBD.length > 0){
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}>
            <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
            <ScrollView style={styles.scrollContainer}>
              <List navigator={this.props.navigator} allAboutCBDVideoList={this.state.allAboutCBD} menuSelected={this.props.menuSelected}/>
            </ScrollView>
          </SideMenu>
        </View>
      );
    }else {
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
                animating={(this.state.allAboutCBDVideoList && this.state.allAboutCBDVideoList.length > 0 ) ? false : true}
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
  },
  formViewContainerStyle: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  }
});

export default CBDUniversity
