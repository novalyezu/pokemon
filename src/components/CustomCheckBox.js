import React, { Component } from "react";
import { ListItem, CheckBox, Body, Text, View } from "native-base";

import { connect } from "react-redux";

class CustomCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  componentDidMount() {
    if (this.props.edit) {
      this.props.pokemon.detail.types.map(data => {
        if (data.id === this.props.data.id) {
          this.setState({
            checked: true
          });
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset == true) {
      this.setState({ checked: false });
    }
  }

  toggleChange() {
    this.setState({ checked: !this.state.checked });
    this.props.onChecked(this.props.data.id);
  }
  render() {
    return (
      <View>
        <ListItem button onPress={() => this.toggleChange()}>
          <CheckBox checked={this.state.checked} />
          <Body>
            <Text> {this.props.data.name}</Text>
          </Body>
        </ListItem>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    pokemon: state.pokemon
  };
};

export default connect(mapStateToProps)(CustomCheckBox);
