import { UserCard } from "./user-card"
import { ListUserProps } from "../types"

export const UserList = ({ users }: ListUserProps) => {
  return <ul className="flex flex-col">
    <li className="">{users.map(user => {
      return <UserCard key={user.id} user={user}/>
    })}</li>
  </ul>
}