import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       exchangerName: "",
       allBarters : []
     }
     this.requestRef= null
   }

   getExchangerDetails=(donorId)=>{
    db.collection("users").where("email_id","==", donorId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          exchangerName : doc.data().first_name + " " + doc.data().last_name
        })
      });
    })
  }


   getAllBarters =()=>{
     this.requestRef = db.collection("all_Barters").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allBarters = snapshot.docs.map(document => document.data());
       this.setState({
         allBarters : allBarters,
       });
     })
   }

   sendItem = (barterDetails)=>{
      if(barterDetails.request_status === "Item sent"){
        var requestStatus = "Donor Interested"
        db.collection('all_donations').doc(barterDetails.doc_id).update({
          "request_status": "Donor Interested"
        })
        this.sendNotification(barterDetails, requestStatus)
      }
      else{
        var requestStatus =  "Item Sent"
        db.collection('all_donations').doc(barterDetails.doc_id).update({
          "request_status": "Item Sent"
        })
        this.sendNotification(barterDetails, requestStatus)
      }
   }

   sendNotification=(barterDetails, requestStatus)=>{
     var requestId = barterDetails.request_id
     var donorId = barterDetails.donorId
     db.collection("all_notifications")
     .where("exchanger_id", "==", requestId)
     .where("donor_id", "==", donorId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
          var message = ""
          if(requestStatus === "Item Sent"){
            message = this.state.exchangerName + "sent you a item"
          }else{
            message = this.state.exchangerName + "has shown interest in donating item"
          }
          db.collection("all_notifications").doc(doc.id).update({
            "message": message,
            "notification_status": "unread",
            "date": firebase.firestore.FieldValue.serverTimestamp(),
          })
       });
    })
  }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={styles.button} 
           onPress = {()=>{
             this.props.navigation.navigate("RecieverDetails", {"details": item})
           }}>
             <Text style={{color:'#ffff'}}>Exchange</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getAllBarters()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all Barters</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})
