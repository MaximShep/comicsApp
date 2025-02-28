import { SafeAreaView } from "react-native";
import AppNavigation from "./navigation/navigation";
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'font': require('./assets/font/Oddval-SemiBold.otf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Показываем заглушку, пока шрифты загружаются
  }

  return (
    <SafeAreaView style={{ flex: 1 }} >
       <AppNavigation/>
    </SafeAreaView>
   
  );
}
   