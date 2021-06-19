import React, { Component} from 'react';
import {View, Text,TouchableOpacity, StyleSheet} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements'
import {RFValue} from 'react-native-responsive-font-size'

import firebase from 'firebase';

export default class CustomSidebarMenu extends Component{

  state = {
    userId: firebase.auth().currentUser.email,
    image: '#',
    name: "",
    docId: ""
  }

  selectPicture = async ()=>{
    const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    });
    if(!cancelled){
      this.uploadImage(uri, this.state.userId)
    }
  };

  uploadImage = async(uri, imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
        .storage()
        .ref()
        .child("user_profiles/"+imageName)

    return
    ref.put(blob).then((response)=>{
      this.fetchImage(imageName)
    });
  };

  fetchImage = (imageName)=>{
    var storageRef = firebase
                    .storage()
                    .ref()
                    .child("user_profiles/"+imageName)

    storageRef
    .getDownloadURL()
    .then((url)=>{
      this.setState({image: url})
    })
    .catch((error)=>{
      this.setState({
        image: "#"
      })
    })
  }

  getUserProfile= ()=>{
    db.collection('users')
    .where("email_id", "==", this.state.userId)
    .onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        this.setState({
          name: doc.data().first_name+""+doc.data().last_name
        })
      })
    })
  }

  componentDidMount(){
    this.fetchImage(this.state.userId)
    this.getUserProfile()
  }

  render(){
    return(
      <View style={{flex:1}}>
         <View 
        style = {{
          flex: 0.5,
          alignItems: "center",
          backgroundColor: "#32867d"
        }}>
          
        <Avatar
        rounded
        source={{
          uri: this.state.image
        }}
        size = "xLarge"
        onPress = {()=>this.selectPicture()}
        containerStyle = {styles.imageContainer}
        showEditButton
        />
        <Text style = {{fontWeight: 100, fontSize: 20, paddingTop: 10}}>
          {this.state.name}
          </Text>
        </View>
        
        <DrawerItems {...this.props}/>
        <View style={{flex:1,justifyContent:'flex-end',paddingBottom:30}}>
          <TouchableOpacity style={{justifyContent:'center',padding:10,height:30,width:'100%'}}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageContainer:{
    borderRadius: RFValue(10)
  }
})