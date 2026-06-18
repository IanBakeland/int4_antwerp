import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

//icons
import PersonIcon from '../assets/icons/Person';

export default function Favourites() {
  useDocumentTitle('Favourites');

  return (
    <div>
        <div className={`toolbar noDesktop noTablet`}>
        <div className="alignNext">
          <h1>Your <span>favourites</span></h1>
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
        <h1>Your favourites</h1>
      </div>
    </div>
  );
}