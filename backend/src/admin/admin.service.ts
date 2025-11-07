import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PropertyStatus } from '@prisma/client';
import { ApprovePropertyDto } from './dto/approve-property.dto.js';
import { RejectPropertyDto } from './dto/reject-property.dto.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPendingProperties(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: { status: PropertyStatus.PENDING },
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
          createdAt: 'asc', // Oldest first for review
        },
      }),
      this.prisma.property.count({ where: { status: PropertyStatus.PENDING } }),
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

  async getAllProperties(
    page: number = 1,
    limit: number = 10,
    status?: PropertyStatus,
  ) {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

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

  async getPropertyById(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
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

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async approveProperty(id: string, approveDto: ApprovePropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.APPROVED,
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

    return {
      message: 'Property approved successfully',
      property: updatedProperty,
      note: approveDto.note,
    };
  }

  async rejectProperty(id: string, rejectDto: RejectPropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        status: PropertyStatus.REJECTED,
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

    return {
      message: 'Property rejected',
      property: updatedProperty,
      reason: rejectDto.reason,
    };
  }

  async deleteProperty(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    await this.prisma.property.delete({
      where: { id },
    });

    return { message: 'Property deleted successfully by admin' };
  }

  async getStatistics() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: PropertyStatus.PENDING } }),
      this.prisma.property.count({
        where: { status: PropertyStatus.APPROVED },
      }),
      this.prisma.property.count({
        where: { status: PropertyStatus.REJECTED },
      }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }
}
