import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import {
  Container,
  Header,
  Left,
  Icon,
  Body,
  Input,
  Right,
  Content,
  Grid,
  CardItem,
  Col
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { searchPokemon } from "../publics/redux/actions/pokemon";

class Search extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      isLoading: false,
      hasMore: false
    };
  }

  searchInput = text => {
    this.setState({
      search: text
    });
  };

  search = async () => {
    await this.props.dispatch(searchPokemon(this.state.search));
    console.log(this.props.pokemon.search);
  };

  goToDetailsPokemon = id => {
    this.props.navigation.navigate("DetailPokemon", { id });
  };

  renderPokemonList = ({ item, index }) => (
    <Col style={styles.column}>
      <View style={styles.viewColumn} />
      <CardItem
        cardBody
        button
        style={{ alignSelf: "center" }}
        onPress={() => this.goToDetailsPokemon(item.id)}
      >
        <Image
          source={{ uri: item.image_url }}
          style={{ width: 100, height: 100, margin: 10 }}
        />
        <Body style={{ marginTop: 10 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Ionicons name="ios-analytics" size={20} style={{ marginTop: 5 }} />
          <Text style={styles.category}>{item.categories.name}</Text>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Ionicons name="ios-aperture" size={20} style={{ marginTop: 8 }} />
            {item.types.map((data, index) => (
              <Text key={index} style={styles.type}>
                {data.name}
              </Text>
            ))}
          </View>
        </Body>
        <Right style={{ marginRight: 20 }}>
          <Icon name="arrow-forward" />
        </Right>
      </CardItem>
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
        <Header style={styles.header}>
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" color="black" />
            </TouchableOpacity>
          </Left>
          <Body style={{ marginLeft: -30 }}>
            <Input
              placeholder="Search here..."
              onChangeText={text => this.searchInput(text)}
              value={this.state.search}
              style={{ width: 300 }}
              autoFocus
            />
          </Body>
          <Right>
            <TouchableOpacity onPress={this.search}>
              <Icon name="md-search" color="black" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Content style={styles.content} contentContainerStyle={{ flex: 1 }}>
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent) && this.state.hasMore) {
                this.loadMoreData();
              }
            }}
            scrollEventThrottle={16}
          >
            <View style={styles.onerow}>
              <Grid>
                <FlatList
                  data={this.props.pokemon.search.data}
                  renderItem={this.renderPokemonList}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={1}
                  ListFooterComponent={() => {
                    return (
                      this.state.isLoading && (
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
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    pokemon: state.pokemon
  };
};

export default connect(mapStateToProps)(Search);

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#efefef"
  },
  header: {
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1
  },
  content: {
    backgroundColor: "#efefef",
    flex: 1
  },
  cardview: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: -1
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  },
  onerow: {
    flex: 1,
    marginTop: 10
  },
  column: {
    height: 130,
    backgroundColor: "#fff"
  },
  viewColumn: {
    height: 2,
    width: 350,
    backgroundColor: "#efefef",
    alignSelf: "center"
  },
  category: {
    position: "absolute",
    left: 20,
    top: 30
  },
  type: {
    backgroundColor: "#dbdbdb",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 5,
    marginLeft: 5,
    height: 25,
    color: "#303030"
  }
});
