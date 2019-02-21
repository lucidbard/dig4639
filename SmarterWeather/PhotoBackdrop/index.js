import React, { Component } from "react";

import { ImageBackground, CameraRoll } from "react-native";

import styles from "./style";

class PhotoBackdrop extends Component {
  constructor(props) {
    super(props);
    this.state = { photoSource: null };
  }

  componentDidMount() {
    CameraRoll.getPhotos({ first: 1 }).then(data => {
      this.setState({ photoSource: { uri: data.edges[3].node.image.uri } });
    }, error => {
      console.warn(error);
    }).catch(()=> {
      console.log("Error");
    });
  }

  render() {
    if(this.props.image!=undefined)
      this.state.photoSource = {uri:this.props.image};
    return (
      <ImageBackground
        style={styles.backdrop}
        source={this.state.photoSource}
        resizeMode="cover"
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}

export default PhotoBackdrop;
