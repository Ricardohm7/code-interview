import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UsersList from './components/UsersList'

const fetchUsers = async (page: number) => {
  return await fetch(`https://randomuser.me/api/?results=10&seed="rm&page=${page}`)
    .then(res => {
      if (!res.ok) throw new Error('error en la petición')
      return res.json()
    })
    .then(res => res.results)
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const onSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetchUsers(currentPage)
      .then(users => {
        setUsers((prevUsers) => {
          const newUsers = prevUsers.concat(users)
          originalUsers.current = newUsers
          return newUsers
        })
      })
      .catch(err => {
        setError(err)
        console.error(err)
      }).finally(() => {
        setLoading(false)
      })
  }, [currentPage])

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

    // return sorting === SortBy.COUNTRY
    //   ? filteredUsers.toSorted((a, b) => {
    //     return a.location.country.localeCompare(b.location.country)
    //   })
    //   : filteredUsers
  }, [filteredUsers, sorting])

  const onChangeFilterCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCountry(e.target.value)
  }

  return (
    <div>
      <h1>Prueba técnica</h1>
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
      {loading && <strong>Cargando...</strong>}
      {error && <p>Ha habido un error</p>}
      {!error && users.length === 0 && <p>No hay usuarios</p>}
      {!loading && !error && <button onClick={() => { setCurrentPage(currentPage + 1) }}>Cargar más resultados</button>}
    </div>
  )
}

export default App
