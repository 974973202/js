import { fileTemplateType, optType } from "../type";
export declare function getFileTemplate(addType: string, name?: string, opts?: optType): Promise<{
    type: string;
    name: any;
    template: fileTemplateType | undefined;
}>;
