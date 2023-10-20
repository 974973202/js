import { optType, pageTemplateType } from "../type";
export declare function getPageTemplate(addType: string, name?: string, opts?: optType): Promise<{
    type: string;
    name: any;
    template: pageTemplateType | undefined;
}>;
