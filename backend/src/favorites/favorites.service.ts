import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { getColorFamily } from '../shared/color-utils';

const withFamily = (item: Favorite) => ({ ...item, colorFamily: getColorFamily(item.hex) });

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) { }

  async create(createFavoriteDto: CreateFavoriteDto, userId?: string) {
    const favorite = this.favoritesRepository.create({
      ...createFavoriteDto,
      userId, // Associate with user if authenticated
    });
    const saved = await this.favoritesRepository.save(favorite);
    return withFamily(saved);
  }

  async findAll(userId?: string) {
    // If userId provided, filter by user; otherwise return all (for offline mode)
    const where = userId ? { userId } : {};
    const results = await this.favoritesRepository.find({
      where,
      order: { createdAt: 'DESC' }
    });
    return results.map(withFamily);
  }

  async findOne(id: number, userId?: string) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    const result = await this.favoritesRepository.findOneBy(where);
    return result ? withFamily(result) : null;
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto, userId?: string) {
    // Only update if belongs to user (when authenticated)
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    return this.favoritesRepository.update(where, updateFavoriteDto);
  }

  remove(id: number, userId?: string) {
    // Only delete if belongs to user (when authenticated)
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    return this.favoritesRepository.delete(where);
  }
}
