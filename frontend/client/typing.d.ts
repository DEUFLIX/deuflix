// 기존 인터페이스 정의
export interface Movie {
  id: number;
  title: string;
  description: string;
  isMovie: boolean;
  movieImage: string;
  trailer: string;
  year: Year;
  genres: Genre[];
  movieUrl: string; // 추가됨
}

export interface Series {
  suggestions: ReactNode;
  seriesTitle: string | undefined;
  id: number;
  title: string;
  description: string;
  isMovie: boolean;
  thumbnailImage: string;
  seriesImage: string; // 추가됨
  seriesUrl: string; // 추가됨
  trailer: string; // 추가됨
  genres: Genre[];
  episodes: Episode[];
  year: Year;
}

export interface Episode {
  id: number;
  seriesId: number;
  episodeNumber: number;
  title: string;
  description: string;
  url: string;
  duration: number;
  thumbnailImage: string;
}

export interface Genre {
  id: number;
  genre: string;
}

export interface Year {
  id: number;
  year?: number;
}

export interface List {
  id: number;
  title: string;
  items: (Movie | Series)[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  user_name: string;
  // 필요한 다른 속성들 추가
}

// mysql2/promise 모듈 보강
declare module 'mysql2/promise' {
  import * as mysql from 'mysql2';

  export * from 'mysql2';

  export interface Connection extends mysql.Connection {
    execute(sql: string, values?: any): Promise<[mysql.RowDataPacket[], mysql.FieldPacket[]]>;
  }

  export function createConnection(connectionUri: string | mysql.ConnectionOptions): Promise<Connection>;
  export function createPool(config: mysql.PoolOptions | string): mysql.Pool;
}