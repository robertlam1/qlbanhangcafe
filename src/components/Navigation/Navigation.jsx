import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const defaultLeftAds = [
  {
    id: 'L1',
    badge: 'Ưu đãi sáng',
    title: 'Combo bánh + cà phê chỉ từ 45k',
    detail: '7h–10h hàng ngày tại quầy & mang đi',
    cta: 'Đặt ngay',
    to: '/',
  },
  {
    id: 'L2',
    badge: 'Giao nhanh',
    title: 'Freeship đơn từ 150k trong ngày',
    detail: 'Khu vực nội thành, áp dụng theo giờ cao điểm',
    cta: 'Xem điều kiện',
    to: '/',
  },
];

const defaultRightAds = [
  {
    id: 'R1',
    badge: 'Thành viên',
    title: 'Tích điểm đổi ly cà phê miễn phí',
    detail: 'Đăng ký tại quầy hoặc khi thanh toán online',
    cta: 'Tham gia',
    to: '/',
  },
  {
    id: 'R2',
    badge: 'Mới',
    title: 'Cold brew hạt Arabica Cầu Đất',
    detail: 'Rang nhẹ, vị chua dịu — có bán chai take-away',
    cta: 'Khám phá',
    to: '/',
  },
];

function Navigation({ side = 'left', ads }) {
  const list =
    ads ?? (side === 'right' ? defaultRightAds : defaultLeftAds);

  return (
    <nav
      className={`promo-rail promo-rail--${side}`}
      aria-label={side === 'right' ? 'Quảng cáo bên phải' : 'Quảng cáo bên trái'}
    >
      <div className="promo-rail__stack">
        {list.map((ad) => (
          <article key={ad.id} className="promo-rail__card">
            <span className="promo-rail__badge">{ad.badge}</span>
            <h2 className="promo-rail__title">{ad.title}</h2>
            <p className="promo-rail__detail">{ad.detail}</p>
            <Link className="promo-rail__cta" to={ad.to}>
              {ad.cta}
            </Link>
          </article>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
