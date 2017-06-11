import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import Swiper from 'react-native-swiper';
import CachedImage from 'react-native-cached-image';
import { firebaseApp } from '../lib/firebase';

const {width} = Dimensions.get('window');

const Slider = props => (
    <TouchableOpacity style={styles.container} onPress={() => {
      if (props._reRenderHeader && props.targetScreen === 'lineOfProductsDetails'){
        props.navigator.push({
            routeName: props.targetScreen,
            productKey: props.productKey,
            _reRenderHeader: props._reRenderHeader,
        });
      } else {
        props.navigator.push({
            routeName: props.targetScreen,
            productKey: props.productKey,
        });
      }
    }}>
      <View style={styles.sliderViewContainer}>
        <CachedImage style={styles.image} source={{uri: props.uri}}/>
      </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
  },
  image: {
    flex: 1,
    width
  },
  sliderViewContainer: {
    flex: 1
  }
});
export default class extends Component{
  constructor(props){
    super(props);
    this.state = {
      imagesSlider: this.props.imagesSlider
      }
      console.log(props)
  }

  render (){
    if (this.state.imagesSlider) {
      return (
        <View>
          <Swiper
            removeClippedSubviews={false}
            autoplay={true}
            height= {180}
            >
              {this.state.imagesSlider.map((item, i) => <Slider
                uri={item.image}
                key={i}
                productKey={item.key}
                targetScreen={item.targetScreen}
                navigator={this.props.navigator}
                _reRenderHeader={this.props._reRenderHeader}
                />
                )
              }
          </Swiper>
        </View>
      );
    } else {
      return(
        <View style={{height: 180, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            animating={this.state.imagesSlider ? false : true}
            style={{height: 80}}
            size="large"
          />
        </View>
      )
    }

  }
}
