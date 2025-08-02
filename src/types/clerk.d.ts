import { UserResource } from '@clerk/types';

declare module '@clerk/types' {
  interface UserResource {
    privateMetadata?: {
      tier?: string;
      [key: string]: unknown;
    };
  }
}
