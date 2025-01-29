import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../utils/api' // Import the API utility
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('login', 'POST', { email, password }) // Call API utility

      // Store token in sessionStorage for session-based auth
      sessionStorage.setItem('auth_token', data.token)

      // Navigate to dashboard upon successful login

      if (data.user.role === 'agency') {
        navigate('/dashboard')
      } else {
        navigate('/client-dashboard')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.copy}>
        <div className={styles.logo}>
          <img src={'/img/vaas-white.png'} alt="vass" width="170" height="90" />
        </div>
        <div className={styles.boxs}>
          <div className={styles.box}>
            <h3>Custom pricing</h3>
            <p>Custom pricing of your voice agents</p>
          </div>
          <div className={styles.box}>
            <h3>Dashboard</h3>
            <p>Share a secure dashboard for your clients</p>
          </div>
          <div className={styles.box}>
            <h3>Whitelabel</h3>
            <p>You can whitelabel it with your own logo, domain, and server!</p>
          </div>
          <div className={styles.box}>
            <h3>Multiple agents</h3>
            <p>Designed for agency owners who have many clients and agents</p>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div>
          <div className={styles.logoSM}>
            <img
              src={'/img/vaas-white.png'}
              alt="vass"
              width="170"
              height="90"
            />
          </div>
          <h2 className={styles.title}>Client Portal</h2>
          <form onSubmit={handleSignin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
