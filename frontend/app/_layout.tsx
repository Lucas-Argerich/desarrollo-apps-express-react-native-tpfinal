import { Stack, useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import CargandoScreen from './cargando'

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) return
    // Simulate loading time or perform any necessary initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // 3 seconds loading time

    return () => clearTimeout(timer)
  }, [isLoading, router])

  // TODO: Remove this
  return isLoading ? (
    <CargandoScreen />
  ) : (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tab Navigation */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Course Screens */}
      <Stack.Screen name="curso/[cursoId]" options={{ headerShown: false }} />
      <Stack.Screen name="curso/[cursoId]/inscripcion" options={{ headerShown: false }} />
      <Stack.Screen name="curso/[cursoId]/contenido" options={{ headerShown: false }} />
      <Stack.Screen name="curso/[cursoId]/[moduloId]" options={{ headerShown: false }} />

      {/* Recipe Screens */}
      <Stack.Screen name="receta/[recetaId]" options={{ headerShown: false }} />
      <Stack.Screen name="receta/[recetaId]/pasos" options={{ headerShown: false }} />
      <Stack.Screen name="receta/[recetaId]/puntuacion" options={{ headerShown: false }} />

      {/* Error Screen */}
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />

      {/* Auth Screens */}
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
    </Stack>
  )
}
