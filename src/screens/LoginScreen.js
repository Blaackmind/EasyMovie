import React, { useState, useContext } from 'react';
import {View,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,Image } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
  
    const success = await login(email, password);
    if (success) {
      navigation.navigate('Main'); 
    } else {
      setError('E-mail ou senha incorretos');
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#0F2027', '#2C5364']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.topSection}>
          <Image
            source={require('../assets/logosolo.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.logo}>
            Easy<Text style={styles.logoHighlight}>Movie</Text>
          </Text>
          <Text style={styles.subtitle}>Entre para continuar</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="flat"
            underlineColor="transparent"
            theme={{
              colors: {
                text: '#ffffff',
                background: 'rgba(255,255,255,0.1)',
                primary: '#ffffff',
                placeholder: '#ffffffcc',
              }
            }}
          />

          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            mode="flat"
            underlineColor="transparent"
            theme={{
              colors: {
                text: '#ffffff',
                background: 'rgba(255,255,255,0.1)',
                primary: '#ffffff',
                placeholder: '#ffffffcc',
              }
            }}
          />

          <TouchableOpacity style={styles.neonButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              Não tem uma conta?{' '}
              <Text style={styles.registerTextHighlight}>Registre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topSection: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 70,
  },
  middleSection: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  logoHighlight: {
    color: '#00ffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  neonButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00ffff',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#ccc',
    fontSize: 14,
  },
  registerTextHighlight: {
    color: '#00ffff',
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#e94560',
    margin: 20,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 10,
  },
});

export default LoginScreen;
