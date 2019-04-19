import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

export default class DetailScreen extends React.Component {
  static navigationOptions = {
    title: "Detail",
  };
  
  render() {
    const title = this.props.navigation.getParam("title","");
    const image = this.props.navigation.getParam("image",null);
    return (
      <View style={styles.container}>
        <Text style={{fontSize:40,justifyContent:"center",alignContent:"center"}}>{title}</Text>
        <Image style={{flex:1,width:"100%",height:undefined,resizeMode:"contain"}} source={image}></Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:"center",
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
