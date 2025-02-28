import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Drawing from '../screens/Drawing';
import Menu from '../screens/menu';

const stack = createNativeStackNavigator()
const bottomTab = createBottomTabNavigator();

// function Main_StackNavigator(){
//     return(
//       <MainScreen_Stack.Navigator>
//       <MainScreen_Stack.Screen name="Галерея" options={{headerShown: false}} component={Menu} />
//       <MainScreen_Stack.Screen name="Рисовалки" options={{headerShown: false}} component={Drawing} />
//     </MainScreen_Stack.Navigator>
//   )
// }

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
      <stack.Screen name="Login" component={AfterLogin} />
      <stack.Screen name="Register" component={RegisterScreen} />
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
            } else if (route.name === "Создать") {
              iconName = "add-circle";
            } else if (route.name === "Профиль") {
              iconName = "person";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        
            <bottomTab.Screen name="Создать" component={MainStack} />
            <bottomTab.Screen name="Комиксы" component={CustomRecipeStack} />
            <bottomTab.Screen name="Профиль" component={Profile} />
      </bottomTab.Navigator>
  );
}


export default function AppNavigation(){
    return(
       
        <NavigationContainer>
           <BottomTab_Navigator/>
        </NavigationContainer>
       
    )
}


