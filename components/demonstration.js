import { useNavigation } from "@react-navigation/core"
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from "react-native"
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen"

const width = widthPercentageToDP(48)

export default function Demonstration(props){
    const {navigate} = useNavigation()
    const{
        image,
        name,
        user_name
    } = props
    console.log(user_name)
    return(
        <TouchableOpacity style={styles.controller}  onPress={()=>{navigate("Просмотр", {
            comicsName: name
        })}}>
            <Image source={require('../assets/images/cover.png')} style={styles.image}/>
            <View style={styles.container}>
                    <Text style={styles.name}>{name}</Text>
                    <Text styles={styles.ale}>{user_name}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    controller:{
        height:heightPercentageToDP(32),
        width:widthPercentageToDP(48),
        marginRight:widthPercentageToDP(4),
    },
    image:{
        height:heightPercentageToDP(26),
        width:widthPercentageToDP(48),
    },
    container:{
        alignItems:'center',
        height:heightPercentageToDP(5),
        justifyContent:'center',
        width:widthPercentageToDP(48)
    },
    other:{
        width:widthPercentageToDP(6),
        height:widthPercentageToDP(6),
        marginLeft:widthPercentageToDP(6)
    },
    name:{
        fontFamily:'font',
        fontSize:widthPercentageToDP(3.8),
    },
    ale:{
        fontFamily:'font',
        fontSize:widthPercentageToDP(2.8),
    }
})