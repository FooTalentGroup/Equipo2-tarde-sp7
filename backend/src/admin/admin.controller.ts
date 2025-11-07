import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import { ApprovePropertyDto } from './dto/approve-property.dto.js';
import { RejectPropertyDto } from './dto/reject-property.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole, PropertyStatus } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('properties/pending')
  @ApiOperation({ summary: 'Get all pending properties (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns pending properties' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getPendingProperties(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getPendingProperties(page, limit);
  }

  @Get('properties/all')
  @ApiOperation({
    summary: 'Get all properties regardless of status (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Returns all properties' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: PropertyStatus })
  getAllProperties(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: PropertyStatus,
  ) {
    return this.adminService.getAllProperties(page, limit, status);
  }

  @Get('properties/statistics')
  @ApiOperation({ summary: 'Get property statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns property statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getStatistics() {
    return this.adminService.getStatistics();
  }

  @Get('properties/:id')
  @ApiOperation({ summary: 'Get any property by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getPropertyById(@Param('id') id: string) {
    return this.adminService.getPropertyById(id);
  }

  @Post('properties/:id/approve')
  @ApiOperation({ summary: 'Approve a property (Admin only)' })
  @ApiResponse({ status: 200, description: 'Property approved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  approveProperty(
    @Param('id') id: string,
    @Body() approveDto: ApprovePropertyDto,
  ) {
    return this.adminService.approveProperty(id, approveDto);
  }

  @Post('properties/:id/reject')
  @ApiOperation({ summary: 'Reject a property (Admin only)' })
  @ApiResponse({ status: 200, description: 'Property rejected' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  rejectProperty(
    @Param('id') id: string,
    @Body() rejectDto: RejectPropertyDto,
  ) {
    return this.adminService.rejectProperty(id, rejectDto);
  }

  @Delete('properties/:id')
  @ApiOperation({ summary: 'Delete any property (Admin only)' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  deleteProperty(@Param('id') id: string) {
    return this.adminService.deleteProperty(id);
  }
}
