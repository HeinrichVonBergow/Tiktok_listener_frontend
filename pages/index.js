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
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>TikTok Listener</h1>

      <label htmlFor="usernameInput" style={{ display: 'block', marginBottom: 8 }}>
        TikTok Benutzername (ohne @)
      </label>
      <input
        id="usernameInput"
        placeholder="z. B. danielsanderbeste"
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: 10,
          fontSize: 16,
          width: 300,
          border: '1px solid #ccc',
          borderRadius: 4,
          marginBottom: 10,
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleCheck();
        }}
      />

      <br />

      <button
        onClick={handleCheck}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          fontSize: 16,
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s',
          outline: 'none',
        }}
      >
        {loading ? 'Lade...' : 'Prüfen'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 20 }}>{error}</p>}

      {result && result.nickname && (
        <div style={{ marginTop: 30 }}>
          <h3>Ergebnis</h3>
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
