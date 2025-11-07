import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { QueryPropertyDto } from './dto/query-property.dto.js';
import { PropertyStatus } from '@prisma/client';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto, userId: string) {
    const property = await this.prisma.property.create({
      data: {
        ...createPropertyDto,
        postedById: userId,
        status: PropertyStatus.PENDING,
      },
      include: {
        postedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return property;
  }

  async findAll(query: QueryPropertyDto) {
    const {
      city,
      minPrice,
      maxPrice,
      minBeds,
      minBaths,
      page = 1,
      limit = 10,
    } = query;

    const where: any = {
      status: PropertyStatus.APPROVED,
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (minBeds !== undefined) {
      where.beds = { gte: minBeds };
    }

    if (minBaths !== undefined) {
      where.baths = { gte: minBaths };
    }

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          postedBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Only show approved properties to public
    if (property.status !== PropertyStatus.APPROVED) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async findMyProperties(userId: string, query: QueryPropertyDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: { postedById: userId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.property.count({ where: { postedById: userId } }),
    ]);

    return {
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
  ) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.postedById !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        ...updatePropertyDto,
        status: PropertyStatus.PENDING, // Reset to pending after update
      },
      include: {
        postedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedProperty;
  }

  async remove(id: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.postedById !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.prisma.property.delete({
      where: { id },
    });

    return { message: 'Property deleted successfully' };
  }
}
