import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/Detail';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Detail: DetailScreen
}, {initialRouteName:"Home"});

export default HomeStack;
