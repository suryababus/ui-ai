"use client";
import { emitEvent } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Contact Us",
    href: "/contact-us",
  },
  {
    name: "Go to App",
    href: "/app",
  },
];
const NavBarItems = () => {
  const pathName = usePathname();
  const [active, setActive] = useState(pathName);

  useEffect(() => {
    setActive(pathName);
    emitEvent({
      event: "page_view",
      data: {
        path: pathName,
      },
    });
  }, [pathName]);

  return links.map((link) => (
    <Link
      key={link.name}
      href={link.href}
      className={` hover:bg-blue-300 mx-4 px-4 py-2 rounded-xl ${
        link.href === active ? "bg-blue-500 text-white" : "text-gray-800"
      }`}
    >
      {link.name}
    </Link>
  ));
};

export default NavBarItems;
