
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
export default function Navbar() {
  return (
    <nav>
      <div className="noTablet noDesktop">
        <NavbarMobile />
      </div>
      <div className="noMobile">
        <NavbarDesktop />
      </div>
    </nav>
  );
}