
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
export default function Navbar() {
  return (
    <nav>
      <div className="noTablet noDesktop navbarMobile">
        <NavbarMobile />
      </div>
      <div className="noMobile navbarDesktop">
        <NavbarDesktop />
      </div>
    </nav>
  );
}