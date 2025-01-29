import { useEffect, useState } from 'react'
import styles from './addUser.module.css'
import { apiRequest } from '../utils/api'

export default function AddUser({ setNewUser, newUser }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  const authToken = sessionStorage.getItem('auth_token') // Retrieve auth token

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await apiRequest('agents')

        setAgents(response)
        setSelectedAgent(response.length > 0 ? response[0].id : '')
      } catch (err) {
        setError(err.message)
      }
    }

    if (authToken) fetchAgents()
  }, [authToken])

  const handleClose = () => {
    setShowModal(false)
    setSuccess(false)
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiRequest(
        'users',
        'POST',
        {
          name,
          email,
          password: 'TempPass123!', // Assign a temporary password (should be reset by the user)
          password_confirmation: 'TempPass123!',
        },
        authToken
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to add user')
      }

      setUserDetails(response.data)
      setGeneratedPassword('TempPass123!') // Display temporary password
      setSuccess(true)

      setEmail('')
      setName('')
      setSelectedAgent('')
      setNewUser(!newUser)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button className={styles.addButton} onClick={() => setShowModal(true)}>
        Add User
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContainer}>
            {success && userDetails ? (
              <div className={styles.successContainer}>
                <h2>User Created Successfully</h2>
                <p>
                  <strong>Name:</strong> {userDetails.name}
                </p>
                <p>
                  <strong>Email:</strong> {userDetails.email}
                </p>
                <p>
                  <strong>Password:</strong> {generatedPassword}
                </p>
                <br />
                <p className={styles.warning}>
                  Please save the password securely!
                </p>
                <br />
                <button
                  type="button"
                  onClick={handleClose}
                  className={styles.closeButton}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2>Add New User</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleAddUser}>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={3}
                    />
                  </div>

                  <div>
                    <label>Assign Agent</label>
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                    >
                      {agents.length > 0 ? (
                        agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Agents Available</option>
                      )}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className={styles.addUser}
                    disabled={loading}
                  >
                    {loading ? 'Please wait...' : 'Add User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={styles.closeButton}
                  >
                    Close
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
