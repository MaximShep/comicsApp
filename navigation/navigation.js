import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Drawing from '../screens/drawing/Drawing';
import Menu from '../screens/drawing/menu';
import Profile from '../screens/profile/Profile';
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Галерея" component={Menu} />
      <Stack.Screen name="Рисовалки" component={Drawing} />
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Главная") iconName = "home";
          else if (route.name === "Комиксы") iconName = "people-circle-outline";
          else if (route.name === "Профиль") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false, // Скрываем заголовки для всех экранов BottomTab
        tabBarStyle: ({ state }) => {
          const route = state.routes[state.index];
  const currentRoute = route.state?.routes[route.state.index]?.name || route.name;
  return currentRoute === 'Рисовалки' ? { display: 'none' } : {};
        },
      })}
    >
      <BottomTab.Screen name="Главная" component={MainStackNavigator} />
      <BottomTab.Screen name="Комиксы" component={Menu} />
      <BottomTab.Screen name="Профиль" component={Profile} />
    </BottomTab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}