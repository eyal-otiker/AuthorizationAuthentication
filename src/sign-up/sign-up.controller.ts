import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { CreateUserDto } from 'src/objects/create-user.dto';

@Controller('sign-up')
export class SignUpController {
    constructor(private readonly signUpService: SignUpService) {}

    @Post()
    public async createUser(@Body() createUser: CreateUserDto): Promise<void> {
        await this.signUpService.saveUser(createUser);
    }

    @Get()
    public async veritifyUser(@Body() createUser: CreateUserDto): Promise<boolean> {
        return await this.signUpService.veritifyUser(createUser);
    }
}
