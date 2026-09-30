import { Module } from '@nestjs/common'

import { BiometricsService } from '../../common/biometrics/biometrics.service.js'

import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'

@Module({
    controllers: [
        AuthController,
    ],

    providers: [
        AuthService,
        BiometricsService,
    ],
})
export class AuthModule { }