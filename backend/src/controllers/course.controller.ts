import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { CourseCreateInput, CourseResponse } from '../types';

const prisma = new PrismaClient();

interface CourseQuery {
  limit?: string;
  offset?: string;
}

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '10', offset = '0' }: CourseQuery = req.query;

    const courses = await prisma.course.findMany({
      take: Number(limit),
      skip: Number(offset),
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        modules: {
          orderBy: {
            order: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        modules: {
          orderBy: {
            order: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const courseData: CourseCreateInput = req.body;

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        type: courseData.type,
        category: courseData.category,
        difficulty: courseData.difficulty,
        price: courseData.price,
        createdById: req.user.id,
        modules: {
          create: courseData.modules.map((module, index) => ({
            title: module.title,
            content: module.content,
            order: index + 1,
          })),
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      id: course.id,
      title: course.title,
      status: 'active',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating course' });
  }
};

export const registerForCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { payment_method } = req.body;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: Number(id),
        },
      },
    });

    if (existingEnrollment) {
      res.status(400).json({ error: 'Already enrolled in this course' });
      return;
    }

    // Create enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: req.user.id,
        courseId: Number(id),
        paymentMethod: payment_method,
      },
    });

    res.json({
      status: 'success',
      course_id: enrollment.courseId,
      user_id: enrollment.userId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering for course' });
  }
};

export const unregisterFromCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    // Check if enrolled
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: Number(id),
        },
      },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'Not enrolled in this course' });
      return;
    }

    // Delete enrollment
    await prisma.courseEnrollment.delete({
      where: {
        id: enrollment.id,
      },
    });

    res.json({ message: 'Successfully unregistered from course' });
  } catch (error) {
    res.status(500).json({ error: 'Error unregistering from course' });
  }
}; 