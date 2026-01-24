import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) { }

  create(createFavoriteDto: CreateFavoriteDto) {
    const favorite = this.favoritesRepository.create(createFavoriteDto);
    return this.favoritesRepository.save(favorite);
  }

  findAll() {
    return this.favoritesRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.favoritesRepository.findOneBy({ id });
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoritesRepository.update(id, updateFavoriteDto);
  }

  remove(id: number) {
    return this.favoritesRepository.delete(id);
  }
}
