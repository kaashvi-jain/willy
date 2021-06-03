import * as React from 'react';
import { Text, View, StyleSheet,TextInput,TouchableOpacity,FlatList } from 'react-native';
import db from '../confic';
import{ScrollView} from 'react-native-gesture-handler';

export default class Search extends React.Component{
  constructor(props){
    super(props);
    this.state={alltransaction:[],lasttran:null,search:''}
  }
searchtransaction=async(text)=>{
  var input = text.split("")
  if(input[0].toLowerCase()=='b'){
    const transaction=await db.collection("transaction").where('bookid','==',text).get();
    transaction.docs.map((doc)=>{
      this.setState({alltransaction:[...this.state.alltransaction,doc.data()],
      lasttran:doc})
    })
  }
  else  if(input[0].toLowerCase()=='s'){
    const transaction=await db.collection("transaction").where('studentid','==',text).get();
    transaction.docs.map((doc)=>{
      this.setState({alltransaction:[...this.state.alltransaction,doc.data()],
      lasttran:doc})
    })
  }
}
fetchtransaction=async()=>{
  var input = this.state.search.toLowerCase().split("")
  if(input[0].toLowerCase()=='b'){
    const transaction=await db.collection("transaction").where('bookid','==',this.state.search).startAfter(this.state.lasttran).limit(10).get();
    transaction.docs.map((doc)=>{
      this.setState({alltransaction:[...this.state.alltransaction,doc.data()],
      lasttran:doc})
    })
  }
  else  if(input[0].toLowerCase()=='s'){
    const transaction=await db.collection("transaction").where('studentid','==',text).startAfter(this.state.lasttran).limit(10).get();
    transaction.docs.map((doc)=>{
      this.setState({alltransaction:[...this.state.alltransaction,doc.data()],
      lasttran:doc})
    })
  }
}
componentDidMount=async()=>{
  const query= await db.collection("transaction").limit(10).get()
  query.docs.map((doc)=>{
    this.setState({alltransaction:[],lasttran:doc})
  })
}
  render(){
    return(
      <View style ={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <View style = {styles.searchbar} >
         <TextInput style = {styles.bar} placeholder = 'enter bookid or studentid'
         onChangeText={(text)=>{this.setState({search:text})}} >
          </TextInput> 
          <TouchableOpacity style = {styles.sub} onPress = {()=>{this.searchtransaction(this.state.search)}} >
           <Text style = {styles.bt} >SEARCH
           </Text>
         </TouchableOpacity>
        </View>
        <FlatList
        data= {this.state.alltransaction}
        renderItem={({item})=>(
          <View style = {{borderBottomWidth:2}} >
            <Text >{"book id : "+item.bookid}</Text>
            <Text >{"student id : "+item.studentid}</Text>
            <Text >{" transactiontype : "+item.Transactiontype}</Text>
            <Text >{"date : "+item.date.toDate()}</Text>
          </View>
        )}
        keyExtractor= {(item,index)=>index.toString()}
        onEndReached={this.fetchtransaction}
        onEndReachedThreshold={0.7}
         >

        </FlatList>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  
  searchbar :{
    flexDirection:'row',
    height:60,
    width:'auto',
    alignItems:'center',
    backgroundColor:'grey',
    borderWidth:1.5,
    fontSize:20,
    borderRightWidth:0
  },
  bar:{
    borderWidth:2,
    height:30,
    width:300,
    paddingLeft:10
  },
  sub:{backgroundColor:'salmon',padding:10,textAlign:'center',width:100,height:50}
})
