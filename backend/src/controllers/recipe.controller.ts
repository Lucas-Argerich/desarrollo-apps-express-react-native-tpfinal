import { Response } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import { AuthRequest } from '../types'
import { RecipeCreateInput, ReviewCreateInput } from '../types'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

interface RecipeQuery {
  limit?: string
  offset?: string
  sort?: 'saves' | 'latest'
}

export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', offset = '0', sort = 'saves' }: RecipeQuery = req.query

    let recipes

    if (sort === 'saves') {
      // Order by number of favorites (favoritos) descending
      recipes = await prisma.receta.findMany({
        take: Number(limit),
        skip: Number(offset),
        include: {
          utilizados: {
            include: {
              ingrediente: true,
              utencilio: true,
              unidad: true
            }
          },
          tipo: true,
          pasos: true,
          calificaciones: {
            include: {
              usuario: true
            }
          },
          usuario: true,
          alumnosFavorito: true
        },
        orderBy: [{ alumnosFavorito: { _count: 'desc' } }, { idReceta: 'desc' }]
      })
    } else {
      // Default: latest
      recipes = await prisma.receta.findMany({
        take: Number(limit),
        skip: Number(offset),
        include: {
          utilizados: {
            include: {
              ingrediente: true,
              utencilio: true,
              unidad: true
            }
          },
          tipo: true,
          pasos: true,
          calificaciones: {
            include: {
              usuario: true
            }
          },
          usuario: true
        },
        orderBy: { idReceta: 'desc' }
      })
    }

    res.json(recipes.map(recipeParse))
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las recetas' })
  }
}

export const getRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id)

    const recipe = await prisma.receta.findUnique({
      where: { idReceta: id },
      include: {
        utilizados: {
          include: {
            ingrediente: true,
            utencilio: true,
            unidad: true
          }
        },
        tipo: true,
        pasos: true,
        calificaciones: {
          include: { usuario: true }
        },
        usuario: true
      }
    })

    if (!recipe) {
      res.status(404).json({ error: 'Receta no encontrada' })
      return
    }

    res.json(recipeParse(recipe))
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la receta' })
  }
}

export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const recipeData: RecipeCreateInput = req.body

    let fotoPrincipalUrl = recipeData.fotoPrincipal;
    let file = undefined;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imgField = files['fotoPrincipal'];
      if (imgField) {
        file = Array.isArray(imgField) ? imgField[0] : imgField;
      }
    }
    if (file) {
      const ext = file.originalname.split('.').pop();
      const fileName = `recetas/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('uploads').upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });
      if (error) {
        res.status(500).json({ error: 'Error al subir imagen' });
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(data.path);
      fotoPrincipalUrl = publicUrlData.publicUrl;
    }

    const receta = await prisma.receta.create({
      data: {
        nombreReceta: recipeData.nombreReceta,
        descripcionReceta: recipeData.descripcionReceta,
        porciones: recipeData.porciones ?? 1,
        cantidadPersonas: recipeData.cantidadPersonas ?? 1,
        fotoPrincipal: fotoPrincipalUrl,
        utilizados: {
          create: [
            ...recipeData.ingredientes.filter((f) => f.nombre !== undefined).map((ing) => ({
              cantidad: ing.cantidad ?? 1,
              ingrediente: {
                connectOrCreate: {
                  where: {
                    nombre: ing.nombre!
                  },
                  create: {
                    nombre: ing.nombre!
                  }
                }
              }
            })),
            ...recipeData.utencilios.filter((f) => f.nombre !== undefined).map((ut) => ({
              cantidad: ut.cantidad ?? 1,
              utencilio: {
                connectOrCreate: {
                  where: {
                    nombre: ut.nombre!
                  },
                  create: {
                    nombre: ut.nombre!,
                    descripcion: ut.descripcion
                  }
                }
              }
            }))
          ]
        },
        pasos: {
          create: recipeData.pasos.map((step) => ({
            texto: step.texto,
            nroPaso: step.nroPaso
          }))
        },
        idUsuario: req.user.idUsuario
      }
    })

    res.status(201).json({
      idReceta: receta.idReceta,
      nombreReceta: receta.nombreReceta,
      status: 'active'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear la receta' })
  }
}

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const id = Number(req.params.id)
    const reviewData: ReviewCreateInput = req.body

    if (!reviewData.calificacion || reviewData.calificacion < 1 || reviewData.calificacion > 5) {
      res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' })
      return
    }

    const recipe = await prisma.receta.findUnique({
      where: { idReceta: id }
    })

    if (!recipe) {
      res.status(404).json({ error: 'Receta no encontrada' })
      return
    }

    const review = await prisma.calificacion.create({
      data: {
        calificacion: reviewData.calificacion,
        comentarios: reviewData.comentarios,
        idUsuario: req.user.idUsuario,
        idReceta: id
      }
    })

    // Update recipe average rating (if you want to store it, add a field in Receta)
    // const reviews = await prisma.calificacion.findMany({ where: { idReceta: id } });
    // const averageRating = reviews.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) / reviews.length;
    // await prisma.receta.update({ where: { idReceta: id }, data: { averageRating } });

    res.status(201).json(review)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al agregar la reseña' })
  }
}

export const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const recipeId = Number(req.params.id)

    // Check if recipe exists
    const recipe = await prisma.receta.findUnique({
      where: { idReceta: recipeId }
    })

    if (!recipe) {
      res.status(404).json({ error: 'Receta no encontrada' })
      return
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorito.findFirst({
      where: {
        idAlumno: req.user.idUsuario,
        idReceta: recipeId
      }
    })

    if (existingFavorite) {
      res.status(400).json({ error: 'La receta ya está en favoritos' })
      return
    }

    // Add to favorites
    const favorite = await prisma.favorito.create({
      data: {
        idAlumno: req.user.idUsuario,
        idReceta: recipeId
      }
    })

    res.status(201).json({
      message: 'Receta agregada a favoritos',
      idFavorito: favorite.idFavorito
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al agregar a favoritos' })
  }
}

export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const recipeId = Number(req.params.id)

    // Find and delete the favorite
    const favorite = await prisma.favorito.findFirst({
      where: {
        idAlumno: req.user.idUsuario,
        idReceta: recipeId
      }
    })

    if (!favorite) {
      res.status(404).json({ error: 'La receta no está en favoritos' })
      return
    }

    await prisma.favorito.delete({
      where: { idFavorito: favorite.idFavorito }
    })

    res.json({ message: 'Receta removida de favoritos' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al remover de favoritos' })
  }
}

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    // Get user's favorite recipes
    const favorites = await prisma.favorito.findMany({
      where: { idAlumno: req.user.idUsuario },
      include: {
        receta: {
          include: {
            utilizados: {
              include: {
                ingrediente: true,
                utencilio: true,
                unidad: true
              }
            },
            tipo: true,
            pasos: true,
            calificaciones: {
              include: { usuario: true }
            },
            usuario: true
          }
        }
      }
    })

    const favoriteRecipes = favorites.map((fav) => recipeParse(fav.receta))

    res.json(favoriteRecipes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener favoritos' })
  }
}

export const checkFavorite = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const recipeId = Number(req.params.id)

    // Check if recipe is in favorites
    const favorite = await prisma.favorito.findFirst({
      where: {
        idAlumno: req.user.idUsuario,
        idReceta: recipeId
      }
    })

    res.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al verificar favorito' })
  }
}

export const getCreatedRecipes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }
    const { limit = '10', offset = '0' }: RecipeQuery = req.query
    const recipes = await prisma.receta.findMany({
      where: { idUsuario: req.user.idUsuario },
      take: Number(limit),
      skip: Number(offset),
      include: {
        utilizados: {
          include: {
            ingrediente: true,
            utencilio: true,
            unidad: true
          }
        },
        tipo: true,
        pasos: true,
        calificaciones: {
          include: { usuario: true }
        },
        usuario: true
      },
      orderBy: { idReceta: 'desc' }
    })
    res.json(recipes.map(recipeParse))
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recetas creadas' })
  }
}

export const updateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const recipeId = Number(req.params.id)
    const recipeData: RecipeCreateInput = req.body

    // Check if recipe exists and user owns it
    const existingRecipe = await prisma.receta.findUnique({
      where: { idReceta: recipeId },
      include: { usuario: true }
    })

    if (!existingRecipe) {
      res.status(404).json({ error: 'Receta no encontrada' })
      return
    }

    if (existingRecipe.idUsuario !== req.user.idUsuario) {
      res.status(403).json({ error: 'No tienes permisos para editar esta receta' })
      return
    }

    let fotoPrincipalUrl = recipeData.fotoPrincipal;
    let file = undefined;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imgField = files['fotoPrincipal'];
      if (imgField) {
        file = Array.isArray(imgField) ? imgField[0] : imgField;
      }
    }
    if (file) {
      const ext = file.originalname.split('.').pop();
      const fileName = `recetas/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('uploads').upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });
      if (error) {
        res.status(500).json({ error: 'Error al subir imagen' });
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(data.path);
      fotoPrincipalUrl = publicUrlData.publicUrl;
    }

    // Delete existing related data
    await prisma.utilizado.deleteMany({
      where: { idReceta: recipeId }
    })
    await prisma.paso.deleteMany({
      where: { idReceta: recipeId }
    })

    // Update recipe with new data
    const receta = await prisma.receta.update({
      where: { idReceta: recipeId },
      data: {
        nombreReceta: recipeData.nombreReceta,
        descripcionReceta: recipeData.descripcionReceta,
        porciones: recipeData.porciones ?? 1,
        cantidadPersonas: recipeData.cantidadPersonas ?? 1,
        fotoPrincipal: fotoPrincipalUrl,
        utilizados: {
          create: [
            ...recipeData.ingredientes.filter((f) => f.nombre !== undefined).map((ing) => ({
              cantidad: ing.cantidad ?? 1,
              unidad: {
                connectOrCreate: {
                  where: {
                    descripcion: ing.unidad || 'unidad'
                  },
                  create: {
                    descripcion: ing.unidad || 'unidad'
                  }
                }
              },
              ingrediente: {
                connectOrCreate: {
                  where: {
                    nombre: ing.nombre!
                  },
                  create: {
                    nombre: ing.nombre!
                  }
                }
              }
            })),
            ...recipeData.utencilios.filter((f) => f.nombre !== undefined).map((ut) => ({
              cantidad: ut.cantidad ?? 1,
              unidad: {
                connectOrCreate: {
                  where: {
                    descripcion: ut.descripcion || 'unidad'
                  },
                  create: {
                    descripcion: ut.descripcion || 'unidad'
                  }
                }
              },
              utencilio: {
                connectOrCreate: {
                  where: {
                    nombre: ut.nombre!
                  },
                  create: {
                    nombre: ut.nombre!,
                    descripcion: ut.descripcion
                  }
                }
              }
            }))
          ]
        },
        pasos: {
          create: recipeData.pasos.map((step) => ({
            texto: step.texto,
            nroPaso: step.nroPaso
          }))
        }
      },
      include: {
        utilizados: {
          include: {
            ingrediente: true,
            utencilio: true,
            unidad: true
          }
        },
        tipo: true,
        pasos: true,
        calificaciones: {
          include: { usuario: true }
        },
        usuario: true
      }
    })

    res.json(recipeParse(receta))
  } catch (error) {
    console.error('Error updating recipe:', error)
    res.status(500).json({ error: 'Error al actualizar la receta' })
  }
}

export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const recipeId = Number(req.params.id)

    // Check if recipe exists and user owns it
    const existingRecipe = await prisma.receta.findUnique({
      where: { idReceta: recipeId },
      include: { usuario: true }
    })

    if (!existingRecipe) {
      res.status(404).json({ error: 'Receta no encontrada' })
      return
    }

    if (existingRecipe.idUsuario !== req.user.idUsuario) {
      res.status(403).json({ error: 'No tienes permisos para eliminar esta receta' })
      return
    }

    // Delete all related data in the correct order
    await prisma.favorito.deleteMany({
      where: { idReceta: recipeId }
    })

    await prisma.calificacion.deleteMany({
      where: { idReceta: recipeId }
    })

    await prisma.utilizado.deleteMany({
      where: { idReceta: recipeId }
    })

    await prisma.paso.deleteMany({
      where: { idReceta: recipeId }
    })

    // Finally delete the recipe
    await prisma.receta.delete({
      where: { idReceta: recipeId }
    })

    res.json({ message: 'Receta eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    res.status(500).json({ error: 'Error al eliminar la receta' })
  }
}

export function recipeParse(
  recipe: Partial<
    Prisma.RecetaGetPayload<{
      include: {
        utilizados: {
          include: {
            ingrediente: true
            utencilio: true
            unidad: true
          }
        }
        tipo: true
        pasos: true
        calificaciones: {
          include: {
            usuario: true
          }
        }
        usuario: true
      }
    }>
  >
) {
  return {
    idReceta: recipe.idReceta,
    nombreReceta: recipe.nombreReceta,
    descripcionReceta: recipe.descripcionReceta,
    fotoPrincipal: recipe.fotoPrincipal,
    porciones: recipe.porciones,
    cantidadPersonas: recipe.cantidadPersonas,
    idTipo: recipe.idTipo,
    ingredientes:
      recipe.utilizados
        ?.filter((u) => u.ingrediente)
        .map((u) => ({
          idUtilizado: u.idUtilizado,
          nombre: u.ingrediente?.nombre,
          cantidad: u.cantidad ?? 1,
          unidad: u.unidad?.descripcion ?? ((u.cantidad ?? 1) >= 100 ? 'g' : 'u'),
          observaciones: u.observaciones
        })) || [],
    utencilios:
      recipe.utilizados
        ?.filter((u) => u.utencilio)
        .map((u) => ({
          idUtilizado: u.idUtilizado,
          nombre: u.utencilio?.nombre,
          cantidad: u.cantidad,
          unidad: u.unidad?.descripcion,
          observaciones: u.observaciones
        })) || [],
    pasos: recipe.pasos,
    calificaciones:
      recipe.calificaciones?.map((c) => ({
        calificacion: c.calificacion,
        comentario: c.comentarios,
        usuario: c.usuario
          ? {
              idUsuario: c.usuario.idUsuario,
              nombre: c.usuario.nombre,
              nickname: c.usuario.nickname
            }
          : null
      })) || [],
    calificacion: recipe.calificaciones
      ? recipe.calificaciones?.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) /
        (recipe.calificaciones?.length || 1)
      : 0,
    usuario: recipe.usuario
  }
}
