import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('auth');
    if (isAuth !== 'true') {
      router.push('/login');
    }
  }, []);

  const handleCheck = async () => {
    if (!username) {
      setError('Bitte gib einen TikTok-Benutzernamen ein.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Fehler bei der Verbindung zum Server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>TikTok Listener</h1>
      <input
        placeholder="TikTok @username"
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 8, fontSize: 16 }}
      />
      <button onClick={handleCheck} style={{ marginLeft: 10, padding: '8px 16px' }}>
        {loading ? 'Prüfe...' : 'Prüfen'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && result.nickname && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Nickname:</strong> {result.nickname}</p>
          <p><strong>User ID:</strong> {result.user_id}</p>
          <p><strong>Live:</strong> {result.live ? 'Ja' : 'Nein'}</p>
        </div>
      )}

      {result && result.error && (
        <p style={{ color: 'orange' }}>Serverfehler: {result.error}</p>
      )}
    </div>
  );
}
