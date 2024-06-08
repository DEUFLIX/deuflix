// Existing interface definitions
export interface Movie {
  id: number;
  title: string;
  description: string;
  isMovie: boolean;
  movieImage: string;
  trailer: string;
  year: Year;
  genres: Genre[];
  movieUrl: string;
}

export interface Series {
  id: number;
  title: string;
  description: string;
  isMovie: boolean;
  thumbnailImage: string;
  seriesImage: string;  // 추가
  seriesUrl: string;    // 추가
  trailer: string;      // 추가
  trailerUrl: string;
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
  // 필요한 다른 속성들 추가
}

// mysql2/promise module augmentation
declare module 'mysql2/promise' {
  import * as mysql from 'mysql2';

  export * from 'mysql2';

  export interface Connection extends mysql.Connection {
    execute(sql: string, values?: any): Promise<[mysql.RowDataPacket[], mysql.FieldPacket[]]>;
  }

  export function createConnection(connectionUri: string | mysql.ConnectionOptions): Promise<Connection>;
  export function createPool(config: mysql.PoolOptions | string): mysql.Pool;
}
