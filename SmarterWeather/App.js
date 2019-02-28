import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WeatherProject from './weather_project.1';
export default class App extends React.Component {
  render() {
    return (
      <WeatherProject />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
