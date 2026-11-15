import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export type User = {
	id: number
	username: string
	name: string
	email: string
	avatar_url: string | null
	role: 'user' | 'admin'
}

export default function App() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('/api/auth/me', { credentials: 'include' })
			.then(res => {
				if (!res.ok) throw new Error('no session')
				return res.json()
			})
			.then(data => setUser(data))
			.catch(() => setUser(null))
			.finally(() => setLoading(false))
	}, [])

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-bg text-fg'>
				<p className='text-muted animate-pulse text-sm font-mono'>
					Yuklanmoqda...
				</p>
			</div>
		)
	}

	// Hozircha routing oddiy — keyinroq react-router qo'shiladi
	if (!user) {
		return <Login />
	}

	return <Dashboard user={user} />
}
