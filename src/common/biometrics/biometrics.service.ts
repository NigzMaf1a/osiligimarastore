import { Injectable } from '@nestjs/common'
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server'

import type {
    RegistrationResponseJSON,
    AuthenticationResponseJSON,
} from '@simplewebauthn/server'

import { BIOMETRICS } from './biometrics.constants.js'
import type { BiometricCredential } from './biometrics.types.js'

@Injectable()
export class BiometricsService {

    private readonly credentials = new Map<number, BiometricCredential[]>()

    async generateRegistrationOptions(
        userId: number,
        username: string,
    ) {
        const existingCredentials =
            this.credentials.get(userId) ?? []

        return generateRegistrationOptions({
            rpName: BIOMETRICS.RP_NAME,
            rpID: BIOMETRICS.RP_ID,
            userName: username,

            userID: new TextEncoder().encode(
                userId.toString(),
            ),

            attestationType: 'none',

            excludeCredentials: existingCredentials.map(
                credential => ({
                    id: credential.credentialId,
                }),
            ),

            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'required',
            },
        })
    }

    async verifyRegistration(
        userId: number,
        response: RegistrationResponseJSON,
        expectedChallenge: string,
    ) {
        const verification =
            await verifyRegistrationResponse({
                response,
                expectedChallenge,
                expectedOrigin: BIOMETRICS.ORIGIN,
                expectedRPID: BIOMETRICS.RP_ID,
            })

        if (!verification.verified || !verification.registrationInfo) {
            return {
                verified: false,
            }
        }

        const {
            credential,
        } = verification.registrationInfo

        const storedCredential: BiometricCredential = {
            credentialId: credential.id,
            publicKey: credential.publicKey,
            counter: credential.counter,
            userId,
        }

        const existing =
            this.credentials.get(userId) ?? []

        existing.push(storedCredential)

        this.credentials.set(userId, existing)

        return {
            verified: true,
            credential: storedCredential,
        }
    }

    async generateAuthenticationOptions(userId: number) {
        const credentials =
            this.credentials.get(userId) ?? []

        return generateAuthenticationOptions({
            rpID: BIOMETRICS.RP_ID,
            userVerification: 'required',

            allowCredentials: credentials.map(
                credential => ({
                    id: credential.credentialId,
                }),
            ),
        })
    }

    async verifyAuthentication(
        userId: number,
        response: AuthenticationResponseJSON,
        expectedChallenge: string,
    ) {
        const credentials =
            this.credentials.get(userId) ?? []

        const credential =
            credentials.find(
                item =>
                    item.credentialId === response.id,
            )

        if (!credential) {
            return {
                verified: false,
            }
        }

        const verification =
            await verifyAuthenticationResponse({
                response,
                expectedChallenge,
                expectedOrigin: BIOMETRICS.ORIGIN,
                expectedRPID: BIOMETRICS.RP_ID,
                credential: {
                    id: credential.credentialId,
                    publicKey: credential.publicKey,
                    counter: credential.counter,
                },
            })

        if (!verification.verified) {
            return {
                verified: false,
            }
        }

        credential.counter =
            verification.authenticationInfo.newCounter

        return {
            verified: true,
            userId,
        }
    }
}