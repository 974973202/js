export interface projectTemplateType {
    id: number;
    name: string;
    npmName: string;
    value: string;
    projectName: string;
    projectId: string;
    tags: string;
    repositoryUrl: string;
}
export interface pageTemplateType {
    id: number;
    name: string;
    value: string;
    pageName: string;
}
export interface fileTemplateType {
    id: number;
    name: string;
    value: string;
    pageName: string;
}
export interface optType {
    force?: boolean;
    type?: string;
    project?: string;
    page?: string;
    file?: string;
}
export interface infoTemplateType<T> {
    type: string;
    name: string;
    template: T;
    targetPath?: string;
}
