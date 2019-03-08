import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import MapView from "react-native-maps";

import { connect } from "react-redux";

class Map extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleMapPress = id => {
    this.props.navigation.navigate("DetailPokemon", { id });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: -6.301576,
            longitude: 106.7329167,
            latitudeDelta: 0.0042,
            longitudeDelta: 0.0031
          }}
          style={styles.maps}
        >
          {this.props.pokemon.data.data.map((place, key) => (
            <MapView.Marker
              key={key}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude
              }}
              onPress={() => this.handleMapPress(place.id)}
            >
              <View style={styles.radius}>
                <Image
                  style={styles.marker}
                  source={{ uri: place.image_url }}
                />
              </View>
            </MapView.Marker>
          ))}
        </MapView>
        {/* <ScrollView
          style={styles.placeContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        >
          <View style={styles.place} />
          <View style={styles.place} />
        </ScrollView> */}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    pokemon: state.pokemon
  };
};

export default connect(mapStateToProps)(Map);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  maps: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  // radius: {
  //   height: 50,
  //   width: 50,
  //   borderRadius: 50 / 2,
  //   overflow: "hidden",
  //   backgroundColor: "rgba(0,122,255,0.1)",
  //   borderWidth: 1,
  //   borderColor: "rgba(0,122,255,0.3)",
  //   alignItems: "center",
  //   justifyContent: "center"
  // },
  marker: {
    height: 70,
    width: 70,
    overflow: "hidden"
  },
  placeContainer: {
    width: "100%",
    maxHeight: 200
  },
  place: {
    width: Dimensions.get("window").width - 40,
    maxHeight: 200,
    backgroundColor: "#fff",
    marginHorizontal: 20
  }
});
