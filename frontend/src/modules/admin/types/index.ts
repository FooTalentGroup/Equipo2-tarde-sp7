export type CardUserProps = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  active: boolean;
  role: string;
  created_at: string
}

export type UserProp = {
  user: CardUserProps
}

export type ListUserProps = {
  users: CardUserProps[]
}