import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://localhost:7164/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem('jwt', token);

      // Token içinden role bilgisini al
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // Role göre yönlendir
      if (role === "Admin") {
        navigate('/admin');
      } else {
        navigate('/products');
      }

    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Giriş</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleLogin}>Giriş Yap</button>
    </div>
  );
};

export default Login;
