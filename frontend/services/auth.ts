import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from './api'

interface LoginResponse {
  id: string
  name: string
  email: string
  userType: string
  token: string
}

interface StudentRegistrationData {
  cardNumber: string
  cardExpiry: string
  cardCVV: string
  dniFront: string
  dniBack: string
  tramiteNumber: string
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api('/auth/login', 'POST', { email, password })
      
      if (response.status === 403) {
        throw new Error('Usuario no verificado')
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al iniciar sesión')
      }
  
      const data = await response.json()
      await AsyncStorage.setItem('token', data.token)
      await AsyncStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (error) {
      throw error
    }
  },

  async initialRegister(
    username: string,
    email: string,
    userType: string
  ): Promise<void> {
    
    const response = await api('/auth/initial-register', 'POST', { username, email, userType })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al iniciar el registro')
    }
  },

  async verifyRegistrationCode(email: string, code: string): Promise<void> {
    const response = await api('/auth/verify-registration-code', 'POST', { email, code })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al verificar el código')
    }
  },

  async completeRegistration(
    email: string,
    name: string,
    password: string,
    userType: string,
    studentData?: StudentRegistrationData
  ): Promise<LoginResponse> {
    const files = studentData ? {
      dniFront: await fetch(studentData.dniFront).then(r => r.blob()),
      dniBack: await fetch(studentData.dniBack).then(r => r.blob())
    } : undefined

    const response = await api('/auth/complete-registration', 'POST', 
      { 
        email, 
        name, 
        password, 
        userType,
        ...(studentData && {
          cardNumber: studentData.cardNumber,
          cardExpiry: studentData.cardExpiry,
          cardCVV: studentData.cardCVV,
          tramiteNumber: studentData.tramiteNumber
        })
      },
      files
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al completar el registro')
    }

    const data = await response.json()
    await AsyncStorage.setItem('token', data.token)
    await AsyncStorage.setItem('user', JSON.stringify(data))
    return data
  },

  async logout() {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token')
  },

  async getUser(): Promise<any | null> {
    const user = await AsyncStorage.getItem('user')

    return user ? JSON.parse(user) : null
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await api('/auth/request-reset', 'POST', { email })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al solicitar recuperación de contraseña')
    }
  },

  async verifyResetToken(email: string, token: string): Promise<void> {
    const response = await api('/auth/verify-token', 'POST', { email, token })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al verificar token')
    }
  },

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    const response = await api('/auth/reset-password', 'POST', { email, token, newPassword })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al restablecer contraseña')
    }
  }
}
