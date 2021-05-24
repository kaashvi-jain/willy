import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Transaction from './screens/transaction';
import Search from './screens/search'
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';


export default function App() {
  return (
   <AppContainer/> 
  )
}
const tabnavigator = createBottomTabNavigator({
  Transaction:{screen:Transaction},
  Search:{screen:Search}
})
const AppContainer = createAppContainer(tabnavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
