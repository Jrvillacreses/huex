import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post()
    create(@Body() createHistoryDto: CreateHistoryDto) {
        return this.historyService.create(createHistoryDto);
    }

    @Get()
    findAll() {
        return this.historyService.findAll();
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.historyService.remove(+id);
    }

    @Delete()
    clear() {
        return this.historyService.clear();
    }
}
