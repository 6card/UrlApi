export class Meta {
    Id: number;
    Columns: Array<MetaColumn>;
    Tables: Array<number>;

    constructor( obj: {
        Id: number;
        Columns: Array<MetaColumn>;
        Tables: Array<number>;
    }) {
        this.Id = obj.Id;
        this.Columns = obj.Columns;
        this.Tables = obj.Tables;
    }
}

export class MetaColumn {
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
    Values: Array<any>;

    constructor( obj: {
        Operations?: Array<number>;
        Id: number;
        GroupName?: string;
        PropertyName: string;
        DisplayName?: string;
        MaxLength?: number;
        Unique: boolean;
        Type: string;
        Sort: boolean;
        Filter: boolean;
        ValueObjectType: number;
        Values?: Array<any>;
    } ) {
        this.Operations = obj.Operations.length == 0 ? null : obj.Operations;
        this.Id = obj.Id;
        this.GroupName = obj.GroupName || '';
        this.PropertyName = obj.PropertyName;
        this.DisplayName = obj.DisplayName || '';
        this.MaxLength = obj.MaxLength || null;
        this.Unique = obj.Unique;
        this.Type = obj.Type;
        this.Sort = obj.Sort;
        this.Filter = obj.Filter;
        this.ValueObjectType = obj.ValueObjectType;
        this.Values = obj.Values.length == 0 ? null : obj.Values;
    }
}