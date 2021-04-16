import React from "react";
import {StyleSheet,Dimensions} from "react-native";
const { height,width } = Dimensions.get('window')

const Styles = StyleSheet.create({
    inputField:{
        borderColor:"#77a797",
        borderWidth:2,
        margin:15,
        color:"black",
        fontSize:22,
        width:'95%',
        height:50,
        borderRadius:35,
        textAlign: "center"
    },
lable:{
    color:"black",
    fontSize:28,
    margin:10,
    //borderRadius:10
},
container:{
    // alignContent:"center"
    // alignItems:'center'
    padding:15,
    // margin:10,
    height,
//    flex:1,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
},
button:{
    backgroundColor:"#77a797",
    height:50,
    width:width-100,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:50,
    marginTop:20,
    marginLeft:20,
    marginRight:20,
    // marginLeft:30,
    // left:10,
    borderColor:'#5c7a70',
    borderWidth:2,
    zIndex:-1
},
buttonText:{
    color:"white",
    fontSize:20,
    fontWeight:"bold",
    // backgroundColor:"blue",
    width:"95%",
    textAlign:"center"
}

})

export default Styles;