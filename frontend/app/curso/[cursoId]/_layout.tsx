import React from 'react';
import { Stack } from 'expo-router';
import { CursoProvider } from '../../../contexts/CursoContext';

export default function CursoLayout() {
  return (
    <CursoProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="inscripcion" options={{ headerShown: false }} />
        <Stack.Screen name="contenido" options={{ headerShown: false }} />
        <Stack.Screen name="[moduloId]" options={{ headerShown: false }} />
      </Stack>
    </CursoProvider>
  );
} 