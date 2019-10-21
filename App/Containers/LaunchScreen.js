import React, { Component } from 'react'
import { ScrollView, Text, Image, View, Button } from 'react-native'
import { Images } from '../Themes'
import NavigationServices from '../Services/NavigationServices'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              This probably isn't what your app is going to look like. Unless your designer handed you this screen and, in that case, congrats! You're ready to ship. For everyone else, this is where you'll see a live preview of your fully functioning app using Ignite.
            </Text>
          </View>

          <Button
            title='Navigate To Example'
            onPress={() => NavigationServices.navigate('Example Screen')}
          />

          <Button
            title='Navigate To Custom FlatList'
            onPress={() => NavigationServices.navigate('CustomFlatListScreen')}
          />

          <Button
            title='Navigate To Custom Input'
            onPress={() => NavigationServices.navigate('CustomInputScreen')}
          />

        </ScrollView>
      </View>
    )
  }
}
