import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/objects/create-user.dto';
import { UserSchema } from 'src/objects/user-schema';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SignUpService {
    private readonly SALT_ROUND: number = 12;
    private users: UserSchema[] = [];

    private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eyal13102@gmail.com',
      pass: 'umxf jxep yagg pncc', // חשוב! סיסמת אפליקציה
        },
    });


    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUND);
    }

    public async saveUser(createUser: CreateUserDto): Promise<void> {
        const hashPassword: string = await this.hashPassword(createUser.password);
        this.users.push(new UserSchema(createUser.userName, hashPassword));
        await this.sendVerificationEmail(createUser.email);
    }

    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private async sendVerificationEmail(email: string): Promise<void> {
        const code = this.generateCode();

        await this.transporter.sendMail({
        from: '"My App" <eyal13102@gmail.com>',
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${code}`,
        });
    } 

    public async veritifyUser(veritifyUser: CreateUserDto): Promise<boolean> {
        const user: UserSchema | undefined = this.users.find(user => user.userName === veritifyUser.userName);
        if (user === undefined)
            return false;
        return await bcrypt.compare(veritifyUser.password, user.password);
    }
}
