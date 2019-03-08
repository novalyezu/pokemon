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
import { login } from "../publics/redux/actions/auth";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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

  handleLogin = () => {
    this.setState({
      isLoading: true
    });
    this.doLogin()
      .then(res => {
        this.props.move.navigation.navigate("Home");
      })
      .catch(err => {
        console.log("error login :v " + err);
        Alert.alert("Warning", "Email or password is wrong!");
        this.setState({
          isLoading: false
        });
      });
  };

  doLogin = async () => {
    await this.props.move.dispatch(
      login({
        email: this.state.email,
        password: this.state.password
      })
    );
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
            <Text style={styles.sub_logo}>Hi! Welcome back!.</Text>
          </View>
          <View style={styles.form}>
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
            <Button block style={styles.btn} onPress={this.handleLogin}>
              {this.state.isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnText}>Sign in</Text>
              )}
            </Button>
            <TouchableOpacity
              onPress={() => this.props.move.navigation.navigate("Register")}
            >
              <Text style={styles.option}>Don't have an account? Sign up.</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Container>
    );
  }
}

export default connect()(Login);

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
