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
import ComicsItem from '../../components/comics';
import { useEffect, useState } from 'react';
  
const Menu = ({navigation}) =>{
    const [comics, setComics] = useState([]);
    console.log("comics = "+comics)
    useEffect(() => {
        const updateComics = () => {
          if (global.comics) {
            setComics(global.comics);
          }
        };
      
        updateComics(); // Инициализация при первом рендере
      
        const intervalId = setInterval(() => {
          updateComics();
        }, 100); // Проверяем каждые 100 миллисекунд
      
        return () => clearInterval(intervalId); // Очистка интервала при размонтировании
      }, []);
      
    if (comics.length!=0){
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.addButton} onPress={()=>{{navigation.navigate("Рисовалки")}}}>
                    <Image source={require('../../assets/images/addButton.png')} style={{height:heightPercentageToDP(7), width:heightPercentageToDP(7),}}/>
                </TouchableOpacity>
                <FlatList
                data={comics}
                vertical={true}
                style={{zIndex:0, width:'100%', height:'100%'}}
                numColumns={2}
                renderItem={({item})=> (
                    <ComicsItem style={{width:widthPercentageToDP(48), height:heightPercentageToDP(30), backgroundColor:'red'}} 
                    image={item.image} 
                    name={item.name} 
                    date_of_creation={item.dateOfCreation}
                    comicsBase64={item.comicsBase64}/>
                    )}     
                />
            </View>
        )
    }else{
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.addButton} onPress={()=>{{
                    navigation.navigate("Рисовалки")
                }}}
                >
                    <Image source={require('../../assets/images/addButton.png')} style={{height:heightPercentageToDP(7),
            width:heightPercentageToDP(7),}}/>
                </TouchableOpacity>
            <Image source={require('../../assets/images/nothing.png')} style={styles.nothing}/>
            </View>
        )
    }
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
        marginTop:heightPercentageToDP(77),
        alignSelf:'center',
        zIndex:1
    },
    itemseparator:{
        height: 1,
        width: "10%"
      },
    nothing:{
        alignSelf:'center',
        width:widthPercentageToDP(50),
        height:heightPercentageToDP(10),
        marginTop:heightPercentageToDP(37)
    }
})

export default Menu;



















// приколы card

                // <TaskCard object_name={item.object_name}
                //           object_image={item.object_image}
                //           object_address={item.object_address}
                //           date_of_creation={item.date_of_creation}
                //           date_of_deadline={item.date_of_deadline}
                //           user_fio={item.user_fio}
                //           user_phone={item.user_phone}
                //           task_stage_id={item.task_stage_id}
                //           task_stage_name={item.task_stage}
                //           type_of_work={item.type_of_work_name}
                //           work_category={item.work_category_name}
                //           task_id={item.task_id}
                //           description={item.description}
                //           />