import React, { Component } from "react";

import { ImageBackground } from "react-native";

import styles from "./style.js";

class PhotoBackdrop extends Component {
  state = {image:this.props.image};
  render() {
    console.log(this.props.image)
    if(this.props.image == undefined)
      this.state.image = require('./flowers.png');
    else
      this.state.image = {uri:this.props.image};
    return (
      <ImageBackground
        style={styles.backdrop}
        source={this.state.image}
        resizeMode="cover"
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}

export default PhotoBackdrop;
