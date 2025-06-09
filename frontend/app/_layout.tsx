import { Stack } from 'expo-router';

export default function Layout() {
  return (
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
    </Stack>
  );
}
