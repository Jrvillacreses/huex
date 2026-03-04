import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Create user
        const user = await this.usersService.create(registerDto);

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.username);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            ...tokens,
        };
    }

    async login(loginDto: LoginDto) {
        // Find user
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Validate password
        const isPasswordValid = await this.usersService.validatePassword(
            user,
            loginDto.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.username);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            ...tokens,
        };
    }

    async refreshToken(refreshToken: string) {
        let payload: any;
        try {
            payload = this.jwtService.verify(refreshToken);
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.generateTokens(user.id, user.email, user.username);
    }

    private async generateTokens(userId: string, email: string, username: string) {
        const payload = { sub: userId, email, username };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async validateUser(userId: string) {
        return this.usersService.findOne(userId);
    }
}
