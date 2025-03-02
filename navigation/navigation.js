import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Drawing from '../screens/drawing/Drawing';
import Menu from '../screens/drawing/menu';
import Profile from '../screens/profile/Profile';
import ViewScreen from '../screens/gallery/viewScreen';
import Gallery from '../screens/gallery/gallery';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { Ionicons } from "@expo/vector-icons";


const stack = createNativeStackNavigator()
const bottomTab = createBottomTabNavigator();

function Main_StackNavigator(){
    return(
      <stack.Navigator options={{headerShown: false}}>
      <stack.Screen name="Галерея" options={{headerShown: false}} component={Menu} />
      <stack.Screen name="Рисовалки" options={{headerShown: false}} component={Drawing} />
      <stack.Screen name="Просмотр" options={{headerShown: false}} component={ViewScreen} />
    </stack.Navigator>
  )
}
function Gallary(){
  return(
    <stack.Navigator options={{headerShown: false}}>
    <stack.Screen name="Галерея" options={{headerShown: false}} component={Gallery} />
    <stack.Screen name="Просмотр" options={{headerShown: false}} component={ViewScreen} />
  </stack.Navigator>
)
}

function ProfileStack(){
  return(
    <stack.Navigator options={{headerShown: false}}>
    <stack.Screen name="Профиль" options={{headerShown: false}} component={Profile} />
    <stack.Screen name="Просмотр" options={{headerShown: false}} component={ViewScreen} />
  </stack.Navigator>
)
}

// function AfterLogin(){
//     return (
//         <stack.Navigator screenOptions={{ headerShown: false }}>
//           <stack.Screen name="qq" component={LoginScreen} />
//           <stack.Screen name="ww" component={BottomTab_Navigator} />
//         </stack.Navigator>
//       );
// }


// function MainStack() {
//   return (
//     <stack.Navigator screenOptions={{ headerShown: false }}>
//       <stack.Screen name="qq" component={MainScreen} />
//       <stack.Screen name="ww" component={RecipeDetail} />
//     </stack.Navigator>
//   );
// }

// function CreateRecipeStack() {
//   return (
//     <stack.Navigator screenOptions={{ headerShown: false }}>
//       <stack.Screen name="qq" component={CustomRecipes} />
//       <stack.Screen name="ww" component={CreateRecipe} />
//     </stack.Navigator>
//   );
// }

// function CustomRecipeStack() {
//   return (
//     <stack.Navigator screenOptions={{ headerShown: false }}>
//       <stack.Screen name="CreateRecipe" component={CreateRecipeStack} />
//       <stack.Screen name="RecipeDetail" component={RecipeDetail_Custom} />
//     </stack.Navigator>
//   );
// }



// Навигация для экранов авторизации
function AuthStack() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Login" component={LoginScreen} />
      <stack.Screen name="Register" component={RegisterScreen} />
      <stack.Screen name="Далее" component={BottomTab_Navigator} />
    </stack.Navigator>
  );
}

function BottomTab_Navigator() {
  return (
      <bottomTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Главная") {
              iconName = "home";
            } else if (route.name === "Комиксы") {
              iconName = "people-circle-outline";
            } else if (route.name === "Профиль") {
              iconName = "person";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            display: route.name === "Рисовалки" ? 'none' : 'flex', // Скрываем bottomTab на экране Details
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        
            <bottomTab.Screen options={{headerShown: false}}name="Главная" component={Main_StackNavigator} />
            <bottomTab.Screen options={{headerShown: false}} name="Комиксы" component={Gallary} />
            <bottomTab.Screen name="Профиль" component={ProfileStack} />
      </bottomTab.Navigator>
  );
}


export default function AppNavigation(){
    return(
       
        <NavigationContainer>
           <AuthStack/>
        </NavigationContainer>
       
    )
}


