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
  
const Menu = ({navigation}) =>{
    const comics = [
        {
          Image: '../assets/images/cover.png', // Путь к локальному изображению
          name: 'Без названия',
          dateOfCreation: '23.02.2025', // Дата создания
        },
        {
          Image: '../assets/images/cover.png', // URI для удалённого изображения
          name: 'Элемент 2',
          dateOfCreation: '23.02.2025',
        },
        {
          Image: '../assets/images/cover.png',
          name: 'Элемент 3',
          dateOfCreation: '23.02.2025',
        },
      ];
    
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={()=>{{
                navigation.navigate("Рисовалки")
            }}}
            >
                <Image source={require('../../assets/images/addButton.png')} style={{height:heightPercentageToDP(7),
        width:heightPercentageToDP(7),}}/>
            </TouchableOpacity>
            <FlatList
            data={comics}
            vertical={true}
            style={{zIndex:0, width:'100%', height:'100%'}}
            numColumns={2}
            renderItem={({item})=> (
    
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
                <ComicsItem style={{width:widthPercentageToDP(48), height:heightPercentageToDP(30), backgroundColor:'red'}} image={item.Image} name={item.name} date_of_creation={item.dateOfCreation}/>
                          )
                        }
                       
                        
              
            />
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
        marginTop:heightPercentageToDP(77),
        alignSelf:'center',
        zIndex:1
    },
    itemseparator:{
        height: 1,
        width: "10%"
      },
})

export default Menu;