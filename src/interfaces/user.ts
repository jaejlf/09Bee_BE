// 아래에 추가적으로 줄 값들 앞으로 추가하면 됨
export interface userType {
    googleId? : string,
    userId? : number,
    provider: string,
    name: string,
    email: string,
    createdAt?: string,
    phone?: string
}