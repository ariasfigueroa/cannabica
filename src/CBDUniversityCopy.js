import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

import List from './components/List';
import Header from './components/Header';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu'

class CBDUniversity extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    console.log(props);
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
            <View style={styles.formViewContainerStyle}>
              <View style={{flex: 1}}>
                <Text>
                  This is the top
                </Text>
              </View>
              <KeyboardAvoidingView behavior={'padding'} style={{flex: 1, justifyContent: 'flex-end'}}>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  />

                </View>
              </KeyboardAvoidingView>
            </View>
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
  },
  formViewContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
  }
});

export default CBDUniversity
