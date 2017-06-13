import React, {Component} from 'react';
import {
  Navigator,
  NetInfo
} from 'react-native';

import App from './App';
import CBDUniversity from './CBDUniversity';
import LineOfProducts from './LineOfProducts';
import InspirationalStories from './InspirationalStories';
import WhereToFind from './WhereToFind';
import MyOrders from './MyOrders';
import Checkout from './Checkout';
import Profile from './Profile';
import ContactUs from './ContactUs';
import LogIn from './LogIn';
import CbdCalculator from './CbdCalculator';
import LineOfProductsDetails from './components/LineOfProductsDetails';
import ArticlesReader from './components/ArticlesReader'
import ResetPassword from './ResetPassword'
import CreateAccount from './CreateAccount'

class IndexApp extends Component{

  constructor(props) {
    super(props)
    this.state = {
      networkStatus: null,
      isConnected: false,
    }
    this._updateNetworkStatus = this._updateNetworkStatus.bind(this)
  }

  _updateNetworkStatus (networkStatus) {
       this.setState({networkStatus})
  }

  componentWillMount(){
    NetInfo.addEventListener('change', this._updateNetworkStatus)
  }

  componentWillUnmount(){
    NetInof.removeEventListener(change, this._updateNetworkStatus)
  }


  _renderScene(route, navigator){
    var navigator = {navigator}
    switch (route.routeName){
      case 'cbdUniversity': return (<CBDUniversity {...navigator} menuSelected={route.routeName}/>)
      case 'lineOfProducts': return (<LineOfProducts {...navigator} menuSelected={route.routeName}/>)
      case 'insporationalStories': return (<InspirationalStories {...navigator} menuSelected={route.routeName}/>)
      case 'whereToFind' : return (<WhereToFind {...navigator} menuSelected={route.routeName}/>)
      case 'home' : return (<App {...navigator} menuSelected={route.routeName} />)
      case 'myOrders' : return (<MyOrders {...navigator} menuSelected={route.routeName}/>)
      case 'checkout' : return (<Checkout {...navigator} menuSelected={route.routeName}/>)
      case 'profile' : return (<Profile {...navigator} menuSelected={route.routeName}/>)
      case 'contactUs' : return (<ContactUs {...navigator} menuSelected={route.routeName}/>)
      case 'logIn' : return (<LogIn {...navigator} menuSelected={route.routeName}/>)
      case 'cbdCalculator' : return (<CbdCalculator {...navigator} menuSelected={route.routeName}/>)
      case 'lineOfProductsDetails' : return(<LineOfProductsDetails {...navigator} menuSelected={route.routeName} productKey={route.productKey} _reRenderHeader={route._reRenderHeader}/>)
      case 'articlesReader' : return(<ArticlesReader {...navigator} menuSelected={route.routeName} productKey={route.productKey}/>)
      case 'resetPassword' : return (<ResetPassword {...navigator} menuSelected={route.routeName} />)
      case 'createAccount' : return(<CreateAccount {...navigator} menuSelected={route.routeName} headerWithBack={route.headerWithBack ? true : false}/>)
    }
  }

  _configureScene(route, routeStack){
    console.log('configureScene')
     return {
       ...Navigator.SceneConfigs.FloatFromLeft,
                defaultTransitionVelocity: 100,
        }
  }

  render(){
    return(
      <Navigator
        initialRoute={{routeName: 'home'}}
        renderScene={this._renderScene}
        configureScene={this._configureScene}
      />
    );
  }
}

export default IndexApp
