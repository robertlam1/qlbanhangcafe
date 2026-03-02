import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Dùng field "user" để đăng nhập (ví dụ: Lam) – không phân biệt hoa/thường
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedPassword = password.trim();

      const response = await fetch('/account.json');
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu tài khoản');
      }

      const accounts = await response.json();

      const matchedAccount = accounts.find((acc) => {
        const accUser = String(acc.user || '').trim().toLowerCase();
        const accPass = String(acc.pass || '').trim();
        return accUser === normalizedUsername && accPass === normalizedPassword;
      });

      if (!matchedAccount) {
        setError('Sai tài khoản hoặc mật khẩu');
        return;
      }

      // Lưu thông tin người dùng vào localStorage
      const { pass, ...publicInfo } = matchedAccount;
      localStorage.setItem('currentUser', JSON.stringify(publicInfo));

      // Thông báo cho Header cập nhật tên
      window.dispatchEvent(new Event('userUpdated'));

      // Điều hướng về trang chủ (hoặc trang trước đó)
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi, vui lòng thử lại sau');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login Form</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Email or Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>

        <div className="login-divider">Or login with</div>

        <div className="social-login">
          <button type="button" className="social-btn facebook">
            <i className="fab fa-facebook-f"></i>
            <span>Facebook</span>
          </button>
          <button type="button" className="social-btn google">
            <i className="fab fa-google"></i>
            <span>Google</span>
          </button>
        </div>

        <div className="login-footer">
          <span>Not a member?</span>
          <a href="#signup" className="signup-link">
            Signup now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;


