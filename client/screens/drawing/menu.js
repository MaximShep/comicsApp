import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    Modal,
    Image
  } from 'react-native';
  
const Menu = ({navigation}) =>{
    return(
        <View>
            <TouchableOpacity onPress={()=>{{
                navigation.navigate("Рисовалки")
            }}}>
                {/* <Image source={require('../assets/icon.png')}/> */}
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({

})

export default Menu;