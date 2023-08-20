import { useMemo, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UsersList from './components/UsersList'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useUsers } from './hooks/useUsers'
import Results from './components/Results'

function App() {
  const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } = useUsers()

  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  // const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const onSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = () => {
    void refetch()
  }

  const handleDelete = (email: string) => {
    // const filteredUsers = users.filter((user) => user.email !== email)
    // setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLocaleLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers
    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  const onChangeFilterCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCountry(e.target.value)
  }

  return (
    <div>
      <h1>Prueba técnica</h1>
      <Results />
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={onSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>
          Resetear Usuario
        </button>
        <input placeholder='Filtra por país' value={filterCountry ?? ''} onChange={onChangeFilterCountry} />
      </header>
      {users.length > 0 && <UsersList
        changeSorting={handleChangeSort}
        handleDelete={handleDelete}
        users={sortedUsers}
        showColors={showColors} />}
      {isLoading && <strong>Cargando...</strong>}
      {isError && <p>Ha habido un error</p>}
      {!isLoading && !isError && users.length === 0 && <p>No hay usuarios</p>}
      {!isLoading && !isError && hasNextPage === true && <button onClick={() => { fetchNextPage() }}>Cargar más resultados</button>}
      {!isLoading && !isError && hasNextPage === false && <p>No hay más resultados</p>}
    </div>
  )
}

export default App
