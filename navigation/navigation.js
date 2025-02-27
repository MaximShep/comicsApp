import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Drawing from '../screens/Drawing';

const MainScreen_Stack = createNativeStackNavigator()
function Main_StackNavigator(){
    return(
      <MainScreen_Stack.Navigator>
      <MainScreen_Stack.Screen name="Рисовалки" options={{headerShown: false}} component={Drawing} />
    </MainScreen_Stack.Navigator>
  )
}

export default function AppNavigation(){
    return(
        <NavigationContainer>
           <Main_StackNavigator/>
        </NavigationContainer>
    )
}