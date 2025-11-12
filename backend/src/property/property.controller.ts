import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PropertyService } from './property.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { QueryPropertyDto } from './dto/query-property.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { UserRole } from '@prisma/client';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property (Agent only)' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Agents only' })
  create(@Body() createPropertyDto: CreatePropertyDto, @GetUser() user: any) {
    return this.propertyService.create(createPropertyDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all approved properties (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of approved properties',
  })
  findAll(@Query() query: QueryPropertyDto) {
    return this.propertyService.findAll(query);
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my properties (Agent only)' })
  @ApiResponse({ status: 200, description: 'Returns agent properties' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyProperties(@GetUser() user: any, @Query() query: QueryPropertyDto) {
    return this.propertyService.findMyProperties(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single approved property (Public)' })
  @ApiResponse({ status: 200, description: 'Returns property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a property (Agent only - own properties)' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only update own properties',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @GetUser() user: any,
  ) {
    return this.propertyService.update(id, updatePropertyDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a property (Agent only - own properties)' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only delete own properties',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.propertyService.remove(id, user.id);
  }
}
