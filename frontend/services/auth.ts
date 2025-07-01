import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from './api'
import * as ImagePicker from 'expo-image-picker'

interface LoginResponse {
  id: string
  name: string
  email: string
  userType: string
  token: string
}

interface StudentRegistrationData {
  numeroTarjeta: string
  vencimientoTarjeta: string
  CVVTarjeta: string
  numeroTramite: string
  dniFront: ImagePicker.ImagePickerAsset
  dniBack: ImagePicker.ImagePickerAsset
}

export interface User {
  id: string
  email: string
  nombre: string
  nickname: string
  avatar: string
  token: string
  rol: string
}

export const authService = {
  async login(mail: string, password: string): Promise<User> {
    try {
      const response = await api('/auth/login', 'POST', { data: { mail, password }})

      if (response.status === 403) {
        throw new Error('Usuario no verificado')
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al iniciar sesión')
      }
  
      const data = await response.json()
      const user = {
        id: data.id,
        email: data.mail,
        nombre: data.nombre,
        nickname: data.nickname,
        avatar: data.avatar,
        token: data.token,
        rol: data.rol
      }

      await AsyncStorage.setItem('token', user.token)
      await AsyncStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      throw error
    }
  },

  async initialRegister(
    nickname: string,
    mail: string,
  ): Promise<void> {
    
    const response = await api('/auth/initial-register', 'POST', { data: { nickname, mail }})

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al iniciar el registro')
    }
  },

  async verifyRegistrationCode(mail: string, code: string): Promise<void> {
    const response = await api('/auth/verify-registration-code', 'POST', { data: { mail, code }})

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al verificar el código')
    }
  },

  async completeRegistration(
    mail: string,
    nombre: string,
    password: string,
    studentData?: StudentRegistrationData
  ): Promise<LoginResponse> {
    const files = studentData
      ? {
          dniFront: {
            uri: studentData.dniFront.uri,
            name: studentData.dniFront.fileName || studentData.dniFront.uri.split('/').pop() || 'dni_front.jpg',
            type: studentData.dniFront.mimeType || 'image'
          },
          dniBack: {
            uri: studentData.dniBack.uri,
            name: studentData.dniBack.fileName || studentData.dniBack.uri.split('/').pop() || 'dni_back.jpg',
            type: studentData.dniBack.mimeType || 'image'
          }
        }
      : undefined

    const response = await api('/auth/complete-registration', 'POST', {
      data: {
        mail,
        nombre,
        password,
        ...(studentData && {
          numeroTarjeta: studentData.numeroTarjeta,
          vencimientoTarjeta: studentData.vencimientoTarjeta,
          CVVTarjeta: studentData.CVVTarjeta,
          numeroTramite: studentData.numeroTramite
        })
      },
      files
    })

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

  async checkRole<T = 'alumno' | 'profesor'>(role: T | T[]): Promise<boolean> {
    const user = await this.getUser()
    if (!user) return false

    const userRole = user.rol as T
    if (Array.isArray(role)) {
      return role.includes(userRole)
    }
    return userRole === role
  },

  async requestPasswordReset(mail: string): Promise<void> {
    const response = await api('/auth/request-reset', 'POST', { data: { mail }})

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al solicitar recuperación de contraseña')
    }
  },

  async verifyResetToken(mail: string, token: string): Promise<void> {
    const response = await api('/auth/verify-token', 'POST', { data: { mail, token }})

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al verificar token')
    }
  },

  async resetPassword(mail: string, token: string, newPassword: string): Promise<void> {
    const response = await api('/auth/reset-password', 'POST', { data: { mail, token, newPassword }})

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al restablecer contraseña')
    }
  },

  async convertToStudent(studentData: StudentRegistrationData): Promise<void> {
    const files = {
      dniFront: {
        uri: studentData.dniFront.uri,
        name: studentData.dniFront.fileName || studentData.dniFront.uri.split('/').pop() || 'dni_front.jpg',
        type: studentData.dniFront.mimeType || 'image',
      },
      dniBack: {
        uri: studentData.dniBack.uri,
        name: studentData.dniBack.fileName || studentData.dniBack.uri.split('/').pop() || 'dni_back.jpg',
        type: studentData.dniBack.mimeType || 'image',
      },
    }
    const response = await api('/auth/user', 'PUT', {
      data: {
        numeroTarjeta: studentData.numeroTarjeta,
        vencimientoTarjeta: studentData.vencimientoTarjeta,
        CVVTarjeta: studentData.CVVTarjeta,
        numeroTramite: studentData.numeroTramite,
      },
      files,
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al convertir a estudiante')
    } else {
      const data = await response.json()

      await AsyncStorage.setItem('token', data.token)
      await AsyncStorage.setItem('user', JSON.stringify(data))
    }
  }
}
