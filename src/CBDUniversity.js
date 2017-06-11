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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

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
          onChange={(isOpen) => this.updateMenu(isOpen)}>
          <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
              <KeyboardAwareScrollView
                style={styles.formViewContainerStyle}
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="always"
                getTextInputRefs={() => {return [this.input1,this.input2,this.input3,this.input4,this.input5,this.input6,this.input7,this.input8,this.input9,this.input10,this.input11,this.input12]}}>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input1) => this.input1 = input1}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input2) => this.input2 = input2}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input3) => this.input3 = input3}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input4) => this.input4 = input4}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input5) => this.input5 = input5}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input6) => this.input6 = input6}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input7) => this.input7 = input7}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input8) => this.input8 = input8}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input9) => this.input9 = input9}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input10) => this.input10 = input10}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input11) => this.input11 = input11}
                  />
                </View>
                <View>
                  <TextInput
                  style={{width: 100, height: 40}}
                  placeholder={'Text'}
                  autoCorrect={false}
                  ref={(input12) => this.input12 = input12}
                  />
                </View>
              </KeyboardAwareScrollView>
        </SideMenu>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  formViewContainerStyle: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  }
});

export default CBDUniversity
