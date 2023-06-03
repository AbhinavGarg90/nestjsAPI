import { IsNotEmpty, IsEmail, IsString } from "class-validator/types/decorator/decorators";

export class AuthDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}