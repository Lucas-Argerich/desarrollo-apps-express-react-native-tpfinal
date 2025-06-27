import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import CustomScreenView from '@/components/CustomScreenView';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authService } from '@/services/auth';
import * as ImagePicker from 'expo-image-picker';

type UserType = 'ESTUDIANTE' | 'CREADOR' | null;
type RegistrationStage = 'INITIAL' | 'VERIFICATION' | 'COMPLETE';

interface FormData {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Student specific fields
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  dniFront?: ImagePicker.ImagePickerAsset;
  dniBack?: ImagePicker.ImagePickerAsset;
  tramiteNumber?: string;
}

export default function RegisterScreen() {
  const [userType, setUserType] = useState<UserType>(null);
  const [registrationStage, setRegistrationStage] = useState<RegistrationStage>('INITIAL');
  const [verificationCode, setVerificationCode] = useState('');
  const [formData, setFormData] = useState<FormData>({
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

  function handleInputChange<T extends keyof FormData>(field: T, value: FormData[T]) {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async (type: 'front' | 'back') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange(type === 'front' ? 'dniFront' : 'dniBack', result.assets[0]);
    }
  };

  const validateInitialForm = () => {
    if (!formData.username || !formData.email) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const validateCompleteForm = () => {
    if (!formData.name || !formData.password || !formData.confirmPassword) {
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

    if (userType === 'ESTUDIANTE') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV || 
          !formData.dniFront || !formData.dniBack || !formData.tramiteNumber) {
        Alert.alert('Error', 'Por favor completa todos los campos requeridos para estudiantes');
        return false;
      }
    }

    return true;
  };

  const handleInitialRegister = async () => {
    if (!validateInitialForm()) return;

    try {
      setLoading(true);
      await authService.initialRegister(
        formData.username,
        formData.email,
      );
      setRegistrationStage('VERIFICATION');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyRegistrationCode(formData.email, verificationCode);
      setRegistrationStage('COMPLETE');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegister = async () => {
    if (!validateCompleteForm()) return;

    try {
      setLoading(true);
      await authService.completeRegistration(
        formData.email,
        formData.name,
        formData.password,
        userType === 'ESTUDIANTE' ? {
          numeroTarjeta: formData.cardNumber!,
          vencimientoTarjeta: formData.cardExpiry!,
          CVVTarjeta: formData.cardCVV!,
          numeroTramite: formData.tramiteNumber!,
          dniFront: formData.dniFront!,
          dniBack: formData.dniBack!
        } : undefined
      );
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  if (registrationStage === 'VERIFICATION') {
    return (
      <CustomScreenView style={styles.container}>
        <View style={styles.header}>
          <Button onPress={() => setRegistrationStage('INITIAL')} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#1B1B1B" />
          </Button>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Foody</Text>
          </View>
        </View>
        <View style={styles.verificationContainer}>
          <Ionicons name="mail" size={80} color="#EE964B" style={styles.verificationIcon} />
          <Text style={styles.verificationTitle}>Verificación de Email</Text>
          <Text style={styles.verificationText}>
            Hemos enviado un código de verificación a {formData.email}. Por favor, ingresa el código para continuar con el registro.
          </Text>
          <Input
            label="Código de Verificación"
            placeholder="Ingresa el código"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="default"
            maxLength={6}
          />
          <Button onPress={handleVerifyCode} loading={loading}>
            Verificar Código
          </Button>
        </View>
      </CustomScreenView>
    );
  }

  if (registrationStage === 'COMPLETE') {
    return (
      <CustomScreenView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Button onPress={() => setRegistrationStage('VERIFICATION')} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color="#1B1B1B" />
            </Button>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Foody</Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <Input
              label="Nombre"
              placeholder="Nombre completo"
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              icon="badge"
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

            {userType === 'ESTUDIANTE' && (
              <>
                <Text style={styles.sectionTitle}>Información de Pago</Text>
                <Input
                  label="Número de Tarjeta"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={formData.cardNumber}
                  onChangeText={value => handleInputChange('cardNumber', value)}
                  keyboardType="number-pad"
                  maxLength={16}
                />
                <View style={styles.inputRow}>
                  <Input
                    label="Vencimiento"
                    placeholder="MM/AA"
                    value={formData.cardExpiry}
                    onChangeText={value => handleInputChange('cardExpiry', value)}
                    maxLength={5}
                  />
                  <Input
                    label="CVV"
                    placeholder="XXX"
                    value={formData.cardCVV}
                    onChangeText={value => handleInputChange('cardCVV', value)}
                    keyboardType="number-pad"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>

                <Text style={styles.sectionTitle}>Documentación</Text>
                <Input
                  label="Número de Trámite"
                  placeholder="Número de trámite del DNI"
                  value={formData.tramiteNumber}
                  onChangeText={value => handleInputChange('tramiteNumber', value)}
                  keyboardType="number-pad"
                />
                <View style={styles.dniUploadContainer}>
                  <Button onPress={() => pickImage('front')} style={styles.dniUploadButton}>
                    {formData.dniFront ? 'DNI Frente ✓' : 'Subir DNI Frente'}
                  </Button>
                  <Button onPress={() => pickImage('back')} style={styles.dniUploadButton}>
                    {formData.dniBack ? 'DNI Dorso ✓' : 'Subir DNI Dorso'}
                  </Button>
                </View>
              </>
            )}

            <Button onPress={handleCompleteRegister} loading={loading}>
              Completar Registro
            </Button>
          </View>
        </ScrollView>
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
        <Input
          label="Usuario"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChangeText={value => handleInputChange('username', value)}
          autoCapitalize="none"
          icon="person"
        />
        <Input
          label="Email"
          placeholder="Email del usuario"
          value={formData.email}
          onChangeText={value => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="email"
        />
        <Button onPress={handleInitialRegister} loading={loading}>
          Continuar
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
  },
  optionImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 24,
  },
  formContainer: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 24,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginTextRegular: {
    color: '#666666',
  },
  loginTextBold: {
    color: '#EE964B',
    fontWeight: '600',
  },
  verificationContainer: {
    alignItems: 'center',
    padding: 20,
  },
  verificationIcon: {
    marginBottom: 20,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 12,
  },
  verificationText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B1B1B',
    marginTop: 24,
    marginBottom: 12,
  },
  dniUploadContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dniUploadButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
}); 