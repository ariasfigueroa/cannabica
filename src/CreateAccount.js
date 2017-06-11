import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import List from './components/List';
import HeaderWithBack from './components/HeaderWithBack';
import Header from './components/Header';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { firebaseApp } from './lib/firebase'

class CreateAccount extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      addressAdditional: '',
      city: '',
      state: '',
      zip: '',
      cardNumber: '',
      cardExpiration: '',
      cardCode: '',
      errorMessage: null,
      showActivityIndicator: false,
      headerWithBack: this.props.headerWithBack,
    }
    console.log(props)

    this._resetErrors = this._resetErrors.bind(this)
  }

  _resetErrors(){
    if (this.state.errorMessage){
      this.setState({errorMessage: null})
    }
  }

  _createAccount(){
    try {
      // show the spinner
      this.setState({showActivityIndicator: true})
      // validate required fields
      if (this.state.name && this.state.email && this.state.password) {
        // firebase
        // before signIn signOut from guest
        firebaseApp.auth().signOut().then((onResolve)=> {
          // signIn with email and password.
          // authenticate with email and password.
          firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((onResolve) => {
            console.log('user has been created')
            // create contactInfo
            let path = 'users/'+onResolve.uid
            var ref = firebaseApp.database().ref(path+'/contactInfo')
            ref.set({
              displayName: this.state.name ? this.state.name : null,
              email: this.state.email ? this.state.email : null,
              phone: this.state.phone ? this.state.phone : null,
            }).then (() => {
              console.log('Contact Infor - Synchronization succeeded')
            }).catch(()=> {
              console.log('Contact Infor - Synchronization failed')
            })
            // create shipping address
            ref = firebaseApp.database().ref(path+'/shippingAddress')
            ref.set({
              address: this.state.address ? this.state.address : null,
              addressAdditional: this.state.addressAdditional ? this.state.addressAdditional : null,
              city: this.state.city ? this.state.city : null,
              state: this.state.state ? this.state.state : null,
              zip: this.state.zip ? this.state.zip : null
            }).then (() => {
              console.log('Shipping Address - Synchronization succeeded')
            }).catch(()=> {
              console.log('Shipping Address - Synchronization failed')
            })
            // create card Information
            ref = firebaseApp.database().ref(path+'/cardInformation')
            ref.set({
              carNumber: this.state.cardNumber ? this.state.cardNumber : null,
              cardExpiration: this.state.cardExpiration ? this.state.cardExpiration : null,
              cardCode: this.state.cardCode ? this.state.cardCode : null,
            }).then (() => {
              console.log('Card Information - Synchronization succeeded')
            }).catch(()=> {
              console.log('Card Information - Synchronization failed')
            })
            this.setState({showActivityIndicator: false})
            Alert.alert('Welcome!', 'Hi '+ this.state.name+ ' your account has been created.', [{text: 'Let\'s go!', onPress: this._navigate('home')}])
          }, (onReject) => {
            console.log(onReject)
            this.setState({showActivityIndicator: false})
            this.setState({errorMessage: onReject.toString})
          })
        }, (onReject) => {
          console.log(onReject)
          this.setState({showActivityIndicator: false})
          this.setState({errorMessage: onReject})
        })
      } else {
        this.setState({showActivityIndicator: false})
        this.setState({errorMessage: 'Name, Email and Password are required.'})
      }
    }catch (error) {
      console.log(error)
      this.setState({showActivityIndicator: false})
      this.setState({errorMessage: error.toString()})
    }
  }

  _navigate(routeName){
    this.props.navigator.push({
      routeName
    })
  }

  toggle(){
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  updateMenu(isOpen){
    this.setState({isOpen});
  }

  _getTextInputRefs(){
    return [this.nameInput, this.emailInput, this.passwordInput, this.phoneInput, this.addressInput, this.addressAdditionalInput, this.stateInput, this.cityInput, this.zipInput, this.cardNumberInput, this.cardExpirationInput, this.cardCodeInput]
  }

  render(){
    if (this.state.showActivityIndicator === false) {
      return (
        <View style={styles.container}>
          <SideMenu
            menu={<Menu toggle={this.toggle.bind(this)} navigator={this.props.navigator} menuSelected={this.props.menuSelected}/>}
            isOpen={this.state.isOpen}
            onChange={(isOpen) => this.updateMenu(isOpen)}
          >
            {this.state.headerWithBack ? <HeaderWithBack toggle={this.toggle.bind(this)} navigator={this.props.navigator}/> : <Header toggle={this.toggle.bind(this)} navigator={this.props.navigator}/>}
              <KeyboardAwareScrollView
              style={styles.scrollContainer}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="always"
              getTextInputRefs={this._getTextInputRefs.bind(this)}>
              {this.state.errorMessage ? <Text style={styles.errorMessageStyle}> {this.state.errorMessage} </Text> : null}
                <View style={styles.textContainer}>
                  <Text style={styles.subTitleStyle}>
                    Customer Information
                  </Text>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'Name (required)'}
                       onChangeText={(name) => this.setState({name})}
                       returnKeyType={'next'}
                       keyboardType={'default'}
                       onSubmitEditing={() => this.emailInput.focus()}
                       ref={(nameInput) => this.nameInput = nameInput}
                       value={this.state.name}
                       onFocus={this._resetErrors}
                    />
                  </View>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'Email (required)'}
                       onChangeText={(email) => this.setState({email})}
                       returnKeyType={'next'}
                       keyboardType={'email-address'}
                       onSubmitEditing={() => this.passwordInput.focus()}
                       ref={(emailInput) => this.emailInput = emailInput}
                       value={this.state.email}
                       onFocus={this._resetErrors}
                    />
                  </View>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'Password (required)'}
                       onChangeText={(password) => this.setState({password})}
                       returnKeyType={'next'}
                       keyboardType={'default'}
                       onSubmitEditing={() => this.phoneInput.focus()}
                       ref={(passwordInput) => this.passwordInput = passwordInput}
                       secureTextEntry={true}
                       value={this.state.password}
                       onFocus={this._resetErrors}
                    />
                  </View>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'Phone#'}
                       onChangeText={(phone) => this.setState({phone})}
                       returnKeyType={'next'}
                       keyboardType={'phone-pad'}
                       onSubmitEditing={() => this.addressInput.focus()}
                       ref={(phoneInput) => this.phoneInput = phoneInput}
                       value={this.state.phone}
                       onFocus={this._resetErrors}
                    />
                  </View>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.subTitleStyle}>
                    Shipping Address
                  </Text>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'Address'}
                       onChangeText={(address) => this.setState({address})}
                       returnKeyType={'next'}
                       keyboardType={'default'}
                       onSubmitEditing={() => this.addressAdditionalInput.focus()}
                       ref={(addressInput) => this.addressInput = addressInput}
                       value={this.state.address}
                       onFocus={this._resetErrors}
                    />
                  </View>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'Apt, Cond, etc'}
                       onChangeText={(addressAdditional) => this.setState({addressAdditional})}
                       returnKeyType={'next'}
                       keyboardType={'default'}
                       onSubmitEditing={() => this.cityInput.focus()}
                       ref={(addressAdditionalInput) => this.addressAdditionalInput = addressAdditionalInput}
                       value={this.state.addressAdditional}
                       onFocus={this._resetErrors}
                    />
                  </View>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'City'}
                       onChangeText={(city) => this.setState({city})}
                       returnKeyType={'next'}
                       keyboardType={'default'}
                       onSubmitEditing={() => this.stateInput.focus()}
                       ref={(cityInput) => this.cityInput = cityInput}
                       value={this.state.city}
                       onFocus={this._resetErrors}
                    />
                  </View>
                    <View  style={[styles.textInputViewStyle, {width: 120}]}>
                      <TextInput style={styles.textInputStyle}
                         autoCapitalize= {'none'}
                         autoCorrect={false}
                         placeholder= {'State'}
                         onChangeText={(state) => this.setState({state})}
                         returnKeyType={'next'}
                         keyboardType={'default'}
                         onSubmitEditing={() => this.zipInput.focus()}
                         ref={(stateInput) => this.stateInput = stateInput}
                         value={this.state.state}
                         onFocus={this._resetErrors}
                      />
                    </View>
                    <View  style={[styles.textInputViewStyle, {width: 120}]}>
                      <TextInput style={styles.textInputStyle}
                        autoCapitalize= {'none'}
                        autoCorrect={false}
                        placeholder= {'Zip Code'}
                        onChangeText={(zip) => this.setState({zip})}
                        returnKeyType={'next'}
                        keyboardType={'numeric'}
                        onSubmitEditing={() => this.cardNumberInput.focus()}
                        ref={(zipInput) => this.zipInput = zipInput}
                        value={this.state.zip}
                        onFocus={this._resetErrors}
                     />
                    </View>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.subTitleStyle}>
                    Card
                  </Text>
                  <View style={styles.textInputViewStyle}>
                    <TextInput style={styles.textInputStyle}
                       autoCapitalize= {'none'}
                       autoCorrect={false}
                       placeholder= {'Card Number'}
                       onChangeText={(cardNumber) => this.setState({cardNumber})}
                       returnKeyType={'next'}
                       keyboardType={'numeric'}
                       onSubmitEditing={() => this.cardExpirationInput.focus()}
                       ref={(cardNumberInput) => this.cardNumberInput = cardNumberInput}
                       value={this.state.cardNumber}
                       onFocus={this._resetErrors}
                    />
                  </View>
                    <View  style={[styles.textInputViewStyle, {width: 120}]}>
                      <TextInput style={styles.textInputStyle}
                         autoCapitalize= {'none'}
                         autoCorrect={false}
                         placeholder= {'Exp MM/YY'}
                         onChangeText={(cardExpiration) => this.setState({cardExpiration})}
                         returnKeyType={'next'}
                         keyboardType={'numeric'}
                         onSubmitEditing={() => this.cardCodeInput.focus()}
                         ref={(cardExpirationInput) => this.cardExpirationInput = cardExpirationInput}
                         value={this.state.cardExpiration}
                         onFocus={this._resetErrors}
                      />
                    </View>
                    <View  style={[styles.textInputViewStyle, {width: 120}]}>
                      <TextInput style={styles.textInputStyle}
                        autoCapitalize= {'none'}
                        autoCorrect={false}
                        placeholder= {'Code'}
                        onChangeText={(cardCode) => this.setState({cardCode})}
                        returnKeyType={'go'}
                        keyboardType={'numeric'}
                        ref={(cardCodeInput) => this.cardCodeInput = cardCodeInput}
                        value={this.state.cardCode}
                        onFocus={this._resetErrors}
                     />
                    </View>
                </View>

                <View style={{flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity style={styles.createAccountButtonStyle}
                    onPress={this._createAccount.bind(this)}
                  >
                   <Text style={styles.textInsideButtons}>
                     CREATE ACCOUNT
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
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  subTitleStyle: {
	color: '#4A4A4A',
	fontSize: 16,
  marginBottom: 10,
},
textInputViewStyle: {
  marginBottom: 10,
  borderBottomColor: '#9B9B9B',
  borderBottomWidth: 0.5,
},
textInputStyle: {
  height: 20,
},
rowView: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
createAccountButtonStyle: {
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
errorMessageStyle: {
  marginTop: 10,
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

export default CreateAccount
