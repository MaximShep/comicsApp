import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    Modal,
    Image,
    FlatList
  } from 'react-native';
  import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
  
const Menu = ({navigation}) =>{
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>{{
                navigation.navigate("Рисовалки")
            }}}
            >
                <Image source={require('../../assets/images/addButton.png')} style={styles.addButton}/>
            </TouchableOpacity>
            <FlatList/>

        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        width:'100%',
        height:'100%'
    },
    addButton:{
        height:heightPercentageToDP(7),
        width:heightPercentageToDP(7),
        position:'absolute',
        marginTop:heightPercentageToDP(80),
        alignSelf:'center'      
    }
})

export default Menu;