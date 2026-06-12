
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
export default function Navbar() {
  return (
    <nav>
      <div className="navbarMobile noTablet noDesktop glass">
        <NavbarMobile />
      </div>
      <div className="navbarDesktop noMobile alignNext flexCenter">
        <NavbarDesktop />
      </div>
    </nav>
  );
}