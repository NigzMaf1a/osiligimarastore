import {
    Body,
    Controller,
    Post,
} from '@nestjs/common'

import type {
    AuthenticationResponseJSON,
    RegistrationResponseJSON,
} from '@simplewebauthn/server'

import { AuthService } from './auth.service.js'

interface RegisterBiometricBody {
    userId: number
    username: string
}

interface VerifyRegistrationBody {
    userId: number
    response: RegistrationResponseJSON
    challenge: string
}

interface AuthenticateBiometricBody {
    userId: number
}

interface VerifyAuthenticationBody {
    userId: number
    response: AuthenticationResponseJSON
    challenge: string
}

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('biometrics/register/options')
    async registrationOptions(
        @Body() body: RegisterBiometricBody,
    ) {
        return this.authService
            .beginBiometricRegistration(
                body.userId,
                body.username,
            )
    }

    @Post('biometrics/register/verify')
    async verifyRegistration(
        @Body() body: VerifyRegistrationBody,
    ) {
        return this.authService
            .completeBiometricRegistration(
                body.userId,
                body.response,
                body.challenge,
            )
    }

    @Post('biometrics/authenticate/options')
    async authenticationOptions(
        @Body() body: AuthenticateBiometricBody,
    ) {
        return this.authService
            .beginBiometricAuthentication(
                body.userId,
            )
    }

    @Post('biometrics/authenticate/verify')
    async verifyAuthentication(
        @Body() body: VerifyAuthenticationBody,
    ) {
        return this.authService
            .completeBiometricAuthentication(
                body.userId,
                body.response,
                body.challenge,
            )
    }
}