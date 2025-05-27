import { Body, Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guard/jwt.guard';
import { AdminService } from './admin.service';
import { EventDto } from './dtos/event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer';

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
    @UseInterceptors(FileInterceptor('image_url', multerConfig))
    createEvent(
        @Body() data : EventDto, 
        @UploadedFile() file,
        @Req() req, 
        @Res() res)
    {
        console.log('BODY DATA:', data);
console.log('FILE:', file);
        return this.adminService.createEvent(data, file, req, res);
    }

    @UseGuards(AuthGuard)
    @Post("/editEvent/:id")
    @UseInterceptors(FileInterceptor('image_url', multerConfig))
    editEvent(
        @UploadedFile() file,
        @Param("id") id, 
        @Req() req, 
        @Res() res)

    {
        return this.adminService.editEvent(file, id, req, res);
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
