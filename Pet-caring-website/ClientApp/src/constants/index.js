import { TiHome } from "react-icons/ti";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { MdGroup } from "react-icons/md";
import { FaPhoneAlt, FaUser, FaCog, FaSignOutAlt} from "react-icons/fa";
import { LuUserCog, LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePets, MdPayments, MdOutlineHome } from "react-icons/md";

import {
  logo,
  cryIcon,
  loginImg,
  catLoginImg,
  icon_dogboarding,
  icon_doginhome,
  icon_dogovernight,
  icon_dogrunning,
  icon_dogtaxi,
  icon_dogwalking,
  KhalJonas,
  ava_ElizabethWan,
  ava_MichaelDoe,
  ava_ThomasZarki,
  ava_KhalJonas,
  ThomasZarki,
  ElizabethWan,
  MichaelDoe,
  yelp,
  home_gallery1,
  home_gallery2,
  home_gallery3,
  footerHome,
  footerHome2,
  pictureMain2,
  whpcHeaderImg,
  Intro,
  footerWhpcLeft,
  footerWhpcRight,
  galleryHeaderImg,
  PetService_1,
  PetService_2,
  PetService_3,
  PetService_4,
  PetService_5,
  PetService_6,
  dogFooterGallery,
  catFooterGallery,
  logoWhite,
  womanHoldCat,
  profileTopCat,
} from "../assets";

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

export const services = [
  {
    title: "Dog Walking",
    description:
      "Choose from a 30, 45, or 60-minute visit to give your pet their daily dose of fun-filled exercise.",
    icon: icon_dogwalking,
  },
  {
    title: "Dog Running",
    description:
      "It is for big dogs that need more exercise. Choose from a 25, 35 minute to give your pet daily dose.",
    icon: icon_dogrunning, // ô này mặc định màu tím
  },
  {
    title: "Dog Boarding",
    description:
      "Give your dogs the best day ever with our caring service from grooming to walking and playing.",
    icon: icon_dogboarding,
  },
  {
    title: "Dog Overnight Care",
    description:
      "If you’re away for the night, you definitely can let your dog stays with us for all the best cares.",
    icon: icon_dogovernight,
  },
  {
    title: "Pet in-home visit",
    description:
      "Service for cats and dogs. While you’re away we provide your pet all food, water, exercise, and attention.",
    icon: icon_doginhome,
  },
  {
    title: "Pet Taxi",
    description:
      "Service for cats and dogs. Does your pet need a lift to the groomers, vet, or dog park? We’ve got their tails covered.",
    icon: icon_dogtaxi,
  },
];

export const statsData = [
  {
    id: 1,
    number: "+12",
    description: "Years of experiences",
  },
  {
    id: 2,
    number: "20K+",
    description: "Happy pets, Happy clients",
  },
  {
    id: 3,
    number: "55+",
    description: "Professionals",
  },
];

export const reviews = [
  {
    id: 1,
    name: "Khal Jonas",
    image: KhalJonas,
    ava: ava_ThomasZarki,
    rating: 5,
    review:
      "So happy I found this place! They are all absolutely wonderful and genuinely care about your pets. Also prices are very reasonable for all the work they do (like watering plants). Can't thank you all enough!",
  },
  {
    id: 2,
    name: "Thomas Zarki",
    image: ThomasZarki,
    ava: ava_KhalJonas,
    rating: 4.5,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
  {
    id: 3,
    name: "Elizabeth Wan",
    image: ElizabethWan,
    ava: ava_ElizabethWan,
    rating: 5,
    review:
      "My dog loves walking with their friendly staff.The owner Mary is very responsive and reliable, overall I have a good experience with their service.",
  },
  {
    id: 4,
    name: "Michael Doe",
    image: MichaelDoe,
    ava: ava_MichaelDoe,
    rating: 4.8,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
  {
    id: 5,
    name: "Michael Doe",
    image: MichaelDoe,
    ava: ava_MichaelDoe,
    rating: 4.8,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
  {
    id: 6,
    name: "Michael Doe",
    image: ElizabethWan,
    ava: ava_MichaelDoe,
    rating: 4.8,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
];

export const categories = [
  { key: "all", label: "All" },
  { key: "dog-walking", label: "Dog Walking" },
  { key: "dog-running", label: "Dog Running" },
  { key: "dog-day-care", label: "Dog Day Care" },
  { key: "dog-overnight-care", label: "Dog Overnight Care" },
  { key: "pet-in-home", label: "Pet In-home Visit" },
  { key: "pet-taxi", label: "Pet Taxi" },
];

export const images = [
  { src: PetService_6, category: "dog-walking" },
  { src: PetService_6, category: "dog-walking" },
  { src: PetService_6, category: "dog-walking" },
  { src: PetService_2, category: "dog-running" },
  { src: PetService_2, category: "dog-running" },
  { src: PetService_2, category: "dog-running" },
  { src: PetService_3, category: "dog-day-care" },
  { src: PetService_3, category: "dog-day-care" },
  { src: PetService_3, category: "dog-day-care" },
  { src: PetService_1, category: "dog-overnight-care" },
  { src: PetService_1, category: "dog-overnight-care" },
  { src: PetService_1, category: "dog-overnight-care" },
  { src: PetService_5, category: "pet-in-home" },
  { src: PetService_5, category: "pet-in-home" },
  { src: PetService_5, category: "pet-in-home" },
  { src: PetService_1, category: "pet-taxi" },
  { src: PetService_1, category: "pet-taxi" },
  { src: PetService_1, category: "pet-taxi" },
  { src: PetService_4, category: "dog-running" },
  { src: PetService_4, category: "dog-running" },
  { src: PetService_4, category: "dog-running" },
  { src: PetService_4, category: "dog-running" },
];

export const profile = [
  { id: "My Dashboard", title: "My Dashboard", icon: LuLayoutDashboard },
  { id: "My Profile", title: "My Profile", icon: LuUserCog },
  { id: "My Pets", title: "My Pets", icon: MdOutlinePets },
  { id: "My Payment", title: "My Payment", icon: MdPayments },
  { id: "Home", title: "Back Home", icon: MdOutlineHome },
];

export const userFields = [
  { label: "User name", name: "username" },
  { label: "First name", name: "firstname" },
  { label: "Last name", name: "lastname" },
  { label: "Phone", name: "phone" },
  { label: "E-mail", name: "email" },
  { label: "Address", name: "address" },
  { label: "New password", name: "newPassword" },
  { label: "Confirmed Password", name: "confirmedPassword" },
];

export {
  logo,
  cryIcon,
  loginImg,
  catLoginImg,
  yelp,
  home_gallery1,
  home_gallery2,
  home_gallery3,
  footerHome,
  footerHome2,
  pictureMain2,
  whpcHeaderImg,
  Intro,
  footerWhpcLeft,
  footerWhpcRight,
  galleryHeaderImg,
  dogFooterGallery,
  catFooterGallery,
  logoWhite,
  womanHoldCat,
  profileTopCat,
};
