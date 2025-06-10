import { View, Text, StyleSheet, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomScreenView from '@/components/CustomScreenView';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authService } from '@/services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notVerified, setNotVerified] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await authService.login(email, password);
      router.replace('/');
    } catch (error: any) {
      console.log('message:', error.message)
      if (error.message === 'Usuario no verificado') {
        setNotVerified(true);
      } else { 
        Alert.alert('Error', error instanceof Error ? error.message : 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomScreenView style={styles.container}>
      <Modal
        visible={notVerified}
        transparent
        animationType="slide"
        onRequestClose={() => setNotVerified(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Usuario no verificado</Text>
            <Text style={styles.modalText}>Revisa tu correo electrónico y haz click en el enlace de verificación para poder iniciar sesión.</Text>
            <Button onPress={() => setNotVerified(false)}>Cerrar</Button>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Button onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={24} color="#1B1B1B" />
        </Button>
        <Text style={styles.title}>Foody</Text>
      </View>
      <View style={styles.form}>
        <Input
          label="Email/Usuario"
          placeholder="Email o nombre de usuario"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          icon="email"
        />
        <Input
          label="Contraseña"
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock"
        />
        <Button onPress={handleLogin} loading={loading}>
          Iniciar Sesión
        </Button>
        <Button onPress={() => router.push('/auth/recuperar')} style={styles.linkButton} textStyle={styles.linkButtonText}>
          ¿Te has olvidado la contraseña?
        </Button>
        <View style={styles.divider} />
        <Button onPress={() => router.push('/auth/register')}>
          Registrarse
        </Button>
      </View>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconButton: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 64,
    fontFamily: 'Pacifico',
    color: '#EE964B',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  form: {
    gap: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    width: 142,
    alignSelf: 'center',
  },
  linkButton: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
    marginVertical: 0,
  },
  linkButtonText: {
    color: '#1B1B1B',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#EE964B',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#1B1B1B',
  },
}); 