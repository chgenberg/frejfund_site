"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ResultByIdPage() {
	const params = useParams()
	const router = useRouter()
	const id = params.id as string
	const [data, setData] = useState<any>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!id) return
		;(async () => {
			try {
				const res = await fetch(`/api/analyses/${id}`, { cache: 'no-store' })
				if (res.status === 401) { router.push('/auth/login'); return }
				if (res.status === 404) { router.push('/dashboard'); return }
				const json = await res.json()
				setData(json.analysis)
			} catch (e) {
				console.error(e)
				router.push('/dashboard')
			} finally {
				setLoading(false)
			}
		})()
	}, [id])

	if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>
	if (!data) return null

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-2">{data.company_name}</h1>
			<p className="text-gray-500 mb-6">Score: {data.score}</p>
			<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-xs">{JSON.stringify(data.insights || data.answers, null, 2)}</pre>
		</div>
	)
} 