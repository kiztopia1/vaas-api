import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password,
          password_confirmation: passwordConfirmation,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        Cookies.set('auth_token', data.token, { expires: 7 })
        navigate('/dashboard')
      } else {
        setError(data.error || 'Signup failed. Please try again.')
      }
    } catch (err) {
      setError('Signup failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-screen h-screen bg-brand-dark">
      {/* Left Section */}
      <div className="hidden md:block w-1/2 bg-brand-primary-800 p-8">
        <div className="w-40 mx-auto mt-8">
          <img
            src="/img/vaas-white.png"
            alt="vass"
            className="object-contain w-[170px] h-[90px]"
          />
        </div>

        <div className="flex flex-wrap justify-between max-w-2xl mx-auto mt-16 gap-4">
          {[
            {
              title: 'Custom pricing',
              text: 'Custom pricing of your voice agents',
            },
            {
              title: 'Dashboard',
              text: 'Share a secure dashboard for your clients',
            },
            {
              title: 'Whitelabel',
              text: 'You can whitelabel it with your own logo, domain, and server!',
            },
            {
              title: 'Multiple agents',
              text: 'Designed for agency owners who have many clients and agents',
            },
          ].map((box, i) => (
            <div
              key={i}
              className="w-[48%] p-6 bg-brand-primary-900/30 rounded-xl border border-brand-primary-700"
            >
              <h3 className="text-white font-semibold mb-2 text-lg">
                {box.title}
              </h3>
              <p className="text-brand-light text-sm leading-relaxed">
                {box.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-brand-dark p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="md:hidden w-40 mx-auto mb-12">
            <img
              src="/img/vaas-white.png"
              alt="vass"
              className="object-contain w-[170px] h-[90px]"
            />
          </div>

          <h2 className="text-3xl text-white text-center mb-8 font-bold">
            Create New Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-brand-light text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary-600 bg-brand-primary-900/20 text-white placeholder-brand-light/50 focus:outline-none focus:border-brand-primary-500 focus:ring-1 focus:ring-brand-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-light text-sm mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="kiztopiaman34"
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary-600 bg-brand-primary-900/20 text-white placeholder-brand-light/50 focus:outline-none focus:border-brand-primary-500 focus:ring-1 focus:ring-brand-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-light text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary-600 bg-brand-primary-900/20 text-white placeholder-brand-light/50 focus:outline-none focus:border-brand-primary-500 focus:ring-1 focus:ring-brand-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-light text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 border-brand-primary-600 bg-brand-primary-900/20 text-white placeholder-brand-light/50 focus:outline-none focus:border-brand-primary-500 focus:ring-1 focus:ring-brand-primary-500"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-brand-primary-600 text-white font-semibold transition-colors
                ${
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-brand-primary-700'
                }`}
            >
              {loading ? 'Please wait...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
