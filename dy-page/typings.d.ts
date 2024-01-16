declare module '*.css';
declare module '*.less';
declare module '*.svg';
declare module 'jsencrypt' {
  export default class JSEncrypt {
    public setPublicKey(publicKey: string): void;

    public setPrivateKey(privateKey: string): void;

    public encrypt(data: string): string;

    public decrypt(data: string): string;
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'umi' {
  export const useAccess: () => any;

  export const UmiUIFlag: () => any;

  export const useParams: () => any;

  export const useRouteMatch: () => any;

  export const useModel: (value: string) => any;

  export const history: any;

  export const Link: any;

  export const Access: any;
}
