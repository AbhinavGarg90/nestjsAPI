import { Controller, Get, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UserController {

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe() {
        return 'user info';
    }
}
