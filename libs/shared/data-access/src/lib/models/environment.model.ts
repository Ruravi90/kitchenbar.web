export interface AppEnvironment {
    version: string;
    production: boolean;
    baseUrl: string;
    apiBase: string;
    hubBase: string;
    publicKey: string;
    stripePublicKey: string;
    vapidPublicKey: string;
}
