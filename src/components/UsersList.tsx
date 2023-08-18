import { type User } from '../types'

interface Props {
  handleDelete: (email: string) => void
  users: User[]
  showColors: boolean
}

const UsersList = ({ users, showColors, handleDelete }: Props) => {
  const onDeleteUser = (email: string) => () => {
    handleDelete(email)
  }
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <th>Foto</th>
        <th>Nombre</th>
        <th>Appellido</th>
        <th>Pais</th>
        <th>Acciones</th>
      </thead>
      <tbody>
        {
          users.map((user, index) => {
            const backgroundColor = index % 2 === 0 ? '#333' : '#555'
            const color = showColors ? backgroundColor : 'transparent'
            return (
              <tr key={user.email} style={{ backgroundColor: color }}>
                <td>
                  <img src={user.picture.thumbnail} />
                </td>
                <td>
                  {user.name.first}
                </td>
                <td>
                  {user.name.last}
                </td>
                <td>
                  {user.location.country}
                </td>
                <td>
                  <button onClick={onDeleteUser(user.email)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

export default UsersList
