import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("auth") !== "true") {
      router.push('/login');
    }
  }, []);

  const handleCheck = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>TikTok Listener</h1>
      <input placeholder="TikTok @username" onChange={e => setUsername(e.target.value)} />
      <button onClick={handleCheck}>Prüfen</button>

      {result && (
        <div>
          <p><strong>Nickname:</strong> {result.nickname}</p>
          <p><strong>User ID:</strong> {result.user_id}</p>
          <p><strong>Live?</strong> {result.live ? 'Ja' : 'Nein'}</p>
        </div>
      )}
    </div>
  );
}
