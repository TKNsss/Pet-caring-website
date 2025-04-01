import { TiHome } from "react-icons/ti";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { MdGroup } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

import { logo, cryIcon, loginImg, catLoginImg } from "../assets";

export const navLinks = [
  { id: "Home", label: "Home", href: "/", icon: TiHome },
  {
    id: "Services",
    label: "Our Services",
    href: "/services",
    icon: FaHandHoldingHeart,
    subLinks: [
      {
        label: "Service 1",
        href: "/services/service1",
      },
      {
        label: "Service 2",
        href: "/services/service2",
      },
      {
        label: "Service 3",
        href: "/services/service3",
      },
    ],
  },
  {
    id: "About",
    label: "About Us",
    href: "/about",
    icon: MdGroup,
    subLinks: [
      {
        label: "Why Happy Pet Care",
        href: "/about/why-choose-us",
      },
      { label: "Gallery", href: "/about/gallery" },
    ],
  },
  { id: "Contact", label: "Contact Us", href: "/contact", icon: FaPhoneAlt },
];

export const userDropdownLinks = [
  { label: "My Profile", href: "/user/profile", icon: FaUser },
  { label: "Settings", href: "/setting", icon: FaCog },
  { label: "Sign out", icon: FaSignOutAlt },
];

export { logo, cryIcon, loginImg, catLoginImg };
