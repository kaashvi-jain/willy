import * as React from 'react';
import { Text, View, StyleSheet,TouchableOpacity,TextInput,Image,KeyboardAvoidingView,ToastAndroid, TouchableHighlightBase } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import db from '../confic';
import  firebase from 'firebase';

export default class Transaction extends React.Component{
  constructor(){
    super();
    this.state={
      hascamerapermissions:null,
      scanned:false,
      scannedbookid:'',
      scannedstudentid:'',
      buttonstate:'normal',
      Transactionmessage:''
    }
  }
  getcameraperm=async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hascamerapermissions:status == "granted",
      buttonstate:id,
      scanned:false
    })
 
  }
  handlescanned=async({type,data})=>{
    const{buttonstate}=this.state;
    if(buttonstate=="bookid"){
      this.setState({
        scanned:true,
        scannedbookid:data,
        buttonstate:'normal'
      })
    }
  else  if(buttonstate=="studentid"){
    this.setState({
      scanned:true,
      scannedstudentid:data,
      buttonstate:'normal'
    })
  } 
  }
  initiatebookissue=async()=>{
    db.collection("transaction").add({
      studentid:this.state.scannedstudentid,
      bookid:this.state.scannedbookid,
      date:firebase.firestore.Timestamp.now().toDate(),
      Transactiontype:"issued"
    })
    db.collection("books").doc(this.state.scannedbookid).update({
      bookavailability:false
    })
    db.collection("students").doc(this.state.scannedstudentid).update({
      numberofbooks:firebase.firestore.FieldValue.increment(1)
    })
  }
  initiatebookreturn=async()=>{
    db.collection("transaction").add({
      studentid:this.state.scannedstudentid,
      bookid:this.state.scannedbookid,
      date:firebase.firestore.Timestamp.now().toDate(),
      Transactiontype:"return"
    })
    db.collection("books").doc(this.state.scannedbookid).update({
      bookavailability:true
    })
    db.collection("students").doc(this.state.scannedstudentid).update({
      numberofbooks:firebase.firestore.FieldValue.increment(-1)
    })
  }
  handletransaction = async()=>{
    //alert("handling")
    var transactiontype = await this.checkbook();
    var tm = ''
    if(!transactiontype){
      alert("the book is not in the database")
      this.setState({scannedbookid:'',scannedstudentid:''})
    }
    else if (transactiontype == "issue"){
      var eligble = await this.checkstudentforissue();
      if(eligble){
        this.initiatebookissue();
        tm="bookissued";
        alert(tm)
      }
    }
    else{
      alert("returning")
      var eligble = await this.checkstudentforreturn();
      if(eligble){
        this.initiatebookreturn();
        tm="bookreturned";
        alert(tm)
      }
    }
   
    //this.setState({Transactionmessage:tm})
  }
  checkbook =async()=>{
    const bookref = await db.collection("books").where("bookid","==",this.state.scannedbookid).get();
    var Transactiontype = "";

    if(bookref.docs.length ==0){
      Transactiontype=false
     // alert("wrong book")
    }
    else{
      bookref.docs.map(doc=>{
        var book = doc.data();
        if(book.bookavailability){
          Transactiontype="issue";
        }
        else{
          Transactiontype="return"
        }
      })
    }
    //alert(Transactiontype)
   return Transactiontype 
  }
  checkstudentforissue=async()=>{
    const studentref = await db.collection("students").where("studentid","==",this.state.scannedstudentid).get();
    var eligibility="";
    if(studentref.docs.length == 0 ){
      this.setState({
        scannedstudentid:'',scannedbookid:''
      })
      eligibility=false;
      alert("the student is not there in the database")
    } 
    else{
      studentref.docs.map(doc=>{
        var student = doc.data();
        if(student.numberofbooks<2){
         eligibility=true
        }
        else{
        eligibility=false;
          alert("the student has alredy take two books");
          this.setState({
            scannedstudentid:'',scannedbookid:''
          })
        }
      })
    } 
      return eligibility 
  }
  checkstudentforreturn=async()=>{
    const transactionsref = await db.collection("transaction").where("bookid","==",this.state.scannedstudentid).limit(1).get();
    var eligibility="";
    
      transactionsref.docs.map(doc=>{
        var student = doc.data();
        if(student.studentid == this.state.scannedstudentid){
         eligibility=true
        }
        else{
        eligibility=false;
          alert("the book was issued to another student");
          this.setState({

            scannedstudentid:'',scannedbookid:''
          })
        }
      }) 
      return eligibility 
  }
  render(){
    const hascamerapermissions=this.state.hascamerapermissions;
    const scanned = this.state.scanned;
    const buttonstate= this.state.buttonstate;
    if(buttonstate!=="normal"&& hascamerapermissions){
      return(
        <BarCodeScanner
        onBarCodeScanned = {scanned?undefined:this.handlescanned}style = {StyleSheet.absoluteFillObject}
        />
      )
    }
    else if (buttonstate == "normal"){
      return(
        <KeyboardAvoidingView style ={{flex:1,justifyContent:"center",alignItems:"center"}}behavior="padding" enabled>
          <View >
            <Image source = {require("../assets/booklogo.jpg")} style = {{width:200,height:200}}/>
            <Text style = {{textAlign:'center',fontSize:35}}>WILLY</Text>
          </View>
       <View style = {styles.inputview}>
         <TextInput style = {styles.inputstyle} 
        onChangeText={(text)=>{this.setState(
         { scannedbookid:text}
        )}}
         placeholder="book id " value = {this.state.scannedbookid}>

         </TextInput>
         <TouchableOpacity style = {styles.sb} onPress = {()=>{this.getcameraperm("bookid")}}>
           <Text style = {styles.bt} >scan
           </Text>
         </TouchableOpacity>
       </View>
       <View style = {styles.inputview}>
         <TextInput style = {styles.inputstyle}onChangeText={(text)=>{this.setState(
         { scannedstudentid:text}
        )}} 
         placeholder="student id " value = {this.state.scannedstudentid}>

         </TextInput>
         <TouchableOpacity style = {styles.sb} onPress = {()=>{this.getcameraperm("studentid")}} >
           <Text style = {styles.bt} >scan
           </Text>
         </TouchableOpacity>
       </View>
       <View >
       <TouchableOpacity style = {styles.sub} onPress = {()=>{this.handletransaction()}} >
           <Text style = {styles.bt} >SUBMIT
           </Text>
         </TouchableOpacity>
       </View>
        </KeyboardAvoidingView>
      )
    }
    
  }
}
const styles = StyleSheet.create({
  dt:{fontSize:15},
  sb:{backgroundColor:'blue',padding:10,borderLeftWidth:0,width:85},
  bt:{fontSize:20},
  inputview:{
    flexDirection:'row',
    margin:20
  },
  inputstyle :{
    width:200,
    height:40,
    borderWidth:1.5,
    fontSize:20,
    borderRightWidth:0
  },
  sub:{backgroundColor:'salmon',padding:10,textAlign:'center',width:100,height:50}
})