import { View, Text, StyleSheet, Alert } from 'react-native';
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await authService.login(email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomScreenView style={styles.container}>
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
}); 