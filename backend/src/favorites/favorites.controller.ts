import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req) {
    return this.favoritesService.create(createFavoriteDto, req.user?.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user?.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.favoritesService.findOne(+id, req.user?.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto, @Request() req) {
    return this.favoritesService.update(+id, updateFavoriteDto, req.user?.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.favoritesService.remove(+id, req.user?.userId);
  }
}
