import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabScreen from './navigations/TabScreen';
import {ActivityIndicator, AppRegistry, ScrollView, View, Dimensions, TouchableOpacity, Text} from 'react-native';
import {name as appName} from './app.json';
import * as Font from "expo-font";
import React,{useEffect} from "react"
import LoginScreen from './screens/LoginScreen';
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import firebase from './firebaseConfig';
import BuyScreen from './screens/BuyScreen';
import NFCCARDPaymentScreen from './screens/NFCCARDPaymentScreen';
import HomeScreen from './screens/HomeScreen';
import PaymentScreen from './screens/PaymentScreen';
import AdminPanel from './screens/AdminPanel';
import QRPage from './screens/QRPage';
import SalePanel from './screens/SalePanel';
import StatsPage from './screens/StatsPage.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CircleScreen from './screens/CircleScreen';
import LoadingScreen from './screens/LoadingScreen';
import Onboarding  from './screens/Onboarding';
import PersonalScreen from './screens/PersonalScreen';
import StoreReviewScreen from './screens/StoreReviewScreen';
import UserStats from './screens/UserStats';
import AccountSetup from './screens/AccountSetup';
import * as Device from 'expo-device';
// import Constants from "expo-constants"
import axios from 'axios';
import CarouselScreen from './screens/CarouselScreen';
import QRCode from 'react-native-qrcode-svg';
import '@firebase/auth';
import AttendancePage from './screens/AttendancePage';

const customFonts = {
  UberMoveBold: require("./assets/fonts/UberMoveBold.otf"),
  UberMoveMedium: require("./assets/fonts/UberMoveMedium.otf"),
  UberMoveRegular: require("./assets/fonts/UberMoveRegular.otf"),
  UberMoveLight: require("./assets/fonts/UberMoveLight.otf"),
};

const Stack = createStackNavigator();

export default function App() {

  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = React.useState(false);

  const [gotopage, setgotopage] = React.useState("");
  const [userUID, setuserUID] = React.useState("");
  const [stage, setStage] = React.useState("");
  // const [latestVersion, setLatestVersion] = React.useState(null);

  // const version = Constants.manifest.version
  const [days, setDays] = React.useState(0);



  const getData = async (uid) => {

    // const res = await axios.get('https://geolocation-db.com/json/')
    // const response = Object.assign(res.data, {timestamp : Date.now()})

    const response = Object.assign({timestamp : Date.now()})

    firebase.firestore().collection("users").doc(uid).update({"last_login_at" : Date.now() })
    firebase.firestore().collection("users").doc(uid).collection("stats").doc("login_data").update({"last_login_at" : firebase.firestore.FieldValue.arrayUnion(response)})
  
  }

 
   useEffect(() => {
    


    (async () => {


      try {
        const hehe = await Font.loadAsync(customFonts);
        console.log("FONT.loadAsync ====> ", hehe)
        setLoaded(true);
      } 
      
      catch (err) {
        console.log("EROROROROROOROROROROROROOROROR ====> ",err)
        setError(err);
      }

    })();


  }), [customFonts];



  useEffect(()=>{


    try{


    firebase.auth().onAuthStateChanged(user=>{
      console.log("USER ====> ")

      if(user){
        console.log("phoneNumber ===>", user?.phoneNumber)
        firebase.firestore().collection('users').where("phonenumber","==",user?.phoneNumber).get().then((querySnapshot) => {
          querySnapshot?.forEach(documentSnapshot => {
                  setuserUID(documentSnapshot?.id)
           
                      let DiffPaid = (Math.round(365 -((Date.now() - documentSnapshot?.data()?.datePaid) / 86400000)))
                      let DiffFree = (Math.round(30 -((Date.now() - documentSnapshot?.data()?.freeTrialStartDate) / 86400000)))

                      setStage(documentSnapshot?.data()?.stage)

                      documentSnapshot?.data()?.stage == "done" && documentSnapshot?.data()?.paid 
                        ? DiffPaid > 0 ? setgotopage("TabScreen") :setgotopage("AccountSetup")
                        : documentSnapshot?.data()?.freeTrial
                          ? DiffFree > 0 ?  setgotopage("TabScreen") :setgotopage("AccountSetup")
                          : setgotopage("AccountSetup")
                      getData(documentSnapshot?.id)
                   
              })    
    })  
      }

      else {
        setgotopage("Onboarding")
      }

      });


    }catch(err){
      console.log("ERRRPR ========> ", err)
    }


    // firebase.firestore().collection('users').doc("k8kPP10kj6aDg1ChQnETzH1oArf1").onSnapshot(doc => {  
    //   if(version !== doc?.data()?.latest_version){
    //     setIsUpdateRequired(true)
    //   }
    // })

     



  },[])

  
 
  if (error) return <View><Text>{error.message}</Text></View>;
  if (!loaded) return null;

  return (
    <SafeAreaProvider>

  
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor='#EEE'/>
      
       { gotopage
          ? 
          
        //   !isUpdateRequired || false
        //   ? <View style={{backgroundColor:"#FFF",flex:1}}>
        //   <Text style={{color:"#000",fontSize:100,fontFamily:"UberMoveBold",position:"absolute",top:"19%",textAlign:"center",left:"27%"}}>1QR</Text>
          
        //   <View style={{padding:20,position:"absolute",top:"35%",left:"33%",marginBottom:30,
        //                                                 shadowOffset:{width:8,height:6.6},shadowColor:"#000",shadowOpacity:0.41,elevation: 15,
        //                                                 }}>
    
    
                           
        //                     <QRCode  quietZone={5} size={Dimensions.get('window').width/5} value={`https://1qr.co.in`}/>
    
                                
    
        //           </View>
          
       
        // </View>
          
          
        //  :
         
         gotopage == "Onboarding"

         ?<Onboarding/>
         
         
         
         
         :<Stack.Navigator  initialRouteName={"AdminPanel"} screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown :false
        }}  >          
              <Stack.Screen name="TabScreen" component={TabScreen} initialParams={{ uid: userUID }} />
              <Stack.Screen name="AccountSetup" component={AccountSetup} initialParams={{ uid: userUID }} />

              <Stack.Screen name="QRPage" component={QRPage} initialParams={{ uid: userUID }} />
              <Stack.Screen name="PersonalScreen"  component={PersonalScreen} initialParams={{ uid: userUID }} />
              <Stack.Screen name="PaymentScreen" component={PaymentScreen} initialParams={{ uid: userUID }} />
              <Stack.Screen name="AdminPanel" component={AdminPanel} initialParams={{ uid: userUID }} />
              <Stack.Screen name="SalePanel" component={SalePanel}  />
              <Stack.Screen name="StoreReviewScreen" component={StoreReviewScreen}  />
              <Stack.Screen name="UserStats" component={UserStats}  />
              <Stack.Screen name="StatsPage" component={StatsPage}  />
              <Stack.Screen name="AttendancePage" component={AttendancePage}  />

            </Stack.Navigator> 
        : <LoadingScreen/> 
        }
      </NavigationContainer>


      </SafeAreaProvider>

  );
}


AppRegistry.registerComponent(appName, () => App)


// import React, { useEffect } from 'react';
// import {Text, View} from 'react-native';
// import firebase from "./firebaseConfig";



// const HelloWorldApp = () => {


//     useEffect(()=>{

//     firebase.auth.onAuthStateChanged(user=>{
//       if(user){

//         alert("shubh")
        
//       }
//     else alert("no")})



//   },[])


//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text>Hello, world!</Text>
//     </View>
//   );
// };
// export default HelloWorldApp;