import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage
} from "react-native";
import Button from "./Button";
import * as Expo from "expo";
import Forecast from "./Forecast";
import LocationButton from "./LocationButton";
import textStyles from "./styles/typography.js";

const STORAGE_KEY = "@SmarterWeather:zip";

import OpenWeatherMap from "./open_weather_map";

// This version uses flowers.png from local assets
//import PhotoBackdrop from "./PhotoBackdrop/local_image";

// This version pulls a specified photo from the camera roll
 import PhotoBackdrop from './PhotoBackdrop/local_image';

class WeatherProject extends Component {
  constructor(props) {
    super(props);
    this.state = { forecast: null };
  }
  
  doCallbackWork = () => {
    function always() {
      console.log('I am always executed! error or success');
    }
    this.fooCallbacks(function() {
      always();
    }, function() {
      always();
    });
  }
  fooCallbacks = (cb) => {
    callback = (cb2, input, err) => {
      console.log("Called at " + Date.now());
      setTimeout(() => {
        console.log("finished at "+ Date.now());
        cb2(this.promiseNumber++);
      },200*input);
    }
    callback(function(res, err) {
      console.log(res + ': 1');
      callback(function(res, err) {
        console.log(res + ': 2');
        callback(function(res, err) {
          console.log(res + ': 3');
          cb();
        }, 1)
      }, 2)
    }, 5);
  }
  
  doCallbackWork1 = () => {
    function always() {
      console.log('I am always executed! error or success');
    }
    this.fooCallbacks2(function() {
      always();
    }, function() {
      always();
    });
  }

  fooCallbacks2 = (cb) => {
    let callback1 = (input) => {
      console.log("Called at " + Date.now());
      setTimeout(() => {
        console.log("My " + input + " job finished at "+ Date.now());
        callback2(2);
      },200*input);
    }
    let callback2 = (input) => {
      console.log("Called at " + Date.now());
      setTimeout(() => {
        console.log("My " + input + " job finished at "+ Date.now());
        callback3(3);
      },200*input);
    }
    let callback3 = (input) => {
      console.log("Called at " + Date.now());
      setTimeout(() => {
        console.log("My " + input + " job finished at "+ Date.now());
      },200*input);
    }
    callback1(1);
  }

  doAsyncWork = () => {
    let promise = this.foo()
    promise.then(function(fooResult) {
      console.log(fooResult); // fooResult should be what is returned by doSomething3()
    })
    .catch(function(err) {
      console.error(err); // Can be thrown by any 
    })
    .done(function() {
      console.log('I am always executed! error or success');
    });
  }

  promiseNumber = 0;
  doSomething = (input) => {
    return new Promise((resolve, reject) => {
      console.log("Called at " + Date.now());
      setTimeout(() => {
        console.log("finished at "+ Date.now());
        resolve(this.promiseNumber++);
      },200*input);
    });
  }

  fooAwait = async() => {
        doSomethingResult = await this.doSomething(0);
        console.log(doSomethingResult + ': 1');
        doSomething1Result = await this.doSomething(1);
        console.log(doSomething1Result + ': 2');
        doSomething2Result = await this.doSomething(2);
        console.log(doSomething2Result + ': 3');
        return this.doSomething(3);
      }

  foo = () => {
    return this.doSomething(0)
      .then((doSomethingResult) => {
        console.log(doSomethingResult + ': 1');
        return this.doSomething(1);
      })
      .then((doSomething1Result) => {
        console.log(doSomething1Result + ': 2');
        return this.doSomething(2);
      })
      .then((doSomething2Result) => {
        console.log(doSomething2Result + ': 3');
        return this.doSomething(3);
      });
  }
  doAsyncWork2 = () => {
    this.fooAwait()
    .then(function(fooResult) {
      console.log(fooResult); // fooResult should be what is returned by doSomething3()
    })
    .catch(function(err) {
      console.error(err); // Can be thrown by any 
    })
    .done(function() {
      console.log('I am always executed! error or success');
    });
  }

    
  checkMultiPermissions = async() => {
    const { Permissions, FileSystem } = Expo;
    console.log(FileSystem.documentDirectory);
    let { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA_ROLL)
    if (status !== 'granted') {
      console.log('Hey! You heve not enabled selected permissions');
      const { newStatus, expires, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      status = newStatus;
    }
    if(status === 'granted') {
        console.log("Granted!");
        let result = await Expo.ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
        })

        console.log(result);
          if (!result.cancelled) {
            console.log(this);
            console.log("Accepted!");
            this.setState({ newPostImage:result.uri, createPostModalVisible: true })
            FileSystem.copyAsync({from:result.uri,to:FileSystem.documentDirectory+"myimage.jpg"})
            .then(() => console.log("Moved to location"));
            try {
              await AsyncStorage.setItem('@MySuperStore:key', result.uri)
              .then(() => console.log("Saved selection to disk: " + result.uri))
              .catch(error => console.error("AsyncStorage error: " + error.message))
              .done();
              console.log("saved");
              this._retrieveData();
            } catch (error) {
              // Error saving data
            }
          }
      }
      
  }      
  _retrieveData = async () => {
      console.log("Retrieving Data");
        try {
          const value = await AsyncStorage.getItem('@MySuperStore:key');
          if (value !== null) {
            // We have data!!
            console.log("Got data");
            console.log(value);
            this.setState({ newPostImage:value, createPostModalVisible: true })
          } else {
            console.log("No data");
          }
        } catch (error) {
          console.log(error);
          // Error retrieving data
        }
      }

  componentDidMount() {
    AsyncStorage
      .getItem(STORAGE_KEY)
      .then(value => {
        if (value !== null) {
          this._getForecastForZip(value);
        }
      })
      .catch(error => console.error("AsyncStorage error: " + error.message))
      .done();
      this._retrieveData();
  }

  _getForecastForZip = zip => {
    // Store zip code
    AsyncStorage
      .setItem(STORAGE_KEY, zip)
      .then(() => console.log("Saved selection to disk: " + zip))
      .catch(error => console.error("AsyncStorage error: " + error.message))
      .done();

    OpenWeatherMap.fetchZipForecast(zip).then(forecast => {
      this.setState({ forecast: forecast });
    });
  };

  _getForecastForCoords = (lat, lon) => {
    OpenWeatherMap.fetchLatLonForecast(lat, lon).then(forecast => {
      this.setState({ forecast: forecast });
    });
  };

  _handleTextChange = event => {
    let zip = event.nativeEvent.text;
    this._getForecastForZip(zip);
  };

  render() {
    let content = null;
    console.log("Rendered" + this.state.newPostImage);
    if (this.state.forecast !== null) {
      content = (
        <View style={styles.row}>
          <Forecast
            main={this.state.forecast.main}
            temp={this.state.forecast.temp}
          />
        </View>
      );
    }

    return (
      <PhotoBackdrop image={this.state.newPostImage} >
        <View style={styles.overlay}>
          <View style={styles.row}>
            <Text style={textStyles.mainText}>
              Forecast for
            </Text>
            <View style={styles.zipContainer}>
              <TextInput
                style={[textStyles.mainText, styles.zipCode]}
                onSubmitEditing={this._handleTextChange}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>

          <View style={styles.row}>
            <LocationButton onGetCoords={this._getForecastForCoords} />
          </View>
          <View style={styles.row}>
            <Button onPress={this.checkMultiPermissions} label="Choose Image"></Button>
          </View>
          <View style={styles.row}>
            <Button onPress={this.doAsyncWork} label="Do Async Work"></Button>
          </View>
          <View style={styles.row}>
            <Button onPress={this.doAsyncWork2} label="Do Async Work"></Button>
          </View>
          <View style={styles.row}>
            <Button onPress={this.doCallbackWork1} label="Callbacks 2"></Button>
          </View>
          <View style={styles.row}>
            <Button onPress={this.doCallbackWork} label="Callbacks"></Button>
          </View>

          {content}

        </View>
      </PhotoBackdrop>
    );
  }
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: "rgba(0,0,0,0.1)" },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  zipContainer: {
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
    marginLeft: 5,
    marginTop: 3,
    width: 80,
    height: textStyles.baseFontSize * 2,
    justifyContent: "flex-end"
  },
  zipCode: { flex: 1 }
});

export default WeatherProject;
