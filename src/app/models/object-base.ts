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
    PathId: number;
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
        PathId?: number,
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
        this.PathId = obj.PathId;
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

export interface MoveObject {
    Ids?: Array<number>,
    ObjectTypeId: number,
    ObjectId: number
}

interface Channel {        
    IconId: number,
    LogoId: number,
    Name: string,
    Description: string,
    SeoKeywords: string,
    SeoNoIndex: boolean,
    SeoEnable: boolean,
    Id: number,
    PathId: number,
    PathLatin: string,
    PathSuffix: number,
    ParentPathId: number,
    ParentPathLatin: string,
    ParentPathSuffix: number,
    Url: string,
    ParentPath: string,
    Path: string
}

export interface Tag {
    Name: string,
    SeoTitle: string,
    SeoDescription: string,
    SeoKeywords: string,
    SeoNoIndex: boolean,
    SeoEnable: boolean,
    Description: string,
    Id: number,
    PathId: number,
    PathLatin: string,
    PathSuffix: number,
    ParentPathId: number,
    ParentPathLatin: string,
    ParentPathSuffix: number,
    Url: string,
    ParentPath: string,
    Path: string
}

interface Theme {
    IconId: number,
    LogoId: number,
    Name: string,
    SeoKeywords: string,
    SeoNoIndex: boolean,
    SeoEnable: boolean,
    Description: string,
    Id: number,
    PathId: number,
    PathLatin: string,
    PathSuffix: number,
    ParentPathId: number,
    ParentPathLatin: string,
    ParentPathSuffix: number,
    Url: string,
    ParentPath: string,
    Path: string
}

interface Person {
    IconId: number,
    LogoId: number,
    Name: string,
    SeoKeywords: string,
    SeoNoIndex: boolean,
    SeoEnable: boolean,
    Description: string,
    Id: number,
    PathId: number,
    PathLatin: string,
    PathSuffix: number,
    ParentPathId: number,
    ParentPathLatin: string,
    ParentPathSuffix: number,
    Url: string,
    ParentPath: string,
    Path: string
}

interface Section {
    ParentId: number,
    IconId: number,
    LogoId: number,
    Name: string,
    FullName: string,
    ParentName: string,
    SeoTitle: string,
    SeoDescription: string,
    SeoKeywords: string,
    SeoNoIndex: boolean,
    SeoEnable: boolean,
    Description: string,
    Id: number,
    PathId: number,
    PathLatin: string,
    PathSuffix: number,
    ParentPathId: number,
    ParentPathLatin: string,
    ParentPathSuffix: number,
    Url: string,
    ParentPath: string,
    Path: string
}

interface Media {
    Name: string,
    ShootDate: Date,
    PubDate: Date,
    StateId: number,
    StateName: string,
    Duration: number,
    ChannelId: number,
    ChannelName: string,
    SectionId: number,
    SectionName: string,
    SeriesId: number,
    SeriesName: string,
    KeyFrameId: number,
    Tags: Array<Tag>,
    Sections: Array<Section>,
    Persons: Array<Person>,    
    Themes: Array<Theme>,    
    Description: string,
    Id: number,
    PathId: number,
    PathLatin: string,
    PathSuffix: number,
    ParentPathId: number,
    ParentPathLatin: string,
    ParentPathSuffix: number,
    Url: string,
    ParentPath: string,
    Path: string
}


export interface Path {
      SeoDescription: string,
      GlobalId: number,
      ObjectId: number,
      ObjectTypeId: number,
      ObjectTypeName: string,
      Redirect: Path | Channel | Tag | Theme | Person | Section | Media,      
      Name: string,
      Description: string,
      SeoTitle: string,
      SeoKeywords: string,
      SeoNoIndex: boolean,
      SeoEnable: boolean,
      Id: number,
      PathId: number,
      PathLatin: string,
      PathSuffix: number,
      ParentPathId: number,
      ParentPathLatin: string,
      ParentPathSuffix: number,
      Url: string,
      ParentPath: string,
      Path: string,
      HistoryPath: Array<HistoryPath>,
      HistoryObject: Array<HistoryObject>,
      Redirects: Array<Path>,
      
}

interface HistoryPath {
    Id: number,
    Item: Path,
    CreateTime: Date
}

interface HistoryObject {
    Id: number,
    Item: Path | Channel | Tag | Theme | Person | Section | Media,
    CreateTime: Date
}
