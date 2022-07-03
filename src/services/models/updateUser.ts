interface Prop<T> {
    value: T
}

interface UpdateUserDto {
    userGroupId?: Prop<number>,
    name?: Prop<string>,
    login?: Prop<string>,
    gender?: Prop<number>,
    email?: Prop<string>,
    city?: Prop<string>,
    paidTo?: Prop<Date>
    achievementId?: Prop<number>
}

type UpdateKeys = keyof UpdateUserDto;
