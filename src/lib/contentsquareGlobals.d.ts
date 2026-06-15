declare global {
  const CS_CONF:
    | {
        status?: number;
        hostnames?: string[];
        allowSubdomains?: number | boolean;
        projectId?: number;
        collectionEnabled?: boolean;
      }
    | undefined;
}

export {};
