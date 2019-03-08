import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
  Keyboard,
  Animated,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ActivityIndicator
} from "react-native";
import { Container, Button } from "native-base";

import { connect } from "react-redux";
import { register } from "../publics/redux/actions/auth";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: "",
      email: "",
      password: ""
    };
    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = event => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height
      })
    ]).start();
  };

  keyboardWillHide = event => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0
      })
    ]).start();
  };

  doRegister = async () => {
    await this.props.dispatch(
      register({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        role: "member"
      })
    );
  };

  handleRegister = () => {
    if (
      this.state.username == "" ||
      this.state.email == "" ||
      this.state.password == ""
    ) {
      Alert.alert("Warning", "Please fill all field!");
    } else {
      this.setState({
        isLoading: true
      });
      this.doRegister()
        .then(res => {
          const auth = this.props.auth;
          AsyncStorage.setItem("token", auth.access_token.token);
          AsyncStorage.setItem("refreshToken", auth.access_token.refreshToken);
          setTimeout(() => {
            this.setState({
              isLoading: true
            });
            this.props.navigation.navigate("Account");
          }, 800);
        })
        .catch(err => {
          console.log("error :v Register " + err);
          Alert.alert("Warning", "Username or email has been used!");
          this.setState({
            isLoading: false
          });
        });
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <Animated.View
          style={[
            styles.container_login,
            { paddingBottom: this.keyboardHeight }
          ]}
        >
          <View>
            <Text style={styles.logo}>Pokemon</Text>
            <Text style={styles.sub_logo}>Give and receive for happiness.</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              value={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
            <TextInput
              style={styles.textInput}
              placeholder="E-mail"
              value={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button block style={styles.btn} onPress={this.handleRegister}>
              {this.state.isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnText}>Sign Up</Text>
              )}
            </Button>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Account")}
            >
              <Text style={styles.option}>
                Already have an account? Sign in.
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Register);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container_login: {
    backgroundColor: "#e5eeff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    fontFamily: "URW Danmark W01 Ultra",
    fontSize: 50,
    alignSelf: "center",
    color: "#303030",
    marginBottom: 10
  },
  sub_logo: {
    fontSize: 23,
    color: "#303030",
    alignSelf: "center",
    textAlign: "center",
    width: 250
  },
  textInput: {
    backgroundColor: "#fff",
    width: 300,
    alignSelf: "center",
    marginTop: 10,
    paddingLeft: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1.5
  },
  form: {
    marginTop: 40
  },
  btn: {
    backgroundColor: "#26a4ff",
    borderRadius: 5,
    marginTop: 10
  },
  btnText: {
    color: "#fff",
    fontSize: 15
  },
  option: {
    alignSelf: "center",
    textDecorationLine: "underline",
    color: "#26a4ff",
    marginTop: 10
  }
});
