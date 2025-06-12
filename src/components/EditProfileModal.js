import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const EditProfileModal = ({ isVisible, onClose, onSave, initialBio = '' }) => {
  const [bio, setBio] = useState(initialBio);

  const handleSave = () => {
    onSave(bio);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      avoidKeyboard={true}
      style={styles.modal}
      backdropOpacity={0.8}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.content}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <MaterialCommunityIcons name="account-edit" size={28} color="#6200ee" />
            <Text style={styles.title}>Editar Perfil</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons 
              name="text-box-outline" 
              size={24} 
              color="#6200ee" 
              style={styles.inputIcon}
            />
            <TextInput
              value={bio}
              onChangeText={setBio}
              multiline
              style={styles.input}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <MaterialCommunityIcons name="close" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  content: {
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    elevation: 3,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default EditProfileModal; 