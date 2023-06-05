import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from '@prisma/client'
import { Prisma } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

    }
    async signup(dto: AuthDto) {
        // generate password
        const hash = await argon.hash(dto.password);

        // save user in db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })

            delete user.hash

            // return saved user

            return user;
        } catch (error) {
            // might not have error code which may cause error

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    throw new ForbiddenException('Credentials taken')

                }
                console.log("Prisma Error")
            }
            console.log(error)
            throw error;

        }

    }
    async signin(dto: AuthDto) {

        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });


        // if user does not exist
        if (!user) {
            throw new ForbiddenException(
                'Credentials Incorrect'
            )
        }

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password)

        // if password incorrect throw exception
        if (!pwMatches) {
            throw new ForbiddenException(
                "Credentials incorrect"
            )
        }
        delete user.hash
        // send back the user
        return user
    }
}