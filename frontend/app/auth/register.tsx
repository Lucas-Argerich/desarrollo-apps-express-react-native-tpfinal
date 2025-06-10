import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import CustomScreenView from '@/components/CustomScreenView';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authService } from '@/services/auth';

type UserType = 'ESTUDIANTE' | 'CREADOR' | null;

export default function RegisterScreen() {
  const [userType, setUserType] = useState<UserType>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const userTypeMap = {
        'ESTUDIANTE': 'ALUMNO',
        'CREADOR': 'INSTRUCTOR'
      };
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        userTypeMap[userType as keyof typeof userTypeMap]
      );
      setShowVerification(true);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <CustomScreenView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Foody</Text>
          </View>
        </View>
        <View style={styles.verificationContainer}>
          <Ionicons name="mail" size={80} color="#EE964B" style={styles.verificationIcon} />
          <Text style={styles.verificationTitle}>¡Registro exitoso!</Text>
          <Text style={styles.verificationText}>
            Hemos enviado un correo de verificación a {formData.email}. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
          </Text>
          <Button onPress={() => router.replace('/auth/login')}>
            Ir a iniciar sesión
          </Button>
        </View>
      </CustomScreenView>
    );
  }

  if (userType === null) {
    return (
      <CustomScreenView style={styles.container}>
        <View style={styles.header}>
          <Button onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="close" size={24} color="#1B1B1B" />
          </Button>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Foody</Text>
          </View>
        </View>
        <Text style={styles.title}>Registrarse Como</Text>
        <View style={styles.optionsContainer}>
          <Button onPress={() => handleUserTypeSelect('ESTUDIANTE')} style={styles.optionImage}>
            <FontAwesome5 name="user-graduate" size={80} color="#EE964B" />
          </Button>
          <Text style={styles.optionText}>ESTUDIANTE</Text>
          <Button onPress={() => handleUserTypeSelect('CREADOR')} style={styles.optionImage}>
            <FontAwesome5 name="user-tie" size={80} color="#EE964B" />
          </Button>
          <Text style={styles.optionText}>CREADOR</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            <Text style={styles.loginTextRegular}>¿Ya tienes una cuenta? </Text>
            <Link href="/auth/login" style={styles.loginTextBold}>Inicia sesión</Link>
          </Text>
        </View>
      </CustomScreenView>
    );
  }

  return (
    <CustomScreenView style={styles.container}>
      <View style={styles.header}>
        <Button onPress={() => setUserType(null)} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#1B1B1B" />
        </Button>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Foody</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <Input
            label="Usuario"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChangeText={value => handleInputChange('username', value)}
            autoCapitalize="none"
            icon="person"
          />
          <Input
            label="Nombre"
            placeholder="Nombre de pila"
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
            icon="badge"
          />
        </View>
        <Input
          label="Email"
          placeholder="Email del usuario"
          value={formData.email}
          onChangeText={value => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="email"
        />
        <Input
          label="Contraseña"
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={value => handleInputChange('password', value)}
          secureTextEntry
          icon="lock"
        />
        <Input
          label="Repite la Contraseña"
          placeholder="Contraseña"
          value={formData.confirmPassword}
          onChangeText={value => handleInputChange('confirmPassword', value)}
          secureTextEntry
          icon="lock"
        />
        <Button onPress={handleRegister} loading={loading}>
          Registrarse
        </Button>
        <View style={styles.divider} />
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            <Text style={styles.loginTextRegular}>¿Ya tienes una cuenta? </Text>
            <Link href="/auth/login" style={styles.loginTextBold}>Inicia sesión</Link>
          </Text>
        </View>
      </View>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
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
  logoContainer: {
    height: 112,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoText: {
    color: '#EE964B',
    fontSize: 64,
    fontFamily: 'Pacifico',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  title: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  optionImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.15,
    shadowRadius: 19,
    elevation: 5,
    marginHorizontal: 16,
  },
  optionText: {
    color: '#1B1B1B',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    letterSpacing: 0.1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  divider: {
    width: 142,
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    marginVertical: 20,
    alignSelf: 'center',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    color: '#1B1B1B',
    textAlign: 'center',
  },
  loginTextRegular: {
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  loginTextBold: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  verificationIcon: {
    marginBottom: 16,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1B1B',
    textAlign: 'center',
  },
  verificationText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 