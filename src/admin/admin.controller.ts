import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/jwt.guard';
import { AdminService } from './admin.service';
import { EventDto } from './dtos/event.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @UseGuards(AuthGuard)
    @Get("/showallEvents")
    showallEvents(@Req() req, @Res() res,) {
        return this.adminService.showallEvents(req, res);
    }

    @UseGuards(AuthGuard)
    @Post("/createEvent")
    createEvent(@Body() data : EventDto, @Req() req, @Res() res)
    {
        return this.adminService.createEvent(data, req, res);
    }

    @UseGuards(AuthGuard)
    @Post("/editEvent/:id")
    editEvent(@Body() data : EventDto, @Param("id") id, @Req() req, @Res() res)
    {
        return this.adminService.editEvent(data, id, req, res);
    }

    @UseGuards(AuthGuard)
    @Get("/showEvent/:id")
    showEvent(@Param("id") id, @Req() req, @Res() res)
    {
        return this.adminService.showEvent(id, req, res);
    }

    @UseGuards(AuthGuard)
    @Delete("/deleteEvent/:id")
    deleteEvent(@Param("id") id, @Req() req, @Res() res)
    {
        return this.adminService.deleteEvent(id, req, res);
    }
}
