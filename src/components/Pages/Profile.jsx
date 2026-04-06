import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('currentUser');
        if (!raw) {
            navigate('/login', { replace: true });
            return;
        }
        try {
            setUser(JSON.parse(raw));
        } catch {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1 className="profile-title">Hồ sơ</h1>
                <dl className="profile-fields">
                    <dt>Tên đăng nhập</dt>
                    <dd>{user.user || '—'}</dd>
                    {user.name && (
                        <>
                            <dt>Tên hiển thị</dt>
                            <dd>{user.name}</dd>
                        </>
                    )}
                    {user.role && (
                        <>
                            <dt>Vai trò</dt>
                            <dd>{user.role}</dd>
                        </>
                    )}
                    {user.id != null && (
                        <>
                            <dt>Mã</dt>
                            <dd>{user.id}</dd>
                        </>
                    )}
                </dl>
                {/* <button
                    type="button"
                    className="profile-back"
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </button> */}
            </div>
        </div>
    );
};

export default Profile;
