import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  Text,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  Modal
} from "react-native";
import {
  Container,
  Button,
  Form,
  Label,
  Picker,
  Content,
  Header,
  Left,
  Body,
  Right
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView from "react-native-maps";
import CustomCheckBox from "../components/CustomCheckBox";

import { connect } from "react-redux";
import { getPokemon, updatePokemon } from "../publics/redux/actions/pokemon";
import { getCategory } from "../publics/redux/actions/category";
import { getType } from "../publics/redux/actions/type";

class EditPokemon extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.pokemon_id = navigation.getParam("id");
    this.state = {
      modalVisible: false,
      checked: [],
      newType: [],
      name: "",
      image_url: "",
      type: [],
      category: "",
      isLoading: false,
      position: {
        latitude: -6.301576,
        longitude: 106.7329167
      }
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
      name: this.props.pokemon.detail.name,
      image_url: this.props.pokemon.detail.image_url,
      type: this.props.pokemon.detail.types,
      category: this.props.pokemon.detail.category_id,
      position: {
        latitude: this.props.pokemon.detail.latitude,
        longitude: this.props.pokemon.detail.longitude
      }
    });
    this.getCategory();
    this.getType().then(res => {
      this.props.type.data.map(data => {
        this.state.checked.push({ id: data.id, checked: false });
      });
      this.state.type.map(data => {
        this.state.checked.map(ch => {
          if (data.id === ch.id) {
            Object.assign(ch, {
              checked: true
            });
          } else {
            ch;
          }
        });
      });
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getCategory = async () => {
    await this.props.dispatch(getCategory());
  };

  getType = async () => {
    await this.props.dispatch(getType());
  };

  handleChecked = async id => {
    let checkeds = [...this.state.checked];
    let index = checkeds.findIndex(el => el.id === id);
    checkeds[index] = { ...checkeds[index], checked: !checkeds[index].checked };
    await this.setState({
      checked: checkeds
    });
  };

  handleSave = async () => {
    await this.setState({
      newType: []
    });
    await this.state.checked.map(data => {
      if (data.checked == true) {
        this.state.newType.push(data.id);
      }
    });
    if (
      this.state.name == "" ||
      this.state.image_url == "" ||
      this.state.newType.length == 0 ||
      this.state.category == "0"
    ) {
      Alert.alert("Warning", "Please fill all form!");
      return false;
    }
    this.setState({
      isLoading: true
    });
    let id = this.pokemon_id;
    const token = await AsyncStorage.getItem("token");
    let body = {
      name: this.state.name,
      image_url: this.state.image_url,
      type: this.state.newType,
      category_id: this.state.category,
      latitude: this.state.position.latitude,
      longitude: this.state.position.longitude
    };
    await this.props.dispatch(updatePokemon(body, token, id));
    this.setState({
      isLoading: false
    });
    this.props.navigation.navigate("Home");
  };

  handleCancel = () => {
    this.setState({
      position: {
        latitude: this.props.pokemon.detail.latitude,
        longitude: this.props.pokemon.detail.longitude
      }
    });
    this.setModalVisible(!this.state.modalVisible);
  };

  render() {
    return (
      <Container>
        <Content>
          <ScrollView>
            <View style={styles.containerModal}>
              <View style={styles.viewImgModal}>
                <Image
                  source={
                    this.state.image_url != ""
                      ? { uri: this.state.image_url }
                      : require("../images/profile.png")
                  }
                  style={styles.imageModal}
                />
              </View>
              <View style={styles.formProfile}>
                <Form>
                  <View
                    style={{
                      borderBottomColor: "#d8d8d8",
                      borderBottomWidth: 1,
                      marginBottom: 10
                    }}
                  >
                    <Label>Name</Label>
                    <TextInput
                      value={this.state.name}
                      placeholder="Enter your pokemon name here"
                      onChangeText={text => this.setState({ name: text })}
                      style={{ fontSize: 16 }}
                    />
                  </View>
                  <View
                    style={{
                      borderBottomColor: "#d8d8d8",
                      borderBottomWidth: 1,
                      marginBottom: 10
                    }}
                  >
                    <Label>Image Url</Label>
                    <TextInput
                      value={this.state.image_url}
                      placeholder="http://someimage.net/pokemon.png"
                      onChangeText={text => this.setState({ image_url: text })}
                      style={{ fontSize: 16 }}
                    />
                  </View>
                  <View
                    style={{
                      borderBottomColor: "#d8d8d8",
                      borderBottomWidth: 1,
                      marginBottom: 10
                    }}
                  >
                    <Label>Type</Label>
                    {this.props.type.data.map(data => (
                      <CustomCheckBox
                        data={data}
                        key={data.id}
                        edit={true}
                        onChecked={this.handleChecked}
                      />
                    ))}
                  </View>
                  <View
                    style={{
                      borderBottomColor: "#d8d8d8",
                      borderBottomWidth: 1,
                      marginBottom: 10
                    }}
                  >
                    <Label>Category</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Ionicons name="ios-arrow-down" />}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      style={{ width: undefined }}
                      selectedValue={this.state.category}
                      onValueChange={text =>
                        this.setState({
                          category: text
                        })
                      }
                    >
                      <Picker.Item
                        label="Select category pokemon"
                        value={this.state.type}
                      />
                      {this.props.category.data.map((data, key) => {
                        return (
                          <Picker.Item
                            label={data.name}
                            value={data.id}
                            key={key}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <View
                    style={{
                      borderBottomColor: "#d8d8d8",
                      borderBottomWidth: 1,
                      marginBottom: 10
                    }}
                  >
                    <Label>Position</Label>
                    <Button
                      bordered
                      light
                      block
                      onPress={() => {
                        this.setModalVisible(true);
                      }}
                    >
                      <Text>Set Position</Text>
                    </Button>
                  </View>
                  <Button block style={styles.btn} onPress={this.handleSave}>
                    {this.state.isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.btnText}>Save</Text>
                    )}
                  </Button>
                </Form>
              </View>
            </View>
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.handleCancel()}
          >
            <Header style={styles.headerModal}>
              <Left>
                <Button transparent onPress={() => this.handleCancel()}>
                  <Ionicons name="md-close" size={25} color="#303030" />
                </Button>
              </Left>
              <Body />
              <Right>
                <Button
                  transparent
                  onPress={() => this.setModalVisible(!this.state.modalVisible)}
                >
                  <Text style={styles.saveModal}>Save</Text>
                </Button>
              </Right>
            </Header>
            <View style={styles.mapContainer}>
              <MapView
                initialRegion={{
                  latitude: this.state.position.latitude,
                  longitude: this.state.position.longitude,
                  latitudeDelta: 0.0042,
                  longitudeDelta: 0.0031
                }}
                style={styles.maps}
              >
                <MapView.Marker
                  draggable
                  coordinate={this.state.position}
                  onDragEnd={e => {
                    this.setState({ position: e.nativeEvent.coordinate });
                  }}
                />
              </MapView>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    pokemon: state.pokemon,
    category: state.category,
    type: state.type
  };
};

export default connect(mapStateToProps)(EditPokemon);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dbdbdb"
  },
  viewImg: {
    alignItems: "center",
    backgroundColor: "#fff"
  },
  editBtn: {
    position: "relative",
    top: 10,
    left: Dimensions.get("window").width / 2 - 30,
    backgroundColor: "#f2f2f2",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d8d8d8"
  },
  editText: {
    color: "#303030"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  headerText: {
    marginTop: 10,
    fontSize: 20,
    color: "#303030"
  },
  bioText: {
    marginTop: 10,
    fontSize: 16,
    color: "#303030",
    marginBottom: 20
  },
  headerModal: {
    backgroundColor: "#fff"
  },
  saveModal: {
    color: "green",
    fontSize: 18
  },
  containerModal: {
    marginLeft: 40,
    marginTop: 20,
    marginRight: 40
  },
  textUpdate: {
    fontSize: 20
  },
  viewImgModal: {
    flex: 1,
    flexDirection: "row"
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
  mapContainer: {
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
  headerModal: {
    backgroundColor: "#fff"
  },
  saveModal: {
    color: "green",
    fontSize: 18
  }
});
