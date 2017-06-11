import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'

import List from './components/List'
import Header from './components/Header'
import SideMenu from 'react-native-side-menu'
import Menu from './components/Menu'
import { firebaseApp } from './lib/firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
class LogIn extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      userName: '',
      password: '',
      errorMessage: null,
      showActivityIndicator: false,
    }
    this._resetErrors = this._resetErrors.bind(this)
    this._getTextInputRefs = this._getTextInputRefs.bind(this)
  }

  _resetErrors(){
    if (this.state.errorMessage)
      this.setState({errorMessage: null})
  }

toggle(){
  this.setState({
    isOpen: !this.state.isOpen
  });
}

updateMenu(isOpen){
  this.setState({isOpen});
}

login(){
  try {
    if (this.state.userName && this.state.password){
      this.setState({showActivityIndicator: true})
      firebaseApp.auth().signOut().then((onResolve)=> {
        firebaseApp.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).then((onResolveUser) => {
          setTimeout(()=>{
            this.setState({showActivityIndicator: false})
            this._navigate('home')
          }, 1000);
        }, (onRejectUser)=>{
          this.setState({showActivityIndicator: false})
          console.log(onRejectUser)
        })
      }, (onReject) => {
        this.setState({showActivityIndicator: false})
        console.log(onReject)
      })
    } else {
      this.setState({errorMessage: 'Email and Password are required.'})
    }
  } catch (error) {
    console.log(error);
    this.setState({errorMessage: error.message})
  }
}

  _navigate(routeName){
    this.props.navigator.push({
      routeName,
      headerWithBack: true,
    })
  }

  _getTextInputRefs(){
    return [this.userNameInput, this.passwordInput]
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
             getTextInputRefs={this._getTextInputRefs}
             style={styles.loginView}
             >
               <View style={styles.textInputViewStyle}>
                 <TextInput style={styles.textInputStyle}
                    autoCapitalize= {'none'}
                    autoCorrect={false}
                    placeholder= {'youremail@email.com'}
                    onChangeText={(userName) => this.setState({userName})}
                    returnKeyType={'next'}
                    keyboardType={'email-address'}
                    ref={(userNameInput) => this.userNameInput = userNameInput}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    value={this.state.userName}
                    onFocus={this._resetErrors}
                 />
               </View>

               <View style={styles.textInputViewStyle}>
                 <TextInput style={styles.textInputStyle}
                   autoCapitalize= {'none'}
                   autoCorrect={false}
                   placeholder= {'password'}
                   onChangeText={(password) => this.setState({password})}
                   returnKeyType={'go'}
                   secureTextEntry={true}
                   keyboardType={'default'}
                   ref={(passwordInput) => this.passwordInput = passwordInput}
                   value={this.state.password}
                   onFocus={this._resetErrors}
                 />
               </View>

                  <TouchableOpacity style={styles.forgotPasswordButtonStyle} onPress={this._navigate.bind(this, 'resetPassword')}>
                    <Text style={styles.textButtons}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>

                  <View style={{flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity style={styles.loginButtonStyle}
                      onPress={this.login.bind(this)}
                    >
                     <Text style={styles.textInsideButtons}>
                       Login
                     </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._navigate.bind(this,'createAccount')}>
                     <Text style={styles.textButtons}>
                       Create account?
                     </Text>
                    </TouchableOpacity>
                    {this.state.errorMessage ? <Text style={styles.errorMessageStyle}> {this.state.errorMessage} </Text> : null}
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
  loginView: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    paddingVertical: 50,
  },
  textInputStyle: {
    height: 20,
  },
  textInputViewStyle: {
    marginBottom: 10,
    borderBottomColor: '#9B9B9B',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  textButtons: {
    color: '#4A4A4A',
  	fontSize: 12,
  	fontStyle: 'italic',
  	fontWeight: '300',
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
  forgotPasswordButtonStyle: {
    alignItems: 'flex-end',
    marginRight: 20
  },

  textInsideButtons: {
  	color: '#07CF7C',
  	fontSize: 14,
  	fontWeight: '300',
  },
  errorMessageStyle: {
    marginTop: 20,
    color: 'red',
    fontSize: 14,
  	fontWeight: '300',
    textAlign: 'center',
  },
  activityIndicatorStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  }
});

export default LogIn
