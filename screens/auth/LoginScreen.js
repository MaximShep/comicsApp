import React, { useState, useRef } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { ip_address } from "../../config";


export default function LoginScreen({ navigation }) {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleLogin = () => {
    var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
              "login":login.toLowerCase(),
              "pass": pass.toLowerCase()
            });
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            fetch(ip_address+'/getuser', requestOptions)
              .then(response => response.json())
              .then(async result => {
                if (result != "Данные не совпадают! Проверьте и повторите попытку") {
                    global.user_id = result[0].id
                    global.user_name = result[0].name
                    global.user_login = result[0].login
                    console.log(result[0])
                    // Перенаправляем на главный экран или на другой экран после успешного входа
                    navigation.navigate("ww");
                  } else {
                    Alert.alert("Ошибка", "Не удалось выполнить вход. Попробуйте еще раз.");
                }
            })
              .catch(error => console.log('error', error));
            
            
            };

  const handleRegisterRedirect = () => {
    navigation.navigate("Register");
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
      <Text style={styles.title}>Вход</Text>

      {/* Поле ввода почты */}
      <View style={[styles.inputContainer, emailFocused && styles.focusedInput]}>
        <TextInput
          style={styles.input}
          placeholder="Логин"
          value={login}
          onChangeText={setLogin}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />
      </View>

      {/* Поле ввода пароля */}
      <View style={[styles.inputContainer, passwordFocused && styles.focusedInput]}>
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          autoCapitalize="none"
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
      </View>

      {/* Кнопка входа с анимацией */}
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
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <View style={styles.gradientButton}>
            <Text style={styles.buttonText}>Войти</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Кнопка регистрации */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegisterRedirect}
      >
        <Text style={styles.registerButtonText}>
          Нет аккаунта? Зарегистрируйтесь
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
    borderColor: "#007aff",
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
  registerButton: {
    marginTop: 15,
  },
  registerButtonText: {
    color: "#007aff",
    fontSize: 16,
    textAlign: "center",
  },
});