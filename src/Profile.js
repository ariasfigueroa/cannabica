import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import List from './components/List';
import Header from './components/Header';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu'

class Profile extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    console.log(props)
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
    return (
      <View style={styles.container}>
        <SideMenu
          menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
          isOpen={this.state.isOpen}
          onChange={(isOpen) => this.updateMenu(isOpen)}
        >
          <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
          <ScrollView style={styles.scrollContainer}>
            <Text>
              Here goes the Profile
            </Text>
          </ScrollView>
        </SideMenu>
      </View>
    );
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

export default Profile
