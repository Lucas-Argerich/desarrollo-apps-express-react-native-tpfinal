import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Receta } from '@/utils/types'

interface RecetaContextType {
  receta: Receta | null
  setReceta: (receta: Receta | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  servings: number | null
  setServings: (servings: number | null) => void
}

const RecetaContext = createContext<RecetaContextType | undefined>(undefined)

export function RecetaProvider({ children }: { children: ReactNode }) {
  const [receta, setReceta] = useState<Receta | null>(null)
  const [loading, setLoading] = useState(true)
  const [servings, setServings] = useState<number | null>(null)

  return (
    <RecetaContext.Provider
      value={{
        receta,
        setReceta,
        loading,
        setLoading,
        servings,
        setServings
      }}
    >
      {children}
    </RecetaContext.Provider>
  )
}

export function useReceta() {
  const context = useContext(RecetaContext)
  if (context === undefined) {
    throw new Error('useReceta must be used within a RecetaProvider')
  }
  return context
} 