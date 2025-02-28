import { useNavigation } from "@react-navigation/core"
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from "react-native"
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen"

const width = widthPercentageToDP(48)

export default function ComicsItem(props){
    const {navigate} = useNavigation()
    const{
        image,
        name,
        date_of_creation
    } = props
    console.log(date_of_creation)
    return(
        <TouchableOpacity style={styles.controller} onPress={()=>{navigate("Просмотр")}}>
            <Image source={require('../assets/images/cover.png')} style={styles.image}/>
            <View style={styles.container}>
                {/* <View> */}
                    <Text style={styles.name}>{name}</Text>
                    {/* <Text styles={styles.date}>изменено: {date_of_creation}</Text> */}
                {/* </View> */}
                <TouchableOpacity onPress={()=>{navigate("Рисовалки")}}>
                    <Image source={require('../assets/images/other.png')} style={styles.other}/>
                </TouchableOpacity>
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
        flexDirection:'row',
        alignItems:'center',
        height:heightPercentageToDP(5)
    },
    other:{
        width:widthPercentageToDP(6),
        height:widthPercentageToDP(6),
        marginLeft:widthPercentageToDP(6)
    },
    name:{
        fontFamily:'font',
        marginLeft:widthPercentageToDP(3),
        fontSize:widthPercentageToDP(3.8),
        width:widthPercentageToDP(30)
    }
})