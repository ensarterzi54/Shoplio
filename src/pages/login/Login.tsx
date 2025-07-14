import React, { useRef, useState } from 'react'
import './Login.css' // İzole CSS
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const containerRef = useRef<HTMLDivElement>(null)
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
      localStorage.setItem("userEmail", email)
      console.log("data: ", data)

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
  }
  const handleSignUpClick = () => {
    containerRef.current?.classList.add('right-panel-active')
  }

  const handleSignInClick = () => {
    containerRef.current?.classList.remove('right-panel-active')
  }

  return (
    <div className="login-page">
      <h2>Shoplio’ya giriş yap veya hesap oluştur, indirimleri kaçırma!</h2>

      <div className="container" ref={containerRef}>
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form>
            <h1>Hesap Oluştur</h1>
            {/* <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f" /></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g" /></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in" /></a>
            </div>
            <span>or use your email for registration</span> */}
            <input type="text" placeholder="İsim" />
            <input type="email" placeholder="E-posta" />
            <input type="password" placeholder="Şifre" />
            <button type="button">Kayıt Ol</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form>
            <h1>Giriş Yap</h1>
            {/* <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f" /></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g" /></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in" /></a>
            </div>
            <span>or use your account</span> */}
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* <a href="#">Forgot your password?</a> */}
            <button type="button" onClick={handleLogin}>Giriş Yap</button>
          </form>
        </div>

        {/* Overlay Panel */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Hoşgeldin!</h1>
              <p>Seni tekrar görmek çok güzel.</p>
              <button className="ghost" onClick={handleSignInClick} type="button">Giriş Yap</button>
            </div>
            <div className="overlay-panel overlay-right">
              {/* <h1>Hello, Friend!</h1> */}
              <p>Hesabınız yoksa, kayıt olun.</p>
              <button className="ghost" onClick={handleSignUpClick} type="button">Kayıt Ol</button>
            </div>
          </div>
        </div>
      </div>

      {/* <footer>
        <p>
          Created with <i className="fa fa-heart" /> by
          <a target="_blank" rel="noreferrer" href="https://florin-pop.com"> Florin Pop</a>
          – Read how I created this and how you can join the challenge
          <a target="_blank" rel="noreferrer" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/"> here</a>.
        </p>
      </footer> */}
    </div>
  )
}

export default Login
