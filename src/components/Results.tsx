import { useUsers } from '../hooks/useUsers'

const Results = () => {
  const { users } = useUsers()
  return (
    <div>Results {users.length}</div>
  )
}

export default Results
