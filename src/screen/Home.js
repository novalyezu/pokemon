import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Alert,
  AsyncStorage,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Dimensions
} from "react-native";
import {
  Container,
  Header,
  Body,
  Right,
  Grid,
  Col,
  CardItem,
  Content,
  Fab,
  Card,
  Left,
  Button,
  Footer,
  Label,
  Picker
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import CustomCheckBox from "../components/CustomCheckBox";

import { connect } from "react-redux";
import { getUser, newToken } from "../publics/redux/actions/auth";
import {
  getPokemons,
  morePokemon,
  getPokemonFilter,
  morePokemonFilter
} from "../publics/redux/actions/pokemon";
import { getCategory } from "../publics/redux/actions/category";
import { getType } from "../publics/redux/actions/type";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      checked: [],
      type: [],
      category: 0,
      reset: false,
      hasMore: false,
      typeLoadMore: "normal",
      active: "true",
      refreshing: false
    };
  }

  componentDidMount() {
    this.refreshToken()
      .then(res => {
        const auth = this.props.auth;
        AsyncStorage.setItem("token", auth.access_token.token);
        AsyncStorage.setItem("refreshToken", auth.access_token.refreshToken);
        this.getUser();
      })
      .catch(err => {
        console.log("error :v RT " + err);
      });
    this.getPokemons()
      .then(res => {
        const pokemon = this.props.pokemon;
        if (pokemon.data.page < pokemon.data.lastPage) {
          this.setState({
            hasMore: true
          });
        }
      })
      .catch();
    this.getCategory();
    this.getType().then(res => {
      this.props.type.data.map(data => {
        this.state.checked.push({ id: data.id, checked: false });
      });
    });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, typeLoadMore: "normal" });
    this.getPokemons().then(() => {
      const pokemon = this.props.pokemon;
      if (pokemon.data.page < pokemon.data.lastPage) {
        this.setState({
          refreshing: false,
          hasMore: true
        });
      } else {
        this.setState({
          refreshing: false
        });
      }
    });
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  refreshToken = async () => {
    const refresh_token = await AsyncStorage.getItem("refreshToken");
    await this.props.dispatch(newToken(refresh_token));
  };

  getUser = async () => {
    const token = await AsyncStorage.getItem("token");
    await this.props.dispatch(getUser(token));
  };

  getPokemons = async () => {
    await this.props.dispatch(getPokemons());
  };

  getCategory = async () => {
    await this.props.dispatch(getCategory());
  };

  getType = async () => {
    await this.props.dispatch(getType());
  };

  loadMorePokemon = async () => {
    this.setState({
      hasMore: false
    });
    let page = this.props.pokemon.data.page + 1;
    let load = "";
    if (this.state.typeLoadMore == "normal") {
      load = await this.props.dispatch(morePokemon(page));
    } else {
      load = await this.props.dispatch(morePokemonFilter(page));
    }
    if (load) {
      const pokemon = this.props.pokemon;
      if (pokemon.data.page < pokemon.data.lastPage) {
        this.setState({
          hasMore: true
        });
      }
    }
  };

  handleChecked = async id => {
    let checkeds = [...this.state.checked];
    let index = checkeds.findIndex(el => el.id === id);
    checkeds[index] = { ...checkeds[index], checked: !checkeds[index].checked };
    await this.setState({
      checked: checkeds
    });
  };

  handleReset = async () => {
    await this.setState({
      checked: [],
      type: [],
      category: 0,
      reset: true
    });
    this.props.type.data.map(data => {
      this.state.checked.push({ id: data.id, checked: false });
    });
    setTimeout(() => {
      this.setState({
        reset: false
      });
    }, 500);
  };

  handleFilter = async () => {
    await this.setState({
      type: [],
      typeLoadMore: "filter"
    });
    await this.state.checked.map(data => {
      if (data.checked == true) {
        this.state.type.push(data.id);
      }
    });
    if (this.state.type.length < 1 && this.state.category == 0) {
      this.setState({
        typeLoadMore: "normal"
      });
      await this.props.dispatch(getPokemons());
      this.setModalVisible(!this.state.modalVisible);
    } else {
      if (this.state.type.length > 0 && this.state.category != 0) {
        let body = {
          type: this.state.type,
          category: this.state.category
        };
        console.log(body);
        await this.props.dispatch(getPokemonFilter(body));
        this.setModalVisible(!this.state.modalVisible);
      } else if (this.state.type.length > 0 && this.state.category == 0) {
        let body = {
          type: this.state.type
        };
        console.log(body);
        await this.props.dispatch(getPokemonFilter(body));
        this.setModalVisible(!this.state.modalVisible);
      } else if (this.state.type.length < 1 && this.state.category != 0) {
        let body = {
          category: this.state.category
        };
        console.log(body);
        await this.props.dispatch(getPokemonFilter(body));
        this.setModalVisible(!this.state.modalVisible);
      }
    }
  };

  goToDetailsPokemon = id => {
    this.props.navigation.navigate("DetailPokemon", { id });
  };

  goToAddPokemon = () => {
    if (this.props.auth.isAuth) {
      this.props.navigation.navigate("AddPokemon");
    } else {
      Alert.alert("Warning", "You must login first!", [
        {
          text: "Ok",
          style: "cancel",
          onPress: () => {
            this.props.navigation.navigate("Account");
          }
        }
      ]);
    }
  };

  renderPokemonList = ({ item }) => (
    <Col style={styles.columnPokemon}>
      <TouchableOpacity onPress={() => this.goToDetailsPokemon(item.id)}>
        <CardItem cardBody style={{ alignSelf: "center" }}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
        </CardItem>
        <CardItem>
          <Body style={{ marginLeft: -5, marginRight: -5 }}>
            <Text style={styles.name}>{item.name}</Text>
          </Body>
        </CardItem>
      </TouchableOpacity>
    </Col>
  );

  render() {
    const isCloseToBottom = ({
      layoutMeasurement,
      contentOffset,
      contentSize
    }) => {
      const paddingToBottom = 20;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    };

    return (
      <Container style={styles.body}>
        <Header style={{ backgroundColor: "#fff" }} noLeft>
          <Body>
            <Text style={styles.headerTitle}>Pokemon</Text>
          </Body>
          <Right>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Search");
              }}
            >
              <Ionicons
                name="ios-search"
                size={30}
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <Ionicons name="md-funnel" size={30} style={{ marginRight: 8 }} />
            </TouchableOpacity>
          </Right>
        </Header>
        <Content
          style={{ flex: 1, marginTop: 5 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent) && this.state.hasMore) {
                this.loadMorePokemon();
              }
            }}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={styles.onerow}>
              <Grid>
                <FlatList
                  data={this.props.pokemon.data.data}
                  renderItem={this.renderPokemonList}
                  refreshing={this.props.pokemon.isLoading}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  ListFooterComponent={() => {
                    return (
                      this.props.pokemon.isLoading && (
                        <View style={{ flex: 1, padding: 10 }}>
                          <ActivityIndicator size="small" />
                        </View>
                      )
                    );
                  }}
                />
              </Grid>
            </View>
          </ScrollView>
          <View style={{ flex: 1 }}>
            <Fab
              direction="up"
              containerStyle={{}}
              style={{ backgroundColor: "#26a4ff" }}
              position="bottomRight"
              onPress={() => {
                this.goToAddPokemon();
              }}
            >
              <Entypo name="feather" size={25} color="#fff" />
            </Fab>
          </View>
        </Content>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <Header style={styles.headerModal}>
            <Left>
              <Button
                transparent
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              >
                <Ionicons name="md-close" size={25} color="#303030" />
              </Button>
            </Left>
            <Body>
              <Text style={styles.filterText}>Filter</Text>
            </Body>
            <Right>
              <Button transparent onPress={this.handleReset}>
                <Text style={styles.saveModal}>RESET</Text>
              </Button>
            </Right>
          </Header>
          <Content style={styles.contentModal}>
            <View style={styles.containerModal}>
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
                    edit={false}
                    reset={this.state.reset}
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
                  <Picker.Item label="Select category pokemon" value="0" />
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
            </View>
          </Content>
          <Footer style={styles.footer}>
            <Button style={styles.filterButton} onPress={this.handleFilter}>
              <Text style={styles.filterBtnText}>Filter</Text>
            </Button>
          </Footer>
        </Modal>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    pokemon: state.pokemon,
    type: state.type,
    category: state.category
  };
};

export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#efefef"
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 8
  },
  onerow: {
    flex: 1
  },
  columnPokemon: {
    height: 200,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#d0d0d0"
  },
  image: {
    width: 150,
    height: 150
  },
  name: {
    fontWeight: "bold",
    alignSelf: "center"
  },
  category: {
    position: "absolute",
    left: 20,
    top: 25
  },
  headerModal: {
    backgroundColor: "#fff"
  },
  filterText: {
    color: "#303030",
    fontSize: 18
  },
  saveModal: {
    color: "#303030",
    fontSize: 15
  },
  contentModal: {},
  footer: {
    backgroundColor: "#fff"
  },
  filterButton: {
    width: Dimensions.get("window").width - 20,
    alignSelf: "center",
    backgroundColor: "#26a4ff",
    justifyContent: "center"
  },
  filterBtnText: {
    color: "#fff",
    fontSize: 17
  },
  containerModal: {
    marginLeft: 40,
    marginTop: 20,
    marginRight: 40
  }
});
