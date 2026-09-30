export interface BiometricCredential {
    credentialId: string
    publicKey: Uint8Array
    counter: number
    userId: number
}