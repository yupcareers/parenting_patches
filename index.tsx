import React, {useState, useEffect, useRef}  from "react";
import {View , Text,  TextInput , TouchableOpacity, ScrollView, Alert ,Dimensions} from "react-native";
import Styles from "../login/styles";
import {useNavigation} from "@react-navigation/native";
import { AntDesign , FontAwesome , Entypo } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
var {width} = Dimensions.get("window")
const login = (props)=> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
 var [data,setdata]=useState({})
 const [expoPushToken, setExpoPushToken] = useState('');
 const [notification, setNotification] = useState(false);
 const notificationListener = useRef();
 const responseListener = useRef();
    const navigation = useNavigation();
    async function sendPushNotification(expoPushToken) {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }
    
    async function registerForPushNotificationsAsync() {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      return token;
    }
    const handlePush=async (expoPushToken)=>{
    console.log("expo psuh called",expoPushToken)
              await sendPushNotification(expoPushToken);
            
    }
    useEffect(()=>{
      // This listener is fired whenever a notification is received while the app is foregrounded
notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
setNotification(notification);
});

// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
console.log(response);
});

return () => {
Notifications.removeNotificationSubscription(notificationListener.current);
Notifications.removeNotificationSubscription(responseListener.current);
};
})
    const handleSubmit =  () => {
    console.warn("clicked");
    registerForPushNotificationsAsync().then(token => {
      // setdata({...data,"Push_Notification_Key":token})
      var mydata=data
      mydata['Push_Notification_Key']=token
         axios.post('https://myparenting.life/api/login',mydata).then(async (resp)=>{
    console.log(resp.data)
    if(resp.data.success && resp.data.success == 0)
    {
      //  alert(resp.data.message)
        Alert(resp.data.message)
    }
    else
    {

       try {
     await AsyncStorage.setItem('token', JSON.stringify(resp.data.token))
     await AsyncStorage.setItem('auth_email', JSON.stringify(resp.data.email))
     await AsyncStorage.setItem('auth_data', JSON.stringify(resp.data.user))
     await AsyncStorage.setItem('auth_kid', JSON.stringify(resp.data.kids))


//  navigation.navigate("NewfeedsScreen")
 navigation.navigate('Root', { screen: 'NewfeedsScreen' });
    //console.log("___________",value)
  } catch(e) {
    // error reading value
    console.log("error",e)
     navigation.navigate("LoginScreen")
  }
    }
   

  
    }).catch(err=>{
    console.log(err)
     navigation.navigate("LoginScreen")
    })
  })
     
    }
     const validateData=(e,type)=>{
 if(type == 'email')
 {
 var re = /\S+@\S+\.\S+/;
  if(!re.test(e))
  {
   // alert("we")
    Alert.alert("Wrong email address")
  }

 }
 else if(type == 'password')
 {
  if(e.length < 8)
  {
   // alert("pass")

    Alert.alert("password should be atleast 8 characters")
  }

 }

}

    return(
        <ScrollView>
            <View style={Styles.container}>
             <Text style={{ color:"darkcyan",fontSize:26,fontWeight:"bold"}}>MyParenting.Life</Text>
               <View style={{width:width -40,height:130,backgroundColor:"white",borderColor:"darkcyan",marginTop:20,borderWidth:2}}>
    <View style={{width:width-35,height:130,top:-2,left:-4,backgroundColor:"white",borderTopStartRadius:80,borderBottomEndRadius:80,borderColor:"white",borderWidth:10,display:"flex",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:24,color:"darkcyan",width:width-45,textAlign:"center"}}>No Ads, No Selling</Text><Text style={{fontSize:24,color:"darkcyan",width:width-45,textAlign:"center"}}>No Sharing of data</Text></View>
    
</View>
                <View style={{flexDirection:'row', marginTop:10}}>
                    {/* <FontAwesome name="user" size={40} color="black" /> */}
                    <TextInput
                        style={Styles.inputField}
                        placeholder='Enter Your Email'
                        value={data && data.email? data.email : ''}
                onChangeText={(text)=>setdata({...data,"email":text.toLowerCase()})}
                 
                   onEndEditing={(e)=>validateData(e.nativeEvent.text,'email')}
                    />
                </View>

                <View style={{flexDirection:'row'}}>
                    {/* <FontAwesome name="lock" size={40} color="black" /> */}
                    <TextInput
                     secureTextEntry={true}
                        style={Styles.inputField}
                        placeholder='Enter Your Password'
                        value={data && data.password? data.password : ''}
                onChangeText={(text)=>setdata({...data,"password":text})}
                onEndEditing={(e)=>validateData(e.nativeEvent.text,'password')}
                    />
                </View>
            <TouchableOpacity onPress={handleSubmit} style={{marginLeft:"10%",marginRight:"10%",maxWidth:width-10}}>
                <View style={Styles.button}>
                    <Text style={Styles.buttonText}>
                      Login
                    </Text>
                </View>
            </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default login;