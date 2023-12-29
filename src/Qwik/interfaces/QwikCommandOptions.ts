import { Qwik } from "..";

export interface QwikCommandOptions {
  client: Qwik;
  path: any;
  message?: {
    prefix: string;
  };
}
