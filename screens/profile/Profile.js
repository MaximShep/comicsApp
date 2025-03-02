import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Demonstration from '../../components/demonstration';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';



export default function Profile() {
  const user = {
    name:  'Роман',
    email: 'user1',
    avatar: "",
    rating: 4.8,
    recipesCount: 3,
  };
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

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.statsContainer}>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Редактировать профиль</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
       <FlatList
                  data={comics}
                  vertical={true}
                  style={{zIndex:0, width:'100%'}}
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
                      <Demonstration image={item.Image} name={item.name} user_name={item.user_name}/>
                                )
                              }
                             
                              
                    
                  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    width:'100%'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
