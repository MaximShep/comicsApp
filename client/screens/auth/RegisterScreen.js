import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";

import { ip_address } from "../../config";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [loginFocused, setLoginFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleRegister = async () => {
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "name": name.toLowerCase(),
        "login": login.toLowerCase(),
        "pass": password.toLowerCase()
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch(ip_address+'/user', requestOptions)
          .then(response => response.json())
          .then(async result => {
            if (result !== null) {
                // Перенаправляем на главный экран или на другой экран после успешного входа
                navigation.navigate("Login");
              } else {
                Alert.alert("Ошибка", "Не удалось зарегистрироваться. Попробуйте еще раз.");
            }}).catch(error => console.log('error', error));
        
          
    
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <Text style={styles.title}>Регистрация</Text>

      {/* Поле ввода никнейма */}
      <View
        style={[
          styles.inputContainer,
          nameFocused && styles.focusedInput,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Никнейм"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
        />
      </View>

      {/* Поле ввода почты */}
      <View
        style={[styles.inputContainer, loginFocused && styles.focusedInput]}
      >
        <TextInput
          style={styles.input}
          placeholder="Почта"
          value={login}
          onChangeText={setLogin}
          keyboardType="login-address"
          autoCapitalize="none"
          onFocus={() => setLoginFocused(true)}
          onBlur={() => setLoginFocused(false)}
        />
      </View>

      {/* Поле ввода пароля */}
      <View
        style={[styles.inputContainer, passwordFocused && styles.focusedInput]}
      >
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
      </View>

      {/* Кнопка регистрации с анимацией */}
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: buttonScale }],
          },
        ]}
      >
        <TouchableOpacity
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  onPress={handleRegister}
                  activeOpacity={0.8}
                >
                  <View style={styles.gradientButton}>
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>

      {/* Кнопка перехода к входу */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginButtonText}>
          Есть аккаунт? Войдите
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
  },
  focusedInput: {
    borderColor: "#ff9900",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
  },
  gradientButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#007aff", // Простой цвет вместо градиента
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    marginTop: 15,
  },
  loginButtonText: {
    color: "#ff9900",
    fontSize: 16,
    textAlign: "center",
  },
});