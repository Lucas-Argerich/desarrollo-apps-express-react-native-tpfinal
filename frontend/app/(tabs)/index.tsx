import CustomScreenView from '@/components/CustomScreenView'
import RecetasList from '@/components/sections/RecetasList'
import CursosList from '@/components/sections/CursosList'
import Header from '@/components/ui/Header'

export default function InicioScreen() {
  return (
    <CustomScreenView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <Header title='Bienvenido!' subtitle='Explorá platos y culturas' />

      {/* Recetas Section */}
      <RecetasList style={{ marginTop: 30 }} />
      
      {/* Cursos Destacados Section */}
      <CursosList style={{ marginTop: 30 }} />
    </CustomScreenView>
  )
}
