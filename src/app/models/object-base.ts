export class ObjectBase {
    GlobalId: number;
    ObjectId: number;
    ObjectTypeId: number;
    ObjectTypeName: string;
    Name: string;
    SeoTitle: string;
    SeoDescription: string;
    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoStatusId: number;        
    Id: number;
    PathLatin: string;
    PathSuffix: number;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;
    HistoryPath: Array<any>;
    HistoryObject: Array<any>;
    Redirects: Array<any>;
  
    constructor(obj: {
        GlobalId?: number,
        ObjectId?: number,
        ObjectTypeId?: number,
        ObjectTypeName?: string,
        Name?: string,
        SeoTitle?: string,
        SeoDescription?: string,
        SeoKeywords?: string,
        SeoNoIndex?: boolean,
        SeoStatusId?: number,
        Id?: number,
        PathLatin?: string,
        PathSuffix?: number,
        ParentPathId?: number,
        ParentPathLatin?: string,
        ParentPathSuffix?: number,
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
        this.SeoTitle = obj.SeoTitle  || '';
        this.SeoDescription = obj.SeoDescription  || '';
        this.SeoKeywords = obj.SeoKeywords || '';
        this.SeoNoIndex = obj.SeoNoIndex;
        this.SeoStatusId = obj.SeoStatusId;
        this.Id = obj.Id;
        this.PathLatin = obj.PathLatin || '';
        this.PathSuffix = obj.PathSuffix;
        this.ParentPathId = obj.ParentPathId;
        this.ParentPathLatin = obj.ParentPathLatin || '';
        this.ParentPathSuffix = obj.ParentPathSuffix;
        this.HistoryPath = obj.HistoryPath;
        this.HistoryObject = obj.HistoryObject;
        this.Redirects = obj.Redirects;
    }
  }