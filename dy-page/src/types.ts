export interface AuthorityData {
  id: number;
  authorityDataTyped: string;
  tableName: string;
  columnName: string;
  columnDisplayName: string;
  frontColumnTyped: string;
  serviceClass: string;
  serviceMethod: string;
  serviceParams: string;
}

export interface SortAuthority {
  id: number;
  relativeId: number;
  relativePosition: 'AHEAD' | 'REAR';
}

// 数据源下拉列表数据类型
export interface DataSourceType {
  connectAccount: string;
  databaseName: string;
  databaseClass: string;
  jdbcType: string;
  jdbcUrl: string;
}

// 查询数据源接口返回数据类型
export interface DataSourceResponseType {
  default: DataSourceType;
  list: Array<DataSourceType>;
}
