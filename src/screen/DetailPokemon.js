import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  AsyncStorage,
  Modal,
  Alert,
  ScrollView
} from "react-native";
import {
  View,
  Text,
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  ActionSheet,
  Form,
  Label,
  Picker,
  Button,
  Root,
  Header,
  Right
} from "native-base";
import { connect } from "react-redux";

import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getPokemon,
  updatePokemon,
  deletePokemon
} from "../publics/redux/actions/pokemon";

var BUTTONS = [
  { text: "Edit", icon: "color-filter" },
  { text: "Delete", icon: "trash" },
  { text: "Cancel", icon: "close" }
];

var CANCEL_INDEX = 2;

class DetailPokemon extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    this.pokemon_id = navigation.getParam("id");
    this.state = {
      isLoading: true,
      modalEditVisible: false,
      name: "",
      image_url: "",
      type: "",
      category_id: "",
      latitude: "",
      longitude: ""
    };
  }

  componentDidMount() {
    this.getPokemon()
      .then(res => {
        this.setState({
          isLoading: false,
          name: this.props.pokemon.detail.name,
          image_url: this.props.pokemon.detail.image_url,
          type: this.props.pokemon.detail.types,
          category_id: this.props.pokemon.detail.category_id,
          latitude: this.props.pokemon.detail.latitude,
          longitude: this.props.pokemon.detail.longitude
        });
      })
      .catch();
  }

  getPokemon = async () => {
    const token = await AsyncStorage.getItem("token");
    await this.props.dispatch(getPokemon(this.pokemon_id));
  };

  setModalEditVisible(visible) {
    this.setState({ modalEditVisible: visible });
  }

  handleSelect = (menu, id) => {
    if (menu == 0) {
      this.props.navigation.navigate("EditPokemon", { id });
    } else if (menu == 1) {
      this.handleDelete();
    }
  };

  handleDelete = () => {
    let id = this.pokemon_id;
    Alert.alert(
      "Delete Question",
      "Are you sure want to delete this pokemon ?",
      [
        { text: "No" },
        {
          text: "Yes",
          style: "cancel",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token");
            await this.props.dispatch(deletePokemon(token, id));
            this.props.navigation.navigate("Home");
          }
        }
      ]
    );
  };

  render() {
    return (
      <Root>
        <Container>
          {this.state.isLoading ? (
            <View style={styles.activity}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <Content>
              <ScrollView>
                <View style={styles.backImage}>
                  <Image
                    source={{ uri: this.props.pokemon.detail.image_url }}
                    style={{ height: 400, width: null }}
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0.6)", "transparent"]}
                    style={styles.linearGradient}
                  />
                  {this.props.auth.isAuth ? (
                    <View style={{ position: "absolute", top: 7, right: 5 }}>
                      <Button
                        style={{ width: 30 }}
                        transparent
                        onPress={() =>
                          ActionSheet.show(
                            {
                              options: BUTTONS,
                              cancelButtonIndex: CANCEL_INDEX,
                              title: "Select Action"
                            },
                            buttonIndex => {
                              this.handleSelect(buttonIndex, this.pokemon_id);
                            }
                          )
                        }
                      >
                        <Ionicons
                          name="md-more"
                          size={30}
                          style={{ marginRight: 15 }}
                          color="#fff"
                        />
                      </Button>
                    </View>
                  ) : null}
                </View>
                <Card>
                  <CardItem bordered>
                    <Body>
                      <Text style={styles.title}>
                        {this.props.pokemon.detail.name}
                      </Text>
                      <Ionicons
                        name="ios-analytics"
                        size={20}
                        style={{ marginTop: 5 }}
                      />
                      <Text style={styles.category}>
                        {this.props.pokemon.detail.categories.name}
                      </Text>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Ionicons
                          name="ios-aperture"
                          size={20}
                          style={{ marginTop: 8 }}
                        />
                        {this.state.type.map((data, index) => (
                          <Text key={index} style={styles.type}>
                            {data.name}
                          </Text>
                        ))}
                      </View>
                    </Body>
                  </CardItem>
                </Card>
              </ScrollView>
            </Content>
          )}
        </Container>
      </Root>
    );
  }
}

const mapStateToProps = state => {
  return {
    pokemon: state.pokemon,
    auth: state.auth,
    category: state.category,
    type: state.type
  };
};

export default connect(mapStateToProps)(DetailPokemon);

const styles = StyleSheet.create({
  activity: {
    alignSelf: "center",
    marginTop: Dimensions.get("window").height / 2
  },
  backImage: {},
  image: {
    width: null,
    height: 400
  },
  title: {
    fontSize: 22,
    fontWeight: "bold"
  },
  categories: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 18
  },
  types: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 18
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 60
  },
  containerModal: {
    marginLeft: 40,
    marginRight: 40
  },
  headerModal: {
    backgroundColor: "#fff"
  },
  titleModal: {
    color: "#303030",
    fontSize: 18
  },
  viewImgModal: {
    flex: 1
  },
  imageModal: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20
  },
  btnText: {
    color: "#fff",
    fontSize: 15
  },
  btn: {
    backgroundColor: "#26a4ff",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  },
  formProfile: {
    marginTop: 10
  },
  category: {
    position: "absolute",
    left: 20,
    top: 35
  },
  type: {
    backgroundColor: "#dbdbdb",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 5,
    marginLeft: 5,
    color: "#303030"
  }
});
