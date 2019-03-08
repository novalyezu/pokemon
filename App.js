import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Provider } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import store from "./src/publics/redux/store";

import HomeScreen from "./src/screen/Home";
import DetailPokemonScreen from "./src/screen/DetailPokemon";
import SearchScreen from "./src/screen/Search";
import AccountScreen from "./src/screen/Account";
import RegisterScreen from "./src/screen/Register";
import AddPokemonScreen from "./src/screen/AddPokemon";
import EditPokemonScreen from "./src/screen/EditPokemon";
import MapScreen from "./src/screen/Map";

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  DetailPokemon: {
    screen: DetailPokemonScreen,
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerTransparent: "true",
      headerTintColor: "#fff"
    })
  },
  AddPokemon: {
    screen: AddPokemonScreen,
    navigationOptions: () => ({
      title: "Add Pokemon"
    })
  },
  EditPokemon: {
    screen: EditPokemonScreen,
    navigationOptions: () => ({
      title: "Edit Pokemon"
    })
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: () => ({
      header: null
    })
  }
});

const AccountStack = createStackNavigator({
  Account: {
    screen: AccountScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: () => ({
      header: null
    })
  }
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

const AppContainer = createAppContainer(
  createBottomTabNavigator(
    {
      Home: {
        screen: HomeStack,
        navigationOptions: {
          title: "Home"
        }
      },
      Map: {
        screen: MapScreen,
        navigationOptions: {
          title: "Map"
        }
      },
      Account: {
        screen: AccountStack,
        navigationOptions: {
          title: "Account"
        }
      }
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === "Home") {
            iconName = `ios-home`;
          } else if (routeName === "Map") {
            iconName = `ios-map`;
          } else if (routeName === "Account") {
            iconName = `md-people`;
          }

          // You can return any component that you like here! We usually use an
          // icon component from react-native-vector-icons
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
      }),
      tabBarOptions: {
        activeTintColor: "#26a4ff",
        inactiveTintColor: "gray"
      }
    }
  )
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
