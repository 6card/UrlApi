export interface Meta {
    Id: number;
    Columns: Array<MetaColumn>;
    Tables: Array<number>;
    MediaListEditable: boolean;
    MediaListEnable: boolean;
    DefaultFilter: {
        Column: number;
        Operation: number;
    }
}

export interface MetaColumn {
    Operations: Array<number>;
    Id: number;
    GroupName: string;
    PropertyName: string;
    DisplayName: string;
    MaxLength: number;
    Unique: boolean;
    Type: string;
    Sort: boolean;
    Filter: boolean;
    ValueObjectType: number;
    Values: Array<MetaColumnTypeValues>;
}

export interface MetaColumnTypeValues {
    Key: number;
    Value: string;
}