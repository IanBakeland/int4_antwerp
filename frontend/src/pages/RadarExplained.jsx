import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

//icons
import PersonIcon from '../assets/icons/Person';

export default function RadarExplained() {
  useDocumentTitle('Radar explained');

  return (
    <div>
        <div className={`toolbar noDesktop noTablet`}>
        <div className="alignNext">
          <h1></h1>
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
        <h1>Unlock stories using the <span>radar</span></h1>
    </div>
  );
}