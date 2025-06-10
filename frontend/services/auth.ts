import AsyncStorage from '@react-native-async-storage/async-storage'

interface LoginResponse {
  id: string
  name: string
  email: string
  userType: string
  token: string
}

// Definir
interface RegisterResponse extends LoginResponse {}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, 'processing')
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password })
      })
      
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

  async register(
    name: string,
    email: string,
    password: string,
    userType: string
  ): Promise<RegisterResponse> {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, userType })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al registrarse')
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
    return AsyncStorage.getItem('token')
  },

  async getUser(): Promise<any | null> {
    const user = await AsyncStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/request-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al solicitar recuperación de contraseña')
    }
  },

  async verifyResetToken(email: string, token: string): Promise<void> {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, token })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al verificar token')
    }
  },

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, token, newPassword })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al restablecer contraseña')
    }
  }
}
