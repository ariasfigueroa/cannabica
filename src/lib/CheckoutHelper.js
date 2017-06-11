import React from 'react';
import {
  AsyncStorage
} from 'react-native';

const checkoutGlobalName = 'checkoutGlobal';

class CheckoutHelper {
  static getGlobalCheckout(callback){
    try {
      AsyncStorage.getItem(checkoutGlobalName, (err, result) => {
        if (err){
          console.log(err)
        }else if (result){
          callback(result)
        } else {
          console.log('There is not a checkout for this user')
        }
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  static setGlobalCheckout(product, addQuantities, callback){
    try {
      // convert product (json) in string.
      AsyncStorage.getItem(checkoutGlobalName, (err, result) => {
        if (err){
          console.log(err)
        }else if (result){
          let value = JSON.parse(result);
          if (value !== null && value.length > 0 && product.length > 0){
            for (var index = 0; index < value.length; index++){
              if (value[index].key === product[0].key){
                if (addQuantities === true){
                  product[0].quantity = (product[0].quantity + value[index].quantity);
                }
              }
            }
            AsyncStorage.setItem(checkoutGlobalName, JSON.stringify(product), (error) => {
              callback(error);
            })
          } else {
            AsyncStorage.setItem(checkoutGlobalName, JSON.stringify(product), (error) => {
              callback(error);
            })
          }
        } else {
          AsyncStorage.setItem(checkoutGlobalName, JSON.stringify(product), (error) => {
            callback(error);
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = CheckoutHelper
