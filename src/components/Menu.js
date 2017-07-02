import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

import { firebaseApp } from '../lib/firebase';

const {width, height} = Dimensions.get('window');

class Menu extends Component{
  constructor(props){
    super(props);
    this.state = {
      menuSelected: this.props.menuSelected,
      signedIn: false,
      signedInAsGuest: false,
    }
    this.logOut = this.logOut.bind(this)
    console.log(props)
  }

  async componentWillMount (){
    await this.isUserLoggedIn()
  }

  isUserLoggedIn (){
    try {
      firebaseApp.auth().onAuthStateChanged((user) => {
        if (user) {
          if (user.email === 'guest@cannabicameds.com') {
            this.setState({signedInAsGuest: true, signedIn: false})
          } else {
            this.setState({signedInAsGuest: false, signedIn: true})
          }
        } else {
          if (this.state.signedInAsGuest === false){
            firebaseApp.auth().signInWithEmailAndPassword('guest@cannabicameds.com', 'guestOnly');
            this.setState({ signedInAsGuest: true, signedIn: false})
          }
        }
        console.log(this.state)
      })
    } catch (error) {
      console.log(error)
    }
  }

  logOut(){
    try {
      firebaseApp.auth().signOut().then((onResolve) => {
        this.props.toggle()
        this.changeMenuSelected('home')
      }, (onReject) => {
        console.log(onReject)
      } )
    } catch (error) {
      console.log(error)
    }
  }

changeMenuSelected (option) {
  if (option != this.state.menuSelected){
      this.setState({menuSelected: option});
      this.props.navigator.replace({
          routeName: option,
        });
      }
}

  render(){
    return(
      <ScrollView style={styles.container}>
        <View style={styles.topMenu}>
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'home')} style={this.state.menuSelected === 'home' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'lineOfProducts')} style={this.state.menuSelected === 'lineOfProducts' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              Shop
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'cbdUniversity')} style={this.state.menuSelected === 'cbdUniversity' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              CBD University
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'insporationalStories')} style={this.state.menuSelected === 'insporationalStories' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              Inspiring Stories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'whereToFind')} style={this.state.menuSelected === 'whereToFind' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              Retail Locations
            </Text>
          </TouchableOpacity>
          {/**
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'cbdCalculator')} style={this.state.menuSelected === 'cbdCalculator' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              CBD Calculator
            </Text>
          </TouchableOpacity>
          **/}
        </View>

        <View style={styles.menu}>

          {this.state.signedIn ? null : (
            <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'logIn')} style={this.state.menuSelected === 'logIn' ? styles.topMenuSelected : styles.topMenuNotSelected}>
              <Text style={styles.textMenu}>
                Login
              </Text>
            </TouchableOpacity>

          ) }

          {this.state.signedIn ? (
            <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'profile')} style={this.state.menuSelected === 'profile' ? styles.topMenuSelected : styles.topMenuNotSelected}>
              <Text style={styles.textMenu}>
                My Account
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'createAccount')} style={this.state.menuSelected === 'createAccount' ? styles.topMenuSelected : styles.topMenuNotSelected}>
              <Text style={styles.textMenu}>
                Register
              </Text>
            </TouchableOpacity>
          )}

          {this.state.signedIn ? (
            <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'myOrders')} style={this.state.menuSelected === 'myOrders' ? styles.topMenuSelected : styles.topMenuNotSelected}>
              <Text style={styles.textMenu}>
                My Orders
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'checkout')} style={this.state.menuSelected === 'checkout' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              Check Out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeMenuSelected.bind(this, 'contactUs')} style={this.state.menuSelected === 'contactUs' ? styles.topMenuSelected : styles.topMenuNotSelected}>
            <Text style={styles.textMenu}>
              Contact Us
            </Text>
          </TouchableOpacity>
          {this.state.signedIn ? (
            <TouchableOpacity onPress={this.logOut} style={styles.topMenuNotSelected}>
              <Text style={styles.textMenu}>
                Log Out
              </Text>
            </TouchableOpacity>
          ) : null}

        </View>
      </ScrollView>
    );
  }
}

export default Menu

const styles= StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ECF0F1',
      width: width / 2 + 64,
      height: height,
    },
    topMenu: {
      paddingTop: 40,
      marginBottom: 10,
    },
    menu: {
      borderColor: '#979797',
      borderTopWidth: 1,
      marginBottom: 10,
    },
    textMenu: {
      fontSize: 16,
      fontWeight: "100",
      marginTop: 10,
      marginLeft: 20,
    },
    topMenuSelected : {
      borderLeftWidth: 4,
      borderColor: '#07CF7C',
      justifyContent: 'center',

    },
    topMenuNotSelected: {
        justifyContent: 'center',
    }
});
