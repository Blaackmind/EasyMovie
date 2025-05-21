import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import globalStyles from '../styles/globalStyles';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { registrar } = useAuth();
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      await registrar(email, senha, nome);
    } catch (error) {
      setErro('Erro ao registrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.container}
    >
      <View style={styles.formContainer}>
        <Title style={styles.title}>Criar Conta</Title>
        
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
        />
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        
        {erro ? <Text style={{ color: colors.error }}>{erro}</Text> : null}
        
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={carregando}
          style={styles.button}
        >
          Registrar
        </Button>
        
        <Button
          onPress={() => navigation.goBack()}
          style={styles.linkButton}
        >
          Já tem uma conta? Faça login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});