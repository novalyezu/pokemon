import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  AsyncStorage,
  Alert
} from "react-native";
import { Text, Container, Content, Header, Button } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import Login from "./Login";
import { logout } from "../publics/redux/actions/auth";

class Account extends Component {
  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    Alert.alert("Warning", "Are you sure want to logout ?", [
      { text: "No" },
      {
        text: "Yes",
        style: "cancel",
        onPress: () => {
          this.doLogout()
            .then(res => {
              AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("refreshToken");
              this.props.navigation.navigate("Home");
            })
            .catch(err => {
              console.log("error :v Logut " + err);
            });
        }
      }
    ]);
  };

  doLogout = async () => {
    const token = this.props.auth.access_token.token;
    await this.props.dispatch(logout(token));
  };

  render() {
    if (!this.props.auth.isAuth) {
      return <Login move={this.props} />;
    }
    return (
      <Container>
        <Header style={{ backgroundColor: "#fff" }}>
          <Text style={styles.headerTitle}>Account</Text>
        </Header>
        <Content>
          <View>
            <View>
              <Image
                source={require("../images/parallax.jpg")}
                style={{ height: 150, width: null }}
              />
              <Image
                source={require("../images/profile.png")}
                style={styles.profile}
              />
              <Text style={styles.name}>Noval Vatria Yezu</Text>
              <TouchableOpacity
                onPress={() => this.handleLogout()}
                style={{ position: "absolute", top: 20, right: 20 }}
              >
                <Text style={styles.logout}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Account);

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center"
  },
  profile: {
    height: 45,
    width: 45,
    position: "absolute",
    top: 80,
    left: 30
  },
  name: {
    color: "#fff",
    fontSize: 18,
    position: "absolute",
    top: 90,
    left: 90
  },
  logout: {
    color: "#fff",
    textDecorationLine: "underline"
  },
  editprofile: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline"
  },
  viewAlamat: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  headerAlamat: {
    fontFamily: "Verdana",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },
  img: {
    height: 20,
    width: 20
  },
  btn: {
    flexDirection: "row"
  },
  garis: {
    borderBottomWidth: 1,
    marginLeft: 30,
    borderBottomColor: "gray"
  },
  edit: {
    backgroundColor: "#d8d8d8",
    borderWidth: 1,
    borderColor: "gray",
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 10
  },
  textEdit: {
    color: "#212121"
  }
});
