import { Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { CourseCreateInput } from '../types';

const prisma = new PrismaClient();

interface CourseQuery {
  limit?: string;
  offset?: string;
}

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', offset = '0' }: CourseQuery = req.query;

    const cursos = await prisma.curso.findMany({
      take: Number(limit),
      skip: Number(offset),
      include: {
        cursoExtra: true,
        cronogramas: {
          include: {
            asistencias: {
              include: {
                alumno: true
              },
              distinct: ['idAlumno']
            }
          }
        }
      }
    });

    res.json(cursos.map(courseParse));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
};

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id)

    const data = await prisma.curso.findUnique({
        where: { idCurso: id },
        include: {
          cursoExtra: true,
          modulos: true,
          cronogramas: {
            include: {
              asistencias: {
                include: {
                  alumno: true
                },
                distinct: ['idAlumno']
              }
            }
          }
        }
      })

    if (!data) {
      res.status(404).json({ error: 'Curso no encontrado' })
      return
    }

    res.json(courseParse(data))
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener curso' })
  }
}

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const courseData: CourseCreateInput = req.body;

    const curso = await prisma.curso.create({
      data: {
        descripcion: courseData.descripcion,
        contenidos: courseData.contenidos,
        requerimientos: courseData.requerimientos,
        duracion: courseData.duracion,
        precio: courseData.precio,
        modalidad: courseData.modalidad,
        cursoExtra: {
          create: {
            titulo: courseData.titulo,
            imagen: courseData.imagen,
            dificultad: courseData.dificultad
          }
        },
        modulos: courseData.modulos
          ? {
              createMany: {
                data: courseData.modulos
              }
            }
          : undefined
      }
    })

    res.status(201).json({
      idCurso: curso.idCurso,
      descripcion: curso.descripcion,
      status: 'active',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear curso' });
  }
};

export const registerForCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const id = Number(req.params.id);

    // Check if course exists
    const course = await prisma.curso.findUnique({
      where: { idCurso: id },
    });

    if (!course) {
      res.status(404).json({ error: 'Curso no encontrado' });
      return;
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.asistenciaCurso.findFirst({
      where: {
        idAlumno: req.user.idUsuario,
        idCronograma: id,
      },
    });

    if (existingEnrollment) {
      res.status(400).json({ error: 'Ya está inscrito en este curso' });
      return;
    }

    // Create enrollment
    const enrollment = await prisma.asistenciaCurso.create({
      data: {
        idAlumno: req.user.idUsuario,
        idCronograma: id,
      },
    });

    res.json({
      status: 'success',
      course_id: enrollment.idCronograma,
      user_id: enrollment.idAlumno,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrarse para el curso' });
  }
};

export const unregisterFromCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const id = Number(req.params.id);

    // Check if enrolled
    const enrollment = await prisma.asistenciaCurso.findFirst({
      where: {
        idAlumno: req.user.idUsuario,
        idCronograma: id,
      },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'No está inscrito en este curso' });
      return;
    }

    // Delete enrollment
    await prisma.asistenciaCurso.delete({
      where: {
        idAsistencia: enrollment.idAsistencia,
      },
    });

    res.json({ message: 'Se ha desregistrado correctamente del curso' });
  } catch (error) {
    res.status(500).json({ error: 'Error al desregistrarse del curso' });
  }
}; 

const courseParse = (
  course: Partial<
    Prisma.CursoGetPayload<{
      include: {
        cursoExtra: true,
        modulos: true,
        cronogramas: {
          include: {
            asistencias: {
              include: {
                alumno: true
              },
              distinct: ['idAlumno']
            }
          }
        }
      }
    }>
  >
) => {
  if (!course) return null;

  const alumnos = course.cronogramas?.length ?? 0
  const calificacion = 5

  return {
    idCurso: course.idCurso,
    descripcion: course.descripcion,
    contenidos: course.contenidos,
    requerimientos: course.requerimientos,
    duracion: course.duracion,
    precio: course.precio,
    modalidad: course.modalidad,
    titulo: course.cursoExtra?.titulo || null,
    dificultad: course.cursoExtra?.dificultad || null,
    imagen: course.cursoExtra?.imagen || null,
    modulos: course.modulos || null,
    alumnos,
    calificacion
  }
}