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
    } = {} ) {
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
    Ids?: Array<number>;
    ObjectTypeId: number;
    ObjectId: number;
}

export interface Channel {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoEnable: boolean;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    IconId: number;
    LogoId: number;
}

export interface Tag {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoEnable: boolean;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    SeoTitle: string;
    SeoDescription: string;
}

export interface Theme {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoEnable: boolean;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    IconId: number;
    LogoId: number;
}

export interface Person {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoEnable: boolean;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    IconId: number;
    LogoId: number;
}

export interface Section {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoEnable: boolean;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    FullName: string;
    ParentId: number;
    ParentName: string;

    SeoTitle: string;
    SeoDescription: string;

    IconId: number;
    LogoId: number;
}

export interface Media {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    ShootDate: Date;
    PubDate: Date;
    StateId: number;
    StateName: string;
    Duration: number;
    ChannelId: number;
    ChannelName: string;
    SectionId: number;
    SectionName: string;
    SeriesId: number;
    SeriesName: string;
    KeyFrameId: number;
    Tags: Array<Tag>;
    Sections: Array<Section>;
    Persons: Array<Person>;
    Themes: Array<Theme>;
}

export interface Serie {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoEnable: boolean;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    IconId: number;
    LogoId: number;

    SeoDescription: string;
}


export interface Path {
    Id: number;
    Name: string;
    Description: string;
    Url: string;

    SeoKeywords: string;
    SeoNoIndex: boolean;
    SeoEnable: boolean;

    Path: string;
    PathId: number;
    PathLatin: string;
    PathSuffix: number;

    ParentPath: string;
    ParentPathId: number;
    ParentPathLatin: string;
    ParentPathSuffix: number;

    SeoTitle: string;
    SeoDescription: string;

    GlobalId: number;
    ObjectId: number;
    ObjectTypeId: number;
    ObjectTypeName: string;
    Redirect: Path | Channel | Tag | Theme | Person | Section | Media;
    HistoryPath: Array<HistoryPath>;
    HistoryObject: Array<HistoryObject>;
    Redirects: Array<Path>;
}

interface HistoryPath {
    Id: number;
    Item: Path;
    CreateTime: Date;
}

interface HistoryObject {
    Id: number;
    Item: Path | Channel | Tag | Theme | Person | Section | Media | Serie;
    CreateTime: Date;
}
