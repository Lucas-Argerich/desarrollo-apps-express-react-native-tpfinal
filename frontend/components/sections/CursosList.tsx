import { View, FlatList, ViewProps } from 'react-native'
import CourseCard from '../CourseCard'
import { Curso } from '@/utils/types'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import SectionHeader from '../ui/SectionHeader'

interface CursosListProps extends ViewProps {
  title?: string
}

export default function CursosList({ title, style, ...props }: CursosListProps) {
  const [courses, setCourses] = useState<Curso[]>([])

  useEffect(() => {
    api('/courses', 'GET', {})
      .then(async (res) => {
        const data = await res.json()
        setCourses(data)
      })
      .catch((err) => {
        setCourses([]) // fallback to empty
      })
  }, [])

  return (
    <View style={style} {...props}>
      <SectionHeader title={title ?? 'Cursos Destacados'} />
      <FlatList
        data={courses}
        keyExtractor={(item) => item.idCurso.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
        renderItem={({ item }) => <CourseCard item={item} />}
      />
    </View>
  )
}
