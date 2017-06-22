import React from 'react';
import {
  AsyncStorage
} from 'react-native';

const _CHECKOUT_GLOBAL_NAME = 'checkoutGlobal';

class CheckoutHelper {
  static getGlobalCheckout(callback){
    try {
      AsyncStorage.getItem(_CHECKOUT_GLOBAL_NAME, (err, result) => {
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
      AsyncStorage.getItem(_CHECKOUT_GLOBAL_NAME, (err, result) => {
        if (err){
          console.log(err)
        }else if (result){
          var productFoundIndex = 0;
          var productFoundIndicator = false;
          let value = JSON.parse(result);
          if (value !== null && value.length > 0 && product.length > 0){
            for (var index = 0; index < value.length; index++){
              if (value[index].key === product[0].key){
                  productFoundIndex = index;
                  productFoundIndicator = true;
                  break;
                }
            }

            if (productFoundIndicator) {
              if (addQuantities) {
                value[productFoundIndex].quantity = (value[productFoundIndex].quantity + 1);
              } else if (value[productFoundIndex].quantity > 1){
                value[productFoundIndex].quantity = (value[productFoundIndex].quantity - 1);
              }

            } else {
              value.push(product[0]);
            }
            console.log('here');
            AsyncStorage.setItem(_CHECKOUT_GLOBAL_NAME, JSON.stringify(value), (error) => {
              callback(error);
            })
          } else {
            console.log('here');
            AsyncStorage.setItem(_CHECKOUT_GLOBAL_NAME, JSON.stringify(product), (error) => {
              callback(error);
            })
          }
        } else {
          console.log('here');
          AsyncStorage.removeItem(_CHECKOUT_GLOBAL_NAME, (error) => {
            callback(error);
          });
          AsyncStorage.setItem(_CHECKOUT_GLOBAL_NAME, JSON.stringify(product), (error) => {
            callback(error);
          });
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  static deleteGlobalCheckout(product, callback){
    try {
      // convert product (json) in string.
      AsyncStorage.getItem(_CHECKOUT_GLOBAL_NAME, (err, result) => {
        if (err){
          console.log(err)
        }else if (result){
          var productFoundIndex = 0;
          var productFoundIndicator = false;
          let value = JSON.parse(result);
          if (value !== null && value.length > 0 && product.length > 0){
            for (var index = 0; index < value.length; index++){
              if (value[index].key === product[0].key){
                  productFoundIndex = index;
                  productFoundIndicator = true;
                  break;
                }
            }

            if (productFoundIndicator) {
              value.splice(productFoundIndex, 1);
            } else {
              console.log('product '+ productFoundIndex + ' was not found');
            }
            console.log('here');
            AsyncStorage.removeItem(_CHECKOUT_GLOBAL_NAME, (error) => {
              callback(error);
            });
            AsyncStorage.setItem(_CHECKOUT_GLOBAL_NAME, JSON.stringify(value), (error) => {
              callback(error);
            });
          } else {
            console.log('The product was not found in the device');
          }
        } else {
          console.log('The product was not found in the device');
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  static setItemAsyncStorage (item, callback, search){
    try {
      console.log("top of setItemAsyncStorage")
      if (item == null || item.length == 0){
        console.error("item is null...");
        return;
      }
      AsyncStorage.getItem(_CHECKOUT_GLOBAL_NAME, (asyncError, results) => {
        if (asyncError){
          console.log(asyncError);
        } else if (results){
          // convert the results in a JSON Array using JSON.parse()
          var checkoutGlobalItems = JSON.parse(results);
          console.log(checkoutGlobalItems);
            // validate if checkoutGlobalItems is not null and is not empty
            if (checkoutGlobalItems && checkoutGlobalItems.length > 0){
              let itemIndex = search(item, checkoutGlobalItems);
              console.log(itemIndex);
              if (itemIndex < 0) {
                //Item not found
                console.log("product not found");
                checkoutGlobalItems.push(item);
                //process the array in AsyncStorage
                AsyncStorage.removeItem(_CHECKOUT_GLOBAL_NAME, (error) => {
                  if (error) {
                    console.log(error);
                  }
                });
                AsyncStorage.setItem(_CHECKOUT_GLOBAL_NAME, JSON.stringify(checkoutGlobalItems), (error) => {
                  callback(error);
                });
              } else {
                console.log("product found");
                //item found
                checkoutGlobalItems.findIndex((elementLocal, indexLocal, arrayLocal) => {
                  if (item.key === elementLocal.key){
                    console.log("The index is: " + indexLocal);
                    checkoutGlobalItems[indexLocal].quantity += item.quantity;
                    //process the array in AsyncStorage
                    AsyncStorage.removeItem(_CHECKOUT_GLOBAL_NAME, (error) => {
                      if (error) {
                        console.log(error);
                      }
                    });
                    AsyncStorage.setItem(_CHECKOUT_GLOBAL_NAME, JSON.stringify(checkoutGlobalItems), (error) => {
                      callback(error);
                    });
                  }
                });
              }
            }else {
            checkoutGlobalItems.push(item);
            AsyncStorage.setItem(_CHECKOUT_GLOBAL_NAME, JSON.stringify(checkoutGlobalItems), (error) => {
              callback(error);
            });
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = CheckoutHelper
