import { SortBy, type User } from '../types.d'

interface Props {
  changeSorting: (sort: SortBy) => void
  handleDelete: (email: string) => void
  users: User[]
  showColors: boolean
}

const UsersList = ({ changeSorting, users, showColors, handleDelete }: Props) => {
  const onDeleteUser = (email: string) => () => {
    handleDelete(email)
  }
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Foto</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.NAME) }}>Nombre</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.LAST) }}>Appellido</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.COUNTRY) }}>Pais</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody className={showColors ? 'table--show-colors' : 'table'}>
        {
          users.map((user) => {
            // const backgroundColor = index % 2 === 0 ? '#333' : '#555'
            // const color = showColors ? backgroundColor : 'transparent'
            return (
              <tr key={user.email}>
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
    </table >
  )
}

export default UsersList
