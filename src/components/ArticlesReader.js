import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  WebView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Header from './HeaderWithBack'
import CachedImage from 'react-native-cached-image'
import HTMLView from 'react-native-htmlview'
import { firebaseApp } from '../lib/firebase'

class ArticlesReader extends Component{
  constructor(props){
    super(props);
    console.log(props)
    this.state = {
      key: this.props.productKey,
      thumbnailUrl: null,
      title: null,
      subTitle: null,
      bodyHtml: null,
      showActivityIndicator: true,
    }
      console.log(this.state)
  }

componentDidMount(){
    try {
      // firebase
      let path = 'articles/'
      var ref = firebaseApp.database().ref(path+this.state.key)
      ref.once('value').then((onResolve) => {
        console.log(onResolve.val())
        if (onResolve.val()){
          setTimeout(()=>{
            this.setState({
              thumbnailUrl: onResolve.val().thumbnailUrl,
              title: onResolve.val().title,
              subTitle: onResolve.val().subTitle,
              bodyHtml: onResolve.val().bodyHtml,
              showActivityIndicator: false,
            })
          }, 1000);
        }
      }, (onReject) => {
        console.log(onReject)
        this.setState({showActivityIndicator: false})
        Alert.alert('Ooops...', 'Something went wrong with this article.', [{text: 'OK', onPress: () => this.props.navigator.pop()}])
      })

    }catch (error) {
      console.log(error)
      this.setState({showActivityIndicator: false})
    }
  }

  render(){
    if (this.state.showActivityIndicator === false){
      return(
        <View style={styles.container}>
          <Header navigator={this.props.navigator}/>
          <ScrollView style={styles.scrollViewStyle}>
            <CachedImage
              style={styles.thumbnailStyle}
              source={{uri: this.state.thumbnailUrl}}
            />
            <View style={styles.articleTextContainer}>
              <Text style={styles.titleStyle}> {this.state.title}</Text>
              <Text style={styles.subTitleStyle}> {this.state.subTitle} </Text>
              <HTMLView style={styles.bodyStyle} value={this.state.bodyHtml}/>
            </View>
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
           <Header navigator={this.props.navigator}/>
            <View style={styles.activityIndicatorStyle}>
              <ActivityIndicator
                animating={this.state.showActivityIndicator}
                style={{height: 80}}
                size="large"
              />
            </View>
        </View>
      )
    }
  }
}

export default ArticlesReader


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  thumbnailStyle: {
    height: 160,
  },
  articleTextContainer: {
    marginHorizontal: 20,
  },
  titleStyle: {
    color: '#4A4A4A',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 20,
    marginBottom : 10,
  },
  subTitleStyle: {
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 10,
    marginBottom : 10,
  },
  bodyStyle: {
    marginTop: 10,
},
activityIndicatorStyle: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,1)',
},
scrollViewStyle: {
  marginBottom: 20
}
});
