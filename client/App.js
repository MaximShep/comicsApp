import { SafeAreaView } from "react-native";
import AppNavigation from "./navigation/navigation";

export default function App() {
   return (
     <SafeAreaView style={{ flex: 1 }} >
        <AppNavigation/>
     </SafeAreaView>
    
   );
 }