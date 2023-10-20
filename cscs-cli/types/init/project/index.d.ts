import { optType, projectTemplateType } from "../type";
export declare function getProjectTemplate(type: string, name?: string, opts?: optType): Promise<{
    type: string;
    name: any;
    template: projectTemplateType;
    targetPath: string;
}>;
