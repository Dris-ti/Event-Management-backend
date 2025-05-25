import { AuthGuard } from 'src/guard/jwt.guard';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Get("/futureEvents")
    futureEvents(@Req() req, @Res() res) {
        return this.UserService.futureEvents(req, res);
    }

    @Get("/pastEvents")
    pastEvents(@Req() req, @Res() res) {
        return this.UserService.pastEvents(req, res);
    }

    @Get("/showEvent/:id")
    showEvent(@Param("id") id, @Req() req, @Res() res) {
        return this.UserService.showEvent(id, req, res);
    }

    @Get('/eventSearch')
    async eventSearch(
        @Res() res,
        @Query('query') query: string
    ) {
    return this.UserService.eventSearch(res, query);
    }

    @UseGuards(AuthGuard)
    @Post('/eventBooking/:id')
    eventBooking(
        @Req() req,
        @Res() res,
        @Param('id') id: string,
        @Body() seat : number)
        {
            return this.UserService.eventBooking(req, res, id, seat);
        }

    @UseGuards(AuthGuard)
    @Get("/bookingHistory/")
    bookingHistory(@Req() req, @Res() res) {
        return this.UserService.bookingHistory(req, res);
    }

}
