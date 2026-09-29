interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_LEADS_ENDPOINT?: string;
  readonly SITE_URL?: string;
  readonly WEB_ORIGIN?: string;
  readonly MODE?: string;
  readonly PROD?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
