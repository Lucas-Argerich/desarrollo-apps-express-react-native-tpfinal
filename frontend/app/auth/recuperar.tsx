import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import CustomScreenView from '../../components/CustomScreenView';
import { authService } from '../../services/auth';

type Step = 'email' | 'token' | 'password';

export default function RecuperarScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      Alert.alert(
        'Token enviado',
        'Si existe una cuenta con ese email, te hemos enviado un token de recuperación.',
        [{ text: 'OK', onPress: () => setStep('token') }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el token de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!token) {
      Alert.alert('Error', 'Por favor ingresa el token recibido');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyResetToken(email, token);
      setStep('password');
    } catch (error) {
      Alert.alert('Error', 'Token inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, token, newPassword);
      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña ha sido actualizada exitosamente',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Recuperar contraseña</Text>
            <Text style={styles.stepDescription}>
              Ingresa tu email para recibir un token de recuperación
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              onPress={handleRequestReset}
              disabled={loading}
              style={styles.button}
            >
              Enviar token
            </Button>
          </View>
        );

      case 'token':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Verificar token</Text>
            <Text style={styles.stepDescription}>
              Ingresa el token que recibiste en tu email
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Token"
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
            />
            <Button
              onPress={handleVerifyToken}
              disabled={loading}
              style={styles.button}
            >
              Verificar token
            </Button>
          </View>
        );

      case 'password':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Nueva contraseña</Text>
            <Text style={styles.stepDescription}>
              Ingresa tu nueva contraseña
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <Button
              onPress={handleResetPassword}
              disabled={loading}
              style={styles.button}
            >
              Actualizar contraseña
            </Button>
          </View>
        );
    }
  };

  return (
    <CustomScreenView style={styles.container}>
      <Header title="Recuperar contraseña" />
      {renderStep()}
      <Button
        onPress={() => router.back()}
        style={styles.backButton}
        textStyle={styles.backButtonText}
      >
        Volver
      </Button>
    </CustomScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
  backButton: {
    margin: 24,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2F2F2F',
  },
  backButtonText: {
    color: '#2F2F2F',
  },
});
