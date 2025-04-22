import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'admin' && pass === 'bergow2025') {
      localStorage.setItem('auth', 'true');
      router.push('/');
    } else {
      alert('Login fehlgeschlagen');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <input placeholder="Benutzername" onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Passwort" onChange={e => setPass(e.target.value)} /><br />
      <button onClick={handleLogin}>Anmelden</button>
    </div>
  );
}
