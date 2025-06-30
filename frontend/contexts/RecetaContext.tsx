import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Receta } from '@/utils/types'
import { api } from '@/services/api'

interface RecetaContextType {
  receta: Receta | null
  setReceta: (receta: Receta | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  servings: number | null
  setServings: (servings: number | null) => void
  isFavorite: boolean | null
  setIsFavorite: (isFavorite: boolean) => void
  toggleFavorite: () => Promise<void>
  checkFavoriteStatus: (recipeId: string) => Promise<void>
}

const RecetaContext = createContext<RecetaContextType | undefined>(undefined)

export function RecetaProvider({ children }: { children: ReactNode }) {
  const [receta, setReceta] = useState<Receta | null>(null)
  const [loading, setLoading] = useState(true)
  const [servings, setServings] = useState<number | null>(null)
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)

  const checkFavoriteStatus = async (recipeId: string) => {
    try {
      const response = await api('/recipes/:id/favorites/check', 'GET', { params: { id: recipeId } })
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!receta) return

    try {
      const recipeId = receta.idReceta.toString()
      
      if (isFavorite) {
        // Remove from favorites
        const response = await api('/recipes/:id/favorites', 'DELETE', { params: { id: recipeId } })

        if (response.ok) {
          setIsFavorite(false)
        }
      } else {
        // Add to favorites
        const response = await api('/recipes/:id/favorites', 'POST', { params: { id: recipeId } })

        if (response.ok) {

          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <RecetaContext.Provider
      value={{
        receta,
        setReceta,
        loading,
        setLoading,
        servings,
        setServings,
        isFavorite,
        setIsFavorite,
        toggleFavorite,
        checkFavoriteStatus
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