import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TextInput, Text, Snackbar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      setVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setVisible(true);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setVisible(true);
      return;
    }

    const success = await register(name, email, password);
    if (!success) {
      setError('Erro ao registrar. Tente novamente.');
      setVisible(true);
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
          <Text style={styles.subtitle}>Crie sua conta</Text>

          <TextInput
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="flat"
            underlineColor="transparent"
            placeholderTextColor="#ffffffcc"
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="flat"
            underlineColor="transparent"
            placeholderTextColor="#ffffffcc"
            keyboardType="email-address"
            autoCapitalize="none"
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
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="flat"
            underlineColor="transparent"
            placeholderTextColor="#ffffffcc"
            secureTextEntry
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
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            mode="flat"
            underlineColor="transparent"
            placeholderTextColor="#ffffffcc"
            secureTextEntry
            theme={{
              colors: {
                text: '#ffffff',
                background: 'rgba(255,255,255,0.1)',
                primary: '#ffffff',
                placeholder: '#ffffffcc',
              }
            }}
          />

          <TouchableOpacity style={styles.neonButton} onPress={handleRegister}>
            <Text style={styles.loginButtonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              Já tem uma conta?{' '}
              <Text style={styles.registerTextHighlight}>Faça login</Text>
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
    marginBottom: 80,
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
});

export default RegisterScreen;
