import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History)
        private historyRepository: Repository<History>,
    ) { }

    async create(createHistoryDto: CreateHistoryDto, userId?: string) {
        // 1. Save the new record
        const newRecord = this.historyRepository.create({
            ...createHistoryDto,
            userId, // Associate with user if authenticated
        });
        const saved = await this.historyRepository.save(newRecord);

        // 2. Check total count for this user (or all if no user)
        const where = userId ? { userId } : {};
        const count = await this.historyRepository.count({ where });

        // 3. If > 50, delete the oldest for this user
        if (count > 50) {
            const oldest = await this.historyRepository.find({
                where,
                order: { createdAt: 'ASC' },
                take: count - 50, // Delete excess
            });
            if (oldest.length > 0) {
                await this.historyRepository.remove(oldest);
            }
        }

        return saved;
    }

    findAll(userId?: string) {
        const where = userId ? { userId } : {};
        return this.historyRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

    async findLatest(userId?: string) {
        const where = userId ? { userId } : {};
        return this.historyRepository.find({
            where,
            order: { createdAt: 'DESC' },
            take: 10
        });
    }

    async remove(id: number, userId?: string) {
        const where: any = { id };
        if (userId) {
            where.userId = userId;
        }
        return this.historyRepository.delete(where);
    }

    async clear(userId?: string) {
        if (userId) {
            return this.historyRepository.delete({ userId });
        }
        return this.historyRepository.clear();
    }
}
