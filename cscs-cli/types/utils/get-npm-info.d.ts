declare function getNpmInfo(npmName: string, registry?: string): Promise<any> | null;
declare function getDefaultRegistry(): string;
declare function getNpmVersions(npmName: string, registry?: string): Promise<string[]>;
declare function getNpmSemverVersion(baseVersion: string, npmName: string, registry?: string): Promise<string | null>;
declare function getNpmLatestVersion(npmName: string, registry: string): Promise<any>;
export { getNpmInfo, getNpmVersions, getNpmSemverVersion, getDefaultRegistry, getNpmLatestVersion, };
