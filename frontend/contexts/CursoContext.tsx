import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { authService } from '@/services/auth';
import { Curso } from '@/utils/types';
import { useLocalSearchParams } from 'expo-router';

// Types
interface CursoContextType {
  course: Curso | null;
  user: any;
  isSubscribed: boolean;
  isCreator: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CursoContext = createContext<CursoContextType | undefined>(undefined);

export const useCurso = () => {
  const ctx = useContext(CursoContext);
  if (!ctx) throw new Error('useCurso must be used within CursoProvider');
  return ctx;
};

export const CursoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cursoId } = useLocalSearchParams();
  const [course, setCourse] = useState<Curso | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await authService.getUser();
      setUser(userData);

      let courseData: Curso | null = null;
      if (cursoId && typeof cursoId === 'string') {
        const courseResponse = await api('/courses/:id', 'GET', { params: { id: cursoId } });
        courseData = await courseResponse.json();
        setCourse(courseData);
      }

      // Check subscription
      let subscribed = false;
      let creator = false;
      if (userData && courseData) {
        try {
          const enrolledResponse = await api('/courses/user/subscribed', 'GET');
          const enrolledCourses = await enrolledResponse.json();
          subscribed = enrolledCourses.some((c: any) => c.idCurso === courseData!.idCurso);
        } catch {}
        creator =
          userData.id === courseData.autor?.idUsuario ||
          userData.email === courseData.autor?.mail;
      }
      setIsSubscribed(subscribed);
      setIsCreator(creator);
    } catch (e) {
      setCourse(null);
      setIsSubscribed(false);
      setIsCreator(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursoId]);

  return (
    <CursoContext.Provider
      value={{
        course,
        user,
        isSubscribed,
        isCreator,
        loading,
        refetch: fetchData,
      }}
    >
      {children}
    </CursoContext.Provider>
  );
}; 