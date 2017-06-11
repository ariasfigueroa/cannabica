import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Header from './components/HeaderWithBack';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu'
import { firebaseApp } from './lib/firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

class ResetPassword extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      userName: '',
      errorMessage: null,
      showActivityIndicator: false,
    }
    this._resetErrors = this._resetErrors.bind(this)
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

_resetPassword(){
  try {
    if (this.state.userName){
        this.setState({showActivityIndicator: true})
        firebaseApp.auth().sendPasswordResetEmail(this.state.userName).then(
          (onResolve) => {
            alert('We have sent you an email to reset your password')
            this.setState({showActivityIndicator: false})
            this._navigate('logIn')
          }, (onReject) => {
            this.setState({showActivityIndicator: false})
            this.setState({errorMessage: onReject.message})
          }
        )
    }else {
      this.setState({errorMessage: 'Email is required.'})
    }
  }catch (error) {
    console.log(error)
  }
}

_resetErrors(){
  if (this.state.errorMessage)
    this.setState({errorMessage: null})
}

_navigate(routeName){
  this.props.navigator.push({
    routeName
  })
}

_getTextInputRefs(){
  return [this.passwordInput]
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
              <KeyboardAwareScrollView
                style={styles.loginView}
                getTextInputRefs={this._getTextInputRefs}
                >
                {this.state.errorMessage ? <Text style={styles.errorMessageStyle}> {this.state.errorMessage} </Text> : null}
                <View style={styles.instructionsContainerStyle}>
                  <Text style={styles.instructionsTextStyleNormal}>
                    Ente your
                  </Text>
                  <Text style={styles.instructionsTextStyle}>
                    Email
                  </Text>
                  <Text style={styles.instructionsTextStyleNormal}>
                    in order to send you the password
                  </Text>
                </View>
                <View style={styles.textInputViewStyle}>
                  <TextInput style={styles.textInputStyle}
                     autoCapitalize= {'none'}
                     autoCorrect={false}
                     placeholder= {'youremail@email.com'}
                     onChangeText={(userName) => this.setState({userName})}
                     returnKeyType={'next'}
                     keyboardType={'email-address'}
                     ref={(passwordInput) => this.passwordInput = passwordInput}
                     value={this.state.userName}
                     onFocus={this._resetErrors}
                  />
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity style={styles.loginButtonStyle}
                  onPress={this._resetPassword.bind(this)}
                  >
                   <Text style={styles.textInsideButtons}>
                     SEND PASSWORD
                   </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
          </SideMenu>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>
            <View style={styles.activityIndicatorStyle}>
              <ActivityIndicator
                animating={this.state.showActivityIndicator}
                style={{height: 80}}
                size="large"
              />
            </View>
          </SideMenu>
        </View>
      )
    }
  }
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#FFFFFF',
  },
  instructionsContainerStyle: {
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  instructionsTextStyleNormal: {
    color: '#4A4A4A',
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'center',
  },
  instructionsTextStyle: {
    color: '#07CF7C',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 3
  },
  textInputViewStyle: {
    marginBottom: 10,
    borderBottomColor: '#9B9B9B',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  textInputStyle: {
    height: 20,
  },
  loginButtonStyle: {
    marginTop: 20,
    marginBottom: 20,
  	height: 25,
  	width: 200,
  	borderWidth: 1,
    borderColor: '#979797',
  	borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInsideButtons: {
  	color: '#07CF7C',
  	fontSize: 14,
  	fontWeight: '300',
  },
  activityIndicatorStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  errorMessageStyle: {
    marginTop: 20,
    color: 'red',
    fontSize: 14,
  	fontWeight: '300',
    textAlign: 'center',
  },
  loginView: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    paddingVertical: 50,
  },
});

export default ResetPassword
