import { Response } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import { AuthRequest } from '../types'
import { CourseCreateInput } from '../types'
import { createClient } from '@supabase/supabase-js'
import { connect } from 'http2'
const prisma = new PrismaClient()

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

interface CourseQuery {
  limit?: string
  offset?: string
}

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', offset = '0' }: CourseQuery = req.query

    const cursos = await prisma.curso.findMany({
      take: Number(limit),
      skip: Number(offset),
      include: {
        cursoExtra: {
          include: {
            utilizados: {
              include: {
                ingrediente: true,
                utencilio: true,
                unidad: true
              }
            }
          }
        },
        cronogramas: {
          include: {
            sede: true,
            asistencias: {
              include: {
                alumno: true
              },
              distinct: ['idAlumno']
            }
          }
        },
        usuario: {
          select: {
            idUsuario: true,
            nombre: true,
            nickname: true,
            mail: true
          }
        }
      }
    })

    res.json(cursos.map(courseParse))
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' })
  }
}

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id)

    const data = await prisma.curso.findUnique({
      where: { idCurso: id },
      include: {
        cursoExtra: {
          include: {
            utilizados: {
              include: {
                ingrediente: true,
                utencilio: true,
                unidad: true
              }
            }
          }
        },
        modulos: true,
        cronogramas: {
          include: {
            sede: true,
            asistencias: {
              include: {
                alumno: true
              },
              distinct: ['idAlumno']
            }
          }
        },
        usuario: {
          select: {
            idUsuario: true,
            nombre: true,
            nickname: true,
            mail: true
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
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const courseData: CourseCreateInput = req.body
    let imagenUrl = (courseData as any).imagen
    let file = undefined
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }

      const imgField = files['imagen']
      if (imgField) {
        file = Array.isArray(imgField) ? imgField[0] : imgField
      }
    }
    if (file) {
      const ext = file.originalname.split('.').pop()
      const fileName = `cursos/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('uploads').upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      })
      if (error) {
        res.status(500).json({ error: 'Error al subir imagen' })
        return
      }
      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(data.path)
      imagenUrl = publicUrlData.publicUrl
    }

    const curso = await prisma.curso.create({
      data: {
        idUsuario: req.user.idUsuario,
        descripcion: courseData.descripcion,
        contenidos: courseData.contenidos,
        requerimientos: courseData.requerimientos,
        duracion: courseData.duracion,
        precio: courseData.precio,
        modalidad: courseData.modalidad,
        cursoExtra: {
          create: {
            titulo: courseData.titulo,
            imagen: imagenUrl,
            dificultad: courseData.dificultad,
            utilizados: {
              create: [
                ...(courseData.ingredientes ?? [])
                  .filter((f: { nombre?: string }) => f.nombre !== undefined)
                  .map((ing: { nombre?: string; cantidad?: number }) => ({
                    cantidad: ing.cantidad ?? 1,
                    ingrediente: {
                      connectOrCreate: {
                        where: { nombre: ing.nombre! },
                        create: { nombre: ing.nombre! }
                      }
                    }
                  })),
                ...(courseData.utencilios ?? [])
                  .filter((f: { nombre?: string }) => f.nombre !== undefined)
                  .map((ut: { nombre?: string; cantidad?: number; descripcion?: string }) => ({
                    cantidad: ut.cantidad ?? 1,
                    utencilio: {
                      connectOrCreate: {
                        where: { nombre: ut.nombre! },
                        create: { nombre: ut.nombre!, descripcion: ut.descripcion }
                      }
                    }
                  }))
              ]
            }
          }
        },
        modulos: courseData.modulos
          ? {
              createMany: {
                data: courseData.modulos
              }
            }
          : undefined,
        cronogramas: courseData.cronogramas
          ? {
              create: courseData.cronogramas.map((cronograma) => ({
                idSede: cronograma.idSede,
                fechaInicio: cronograma.fechaInicio ? new Date(cronograma.fechaInicio) : null,
                fechaFin: cronograma.fechaFin ? new Date(cronograma.fechaFin) : null,
                vacantesDisponibles: cronograma.vacantesDisponibles
              }))
            }
          : undefined
      }
    })

    res.status(201).json({
      idCurso: curso.idCurso,
      descripcion: curso.descripcion,
      status: 'active'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear curso' })
  }
}

export const registerForCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const id = Number(req.params.id)

    // Check if course exists
    const course = await prisma.curso.findUnique({
      where: { idCurso: id }
    })

    if (!course) {
      res.status(404).json({ error: 'Curso no encontrado' })
      return
    }

    if (!req.body.idCronograma) {
      res.status(400).json({ error: 'Cronograma no especificado' })
      return
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.asistenciaCurso.findFirst({
      where: {
        idAlumno: req.user.idUsuario,
        idCronograma: req.body.idCronograma
      }
    })

    if (existingEnrollment) {
      res.status(400).json({ error: 'Ya está inscrito en este curso' })
      return
    }

    // Create enrollment
    const enrollment = await prisma.asistenciaCurso.create({
      data: {
        idAlumno: req.user.idUsuario,
        idCronograma: req.body.idCronograma
      }
    })

    res.json({
      status: 'success',
      course_id: enrollment.idCronograma,
      user_id: enrollment.idAlumno
    })
  } catch (error) {
    console.error('Error registering for course:', error)
    res.status(500).json({ error: 'Error al registrarse para el curso' })
  }
}

export const unregisterFromCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const id = Number(req.params.id)

    // Check if enrolled
    const enrollment = await prisma.asistenciaCurso.findFirst({
      where: {
        idAlumno: req.user.idUsuario,
        cronograma: {
          idCurso: id
        }
      }
    })

    if (!enrollment) {
      res.status(404).json({ error: 'No está inscrito en este curso' })
      return
    }

    // Delete enrollment
    await prisma.asistenciaCurso.delete({
      where: {
        idAsistencia: enrollment.idAsistencia
      }
    })

    res.json({ message: 'Se ha desregistrado correctamente del curso' })
  } catch (error) {
    res.status(500).json({ error: 'Error al desregistrarse del curso' })
  }
}

export const getSubscribedCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    // Find all AsistenciaCurso for this user
    const asistencias = await prisma.asistenciaCurso.findMany({
      where: { idAlumno: req.user.idUsuario },
      select: { cronograma: { select: { idCurso: true } } }
    })
    const courseIds = asistencias.map((a) => a.cronograma.idCurso)

    // Get all courses for these IDs
    const cursos = await prisma.curso.findMany({
      where: { idCurso: { in: courseIds } },
      include: {
        cursoExtra: {
          include: {
            utilizados: {
              include: {
                ingrediente: true,
                utencilio: true,
                unidad: true
              }
            }
          }
        },
        cronogramas: {
          include: {
            sede: true,
            asistencias: {
              include: { alumno: true },
              distinct: ['idAlumno']
            }
          }
        },
        usuario: {
          select: {
            idUsuario: true,
            nombre: true,
            nickname: true,
            mail: true
          }
        }
      }
    })

    res.json(cursos.map(courseParse))
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos inscritos' })
  }
}

export const getCreatedCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }
    const { limit = '10', offset = '0' }: CourseQuery = req.query
    const cursos = await prisma.curso.findMany({
      where: { idUsuario: req.user.idUsuario },
      take: Number(limit),
      skip: Number(offset),
      include: {
        cursoExtra: {
          include: {
            utilizados: {
              include: {
                ingrediente: true,
                utencilio: true,
                unidad: true
              }
            }
          }
        },
        cronogramas: {
          include: {
            sede: true,
            asistencias: {
              include: { alumno: true },
              distinct: ['idAlumno']
            }
          }
        }
      }
    })
    res.json(cursos.map(courseParse))
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos creados' })
  }
}

export const courseParse = (
  course: Partial<
    Prisma.CursoGetPayload<{
      include: {
        cursoExtra: {
          include: {
            utilizados: {
              include: {
                ingrediente: true
                utencilio: true
                unidad: true
              }
            }
          }
        }
        modulos: true
        cronogramas: {
          include: {
            sede: true
            asistencias: {
              include: {
                alumno: {
                  select: {
                    idAlumno: true
                    nombre: true
                    nickname: true
                    mail: true
                  }
                }
              }
              distinct: ['idAlumno']
            }
          }
        }
        usuario: {
          select: {
            idUsuario: true
            nombre: true
            nickname: true
            mail: true
          }
        }
      }
    }>
  >
) => {
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
    ingredientes:
      course.cursoExtra?.utilizados
        ?.filter((u) => u.ingrediente)
        .map((u) => ({
          idUtilizado: u.idUtilizado,
          nombre: u.ingrediente?.nombre,
          cantidad: u.cantidad ?? 1,
          unidad: u.unidad?.descripcion ?? ((u.cantidad ?? 1) >= 100 ? 'g' : 'u'),
          observaciones: u.observaciones
        })) || [],
    utencilios:
      course.cursoExtra?.utilizados
        ?.filter((u) => u.utencilio)
        .map((u) => ({
          idUtilizado: u.idUtilizado,
          nombre: u.utencilio?.nombre,
          cantidad: u.cantidad,
          unidad: u.unidad?.descripcion,
          observaciones: u.observaciones
        })) || [],
    modulos: course.modulos || null,
    alumnos,
    calificacion,
    autor: course.usuario,
    cronogramas: course.cronogramas?.map((cronograma) => ({
      idCronograma: cronograma.idCronograma,
      idSede: cronograma.idSede,
      idCurso: cronograma.idCurso,
      fechaInicio: cronograma.fechaInicio?.toISOString() || null,
      fechaFin: cronograma.fechaFin?.toISOString() || null,
      vacantesDisponibles: cronograma.vacantesDisponibles,
      sede: cronograma.sede
        ? {
            idSede: cronograma.sede.idSede,
            nombreSede: cronograma.sede.nombreSede,
            direccionSede: cronograma.sede.direccionSede,
            telefonoSede: cronograma.sede.telefonoSede,
            mailSede: cronograma.sede.mailSede,
            whatsApp: cronograma.sede.whatsApp
          }
        : undefined
    }))
  }
}

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const courseId = Number(req.params.id)

    // Check if course exists and user owns it
    const existingCourse = await prisma.curso.findUnique({
      where: { idCurso: courseId },
      include: { usuario: true }
    })

    if (!existingCourse) {
      res.status(404).json({ error: 'Curso no encontrado' })
      return
    }

    if (existingCourse.idUsuario !== req.user.idUsuario) {
      res.status(403).json({ error: 'No tienes permisos para eliminar este curso' })
      return
    }

    // Delete all related data in the correct order
    await prisma.asistenciaCurso.deleteMany({
      where: { cronograma: { idCurso: courseId } }
    })

    await prisma.cronogramaCurso.deleteMany({
      where: { idCurso: courseId }
    })

    await prisma.modulo.deleteMany({
      where: { idCurso: courseId }
    })

    // Finally delete the course
    await prisma.curso.delete({
      where: { idCurso: courseId }
    })

    res.json({ message: 'Curso eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting course:', error)
    res.status(500).json({ error: 'Error al eliminar el curso' })
  }
}
