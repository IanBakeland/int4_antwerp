
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
export default function Navbar() {
  return (
    <nav>
      <div className="navbarMobile noTablet noDesktop ">
        <NavbarMobile />
      </div>
      <div className="navbarDesktop noMobile">
        <NavbarDesktop />
      </div>
    </nav>
  );
}