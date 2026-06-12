import { Link } from 'react-router-dom';

export default function SmartButton({ children, to, onClick, type = 'button', icon }) {
  if (to) {
    return (
      <Link to={to} className="button">
        {icon && <span className="buttonIcon">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className="button">
      {icon && <span className="buttonIcon">{icon}</span>}
      {children}
    </button>
  );
}