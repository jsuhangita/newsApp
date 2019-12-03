import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import { Images } from '../../Themes'
import QiscusActions from '../../Redux/QiscusRedux'
import { connect } from 'react-redux'

class LoginScreen extends React.Component {
  state = {
    userId: "guest-101",
    userKey: "passkey",
    isLogin: false
  };

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  onSubmit = () => {
    const { setQiscusUser } = this.props
    const params = {
      userId: this.state.userId,
      userKey: this.state.userKey,
    }

    setQiscusUser(params)
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.isLogin && prevState.isLogin !== this.state.isLogin) {
  //     // this.props.navigation.replace("RoomListScreen");
  //   }
  // }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ height: "100%", width: "100%" }}>
          <KeyboardAvoidingView enabled style={{ flex: 1 }}>
            <ImageBackground
              source={Images.background}
              style={styles.background}
            >
              <View style={styles.container}>
                <Image source={Images.logo} style={styles.logo} />
                <View style={styles.form}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>User ID</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={text => this.setState({ userId: text })}
                      value={this.state.userId}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>User Key</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={text => this.setState({ userKey: text })}
                      value={this.state.userKey}
                      secureTextEntry={true}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => this.onSubmit()}
                    >
                      <Text style={styles.submitText}>Start</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setQiscusUser: (params) => dispatch(QiscusActions.setUser(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%"
  },
  container: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 45,
    height: "100%",
    width: "100%"
  },
  logo: {
    marginTop: 60,
    resizeMode: "contain",
    width: "80%"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 80,
    width: "100%"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20
  },
  label: {
    fontStyle: "normal",
    fontWeight: "600",
    // lineHeight: 'normal',
    fontSize: 11,
    textTransform: "uppercase",
    color: "#979797"
  },
  input: {
    height: 35,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1
  },
  submitButton: {
    backgroundColor: "#9aca62",
    borderRadius: 2,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    color: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    textTransform: "uppercase",
    alignItems: "center"
  },
  submitText: {
    color: "white",
    textTransform: "capitalize"
  }
});
