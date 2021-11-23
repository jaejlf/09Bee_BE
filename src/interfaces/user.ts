// 아래에 추가적으로 줄 값들 앞으로 추가하면 됨
export interface userType {
    googleId?: string,
    userId?: number,
    name: string,
    email: string,
    createdAt?: string,
    phone?: string,
    __v?: number,
    _id?: string,
    deal?: number, //거래수
    follower?: number,
    following?: number,
    resentProduct?: number, //최근 참여한 상품
    ongoingProduct?: number, //나의 진행 상품
    address?: string, //기본 배송지
    lobbyAlarm?: [{
        itemId: number, // 해당 알림 itemId
        content: string // 알림 내용
    }],
    dobbyAlarm?: [{
        itemId: number, // 해당 알림 itemId
        content: string // 알림 내용
    }]
}