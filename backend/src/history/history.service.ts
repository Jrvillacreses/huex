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

    async create(createHistoryDto: CreateHistoryDto) {
        // 1. Save the new record
        const newRecord = this.historyRepository.create(createHistoryDto);
        const saved = await this.historyRepository.save(newRecord);

        // 2. Check total count
        const count = await this.historyRepository.count();

        // 3. If > 50, delete the oldest
        if (count > 50) {
            const oldest = await this.historyRepository.find({
                order: { createdAt: 'ASC' },
                take: count - 50, // Delete excess
            });
            if (oldest.length > 0) {
                await this.historyRepository.remove(oldest);
            }
        }

        return saved;
    }

    findAll() {
        return this.historyRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findLatest() {
        return this.historyRepository.find({
            order: { createdAt: 'DESC' },
            take: 10
        });
    }

    async remove(id: number) {
        return this.historyRepository.delete(id);
    }

    async clear() {
        return this.historyRepository.clear();
    }
}
