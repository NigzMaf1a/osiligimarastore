import { Injectable } from '@nestjs/common'

import type {
    AuthenticationResponseJSON,
    RegistrationResponseJSON,
} from '@simplewebauthn/server'

import { BiometricsService } from '../../common/biometrics/biometrics.service.js'

@Injectable()
export class AuthService {

    constructor(
        private readonly biometricsService: BiometricsService,
    ) { }

    async beginBiometricRegistration(
        userId: number,
        username: string,
    ) {
        return this.biometricsService
            .generateRegistrationOptions(
                userId,
                username,
            )
    }

    async completeBiometricRegistration(
        userId: number,
        response: RegistrationResponseJSON,
        challenge: string,
    ) {
        return this.biometricsService
            .verifyRegistration(
                userId,
                response,
                challenge,
            )
    }

    async beginBiometricAuthentication(
        userId: number,
    ) {
        return this.biometricsService
            .generateAuthenticationOptions(
                userId,
            )
    }

    async completeBiometricAuthentication(
        userId: number,
        response: AuthenticationResponseJSON,
        challenge: string,
    ) {
        return this.biometricsService
            .verifyAuthentication(
                userId,
                response,
                challenge,
            )
    }
}