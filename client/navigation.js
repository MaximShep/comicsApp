import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MainScreen from "../screens/MainScreen/MainScreen";
import CreateRecipe from "../screens/creation/CreateScreen";
import CustomRecipes from "../screens/creation/CustomRecipes";
import RecipeDetail_Custom from "../screens/RecipeScreen";
import RecipeDetail from "../screens/MainScreen/RecipeDetail";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AfterLogin(){
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="qq" component={LoginScreen} />
          <Stack.Screen name="ww" component={BottomTab_Navigator} />
        </Stack.Navigator>
      );
}


function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="qq" component={MainScreen} />
      <Stack.Screen name="ww" component={RecipeDetail} />
    </Stack.Navigator>
  );
}

function CreateRecipeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="qq" component={CustomRecipes} />
      <Stack.Screen name="ww" component={CreateRecipe} />
    </Stack.Navigator>
  );
}

function CustomRecipeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateRecipe" component={CreateRecipeStack} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetail_Custom} />
    </Stack.Navigator>
  );
}



// Навигация для экранов авторизации
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AfterLogin} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function BottomTab_Navigator() {
  return (
      <Tab.Navigator
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
        
            <Tab.Screen name="Главная" component={MainStack} />
            <Tab.Screen name="Создать" component={CustomRecipeStack} />
            <Tab.Screen name="Профиль" component={Profile} />
      </Tab.Navigator>
  );
}


export default function AppNavigation(){
    return(
       
        <NavigationContainer>
           <AuthStack/>
        </NavigationContainer>
       
    )
}