import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tab Navigation */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Course Screens */}
      <Stack.Screen name="curso" options={{ headerShown: false }} />
      <Stack.Screen name="curso-inscripcion" options={{ headerShown: false }} />
      <Stack.Screen name="curso-contenido" options={{ headerShown: false }} />
      <Stack.Screen name="curso-modulo" options={{ headerShown: false }} />

      {/* Recipe Screens */}
      <Stack.Screen name="receta" options={{ headerShown: false }} />
      <Stack.Screen name="receta-pasos" options={{ headerShown: false }} />
      <Stack.Screen name="receta-puntuacion" options={{ headerShown: false }} />

      {/* Error Screen */}
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
