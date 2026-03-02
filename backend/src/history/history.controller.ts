import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createHistoryDto: CreateHistoryDto, @Request() req) {
        return this.historyService.create(createHistoryDto, req.user?.userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Request() req) {
        return this.historyService.findAll(req.user?.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Request() req) {
        return this.historyService.remove(+id, req.user?.userId);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    clear(@Request() req) {
        return this.historyService.clear(req.user?.userId);
    }
}
