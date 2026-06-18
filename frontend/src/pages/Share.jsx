import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

//icons
import PersonIcon from '../assets/icons/Person';

export default function Share() {
  useDocumentTitle('Share your story');

  return (
    <div>
        <div className={`toolbar noDesktop noTablet`}>
        <div className="alignNext">
          <h1>Share your<span> story</span></h1>
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
          <h1>Share your<span> story</span></h1>
      </div>
    </div>
  );
}