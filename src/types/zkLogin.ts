// types/zkLogin.ts
export interface ZkLoginAccount {
    address: string;
    email: string;
    name: string;
    picture?: string;
    sub: string; // Google's subject ID
    ephemeralKeyPair: {
      publicKey: string;
      privateKey: string;
    };
    jwt: string;
    salt: string;
    zkProof?: string;
  }
  
  export interface GoogleUserInfo {
    email: string;
    name: string;
    picture?: string;
    sub: string;
  }