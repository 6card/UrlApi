export class ObjectBase {
    GlobalId: number;
    ObjectId: number;
    ObjectTypeId: number;
    ObjectTypeName: string;
    Name: string;
    Description: string;
    SeoEnable: boolean;
    SeoNoIndex: boolean;
    SeoTitle: string;
    SeoDescription: string;
    SeoKeywords: string;     
    Id: number;
    PathLatin: string;
    PathSuffix: number;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;
    Url: string;
    HistoryPath: Array<any>;
    HistoryObject: Array<any>;
    Redirects: Array<any>;
  
    constructor(obj: {
        GlobalId?: number,
        ObjectId?: number,
        ObjectTypeId?: number,
        ObjectTypeName?: string,
        Name?: string,
        Description?: string,
        SeoNoIndex?: boolean,
        SeoEnable?: boolean,
        SeoTitle?: string,
        SeoDescription?: string,
        SeoKeywords?: string,        
        Id?: number,
        PathLatin?: string,
        PathSuffix?: number,
        ParentPathId?: number,
        ParentPathLatin?: string,
        ParentPathSuffix?: number,
        Url?: string;
        HistoryPath?: Array<any>,
        HistoryObject?: Array<any>,
        Redirects?: Array<any>
    } = {}) 
    {
        this.GlobalId = obj.GlobalId;
        this.ObjectId = obj.ObjectId;
        this.ObjectTypeId = obj.ObjectTypeId;
        this.ObjectTypeName = obj.ObjectTypeName || '';
        this.Name = obj.Name || '';
        this.Description = obj.Description || '';
        this.SeoNoIndex = obj.SeoNoIndex;
        this.SeoEnable = obj.SeoEnable;
        this.SeoTitle = obj.SeoTitle  || '';
        this.SeoDescription = obj.SeoDescription  || '';
        this.SeoKeywords = obj.SeoKeywords || '';        
        this.Id = obj.Id;
        this.PathLatin = obj.PathLatin || '';
        this.PathSuffix = obj.PathSuffix;
        this.ParentPathId = obj.ParentPathId;
        this.ParentPathLatin = obj.ParentPathLatin || '';
        this.ParentPathSuffix = obj.ParentPathSuffix;
        this.Url = obj.Url;
        this.HistoryPath = obj.HistoryPath;
        this.HistoryObject = obj.HistoryObject;
        this.Redirects = obj.Redirects;
    }
  }