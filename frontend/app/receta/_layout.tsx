import { Stack } from 'expo-router'
import { RecetaProvider } from '@/contexts/RecetaContext'

export default function RecetaLayout() {
  return (
    <RecetaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[recetaId]" options={{ headerShown: false }} />
        <Stack.Screen name="[recetaId]/pasos" options={{ headerShown: false }} />
        <Stack.Screen name="[recetaId]/puntuacion" options={{ headerShown: false }} />
      </Stack>
    </RecetaProvider>
  )
} 