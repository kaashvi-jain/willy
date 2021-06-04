import * as React from 'react';
import { Text, View, StyleSheet,TouchableOpacity,TextInput,Image,KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
export default class Login extends React.Component{
    constructor(){
        super();
        this.state={
            email:'',password:''
        }
    }
    login = async(email,password)=>{
        if(email && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(email,password)
                if(response){
                    this.props.navigation.navigate('Transaction')
                }
            }
            catch(error){
                switch (error.code) {
                    case 'auth/user-not-found':
                        alert("user does not exist") 
                        break;
                    case 'auth/invaild-email':
                        alert("invaild emailor password")
                        break;
                    default:
                        break;
                }
            }
        }
        else{
            alert('enter email and password')
        }
    }
    render(){
        return(
            <KeyboardAvoidingView style = {{alignItems:'center',marginTop:20}} behavior="padding" enabled>
            <View >
                <Image source = {require("../assets/booklogo.jpg")} style = {{width:200,height:200}}/>
                <Text style = {{textAlign:'center',fontSize:35}}>WILLY</Text>
            </View>
            <View style = {styles.inputview} >
            <TextInput style = {styles.inputstyle}onChangeText={(text)=>{this.setState(
            { email:text}
            )}} 
            keyborderType='email-address'
            placeholder="abc@example.com" value = {this.state.scannedstudentid}>

            </TextInput>
            <TextInput style = {styles.inputstyle}onChangeText={(text)=>{this.setState(
            { password:text}
            )}} 
            secureTextEntry={true}
            placeholder=" enter password" value = {this.state.scannedstudentid}>

            </TextInput>
            </View>
            <View>
            <TouchableOpacity style = {styles.sub} onPress = {()=>{this.login(this.state.email,this.state.password)}} >
           <Text style = {styles.bt} >LOG IN
           </Text>
         </TouchableOpacity>
            </View>

            </KeyboardAvoidingView>

        )
    }
}
const styles = StyleSheet.create({
 
  inputview:{
    margin:20
  },
  inputstyle :{
    width:200,
    height:40,
    borderWidth:1.5,
    fontSize:20,
    
  },
  sub:{backgroundColor:'salmon',padding:10,textAlign:'center',width:100,height:50}
})