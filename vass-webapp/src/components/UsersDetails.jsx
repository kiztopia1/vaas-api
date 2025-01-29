import { useEffect, useState } from 'react'
import styles from './UsersDetails.module.css'
import AddUser from './AddUser'
import { apiRequest } from '../utils/api'

export default function UsersDetails() {
  const [users, setUsers] = useState([]) // Users data
  const [agents, setAgents] = useState([]) // Agents data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [removingUserId, setRemovingUserId] = useState(null) // Track user being removed
  const [newUser, setNewUser] = useState(false) // Track new user creation
  const authToken = sessionStorage.getItem('auth_token') // Retrieve auth token

  useEffect(() => {
    // Fetch all users under the agency
    const fetchUsers = async () => {
      try {
        const response = await apiRequest('clients')

        setUsers(response.data) // Ensure data is correctly assigned
      } catch (err) {
        setError('Error fetching users: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (authToken) fetchUsers()
  }, [authToken, newUser])

  const handleModifyClick = async (user) => {
    setSelectedUser(user)
    setShowModal(true)

    try {
      const response = await apiRequest('/agents', 'GET', null, authToken) // Fetch agents list

      if (response.success) {
        setAgents(response.data)
      } else {
        setError('Failed to fetch agents')
      }
    } catch (err) {
      setError('Error fetching agents')
    }
  }

  const handleSaveChanges = async (e) => {
    e.preventDefault()

    try {
      const response = await apiRequest(
        `/users/client/${selectedUser.id}`,
        'PUT',
        {
          name: selectedUser.name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          agents: selectedUser.agents,
        },
        authToken
      )

      if (response.success) {
        setShowModal(false)
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === selectedUser.id ? response.data : u))
        )
      } else {
        alert('Failed to update user')
      }
    } catch (err) {
      alert('Error updating user')
    }
  }

  const handleAgentSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setSelectedUser((prevUser) =>
      prevUser ? { ...prevUser, agents: selectedOptions } : prevUser
    )
  }

  const handleDeleteClick = async (id) => {
    setRemovingUserId(id)

    try {
      const response = await apiRequest(
        `users/${id}`,
        'DELETE',
        null,
        authToken
      )

      if (response.message) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
      } else {
        alert('Failed to remove user')
      }
    } catch (err) {
      alert('Error removing user')
    } finally {
      setRemovingUserId(null)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Client Accounts</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Phone</th>
            <th className={styles.th}>Agents</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr className={styles.tr} key={user.id}>
                <td className={styles.td}>{user.name}</td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>{user.phone || 'N/A'}</td>
                <td className={styles.td}>{user.agent || 'No Agents'}</td>
                <td className={styles.td}>
                  <button
                    className={styles.button}
                    onClick={() => handleModifyClick(user)}
                  >
                    Modify
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(user.id)}
                    disabled={removingUserId === user.id}
                  >
                    {removingUserId === user.id ? 'Removing...' : 'Remove'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.noData}>
                No Client accounts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <AddUser setNewUser={setNewUser} newUser={newUser} />

      {showModal && selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContainer}>
            <h3>Modify User: {selectedUser.name}</h3>
            <form onSubmit={handleSaveChanges}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={selectedUser?.name || ''}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="text"
                  value={selectedUser?.phone || ''}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                />
              </div>

              {/* Agents Field */}
              <div>
                <label>Agents:</label>
                <select
                  multiple
                  value={selectedUser?.agents || []}
                  onChange={handleAgentSelection}
                  className={styles.multipleSelect}
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
