import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "@/store/authSlice";

const NavLink = ({ to, children, className = "" }) => {
  return (
    <Link
      to={to}
      className={`whitespace-nowrap transition-colors duration-200 text-gray-600 hover:text-purple-500 ${className}`}
    >
      {children}
    </Link>
  );
};

// Abhi ka simple profile menu (Clerk ke UserButton ki jagah)
const ProfileMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open profile menu"
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white p-3 shadow-lg">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-3 block text-sm text-gray-700 hover:text-purple-500 sm:hidden"
          >
            Upload a Video
          </Link>
          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="mt-3 w-full rounded-md px-3 py-1.5 text-sm text-white"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const isSignedIn = Boolean(user);

  // Logged-in header mein links zyada hain, to mobile par thoda chhota
  const small = isSignedIn ? "text-sm sm:text-base" : "";

  return (
    <nav
      className={`container flex items-center justify-between py-4 mx-auto ${
        isSignedIn ? "px-4 sm:px-8" : "px-8"
      }`}
    >
      <div className="flex lg:flex-1">
        <NavLink to="/">
          <span className="flex items-center gap-2 shrink-0">
            <img
              src="/icon.svg"
              alt="TalkToText logo"
              width={32}
              height={32}
              className="hover:rotate-12 transform transition duration-200 ease-in-out"
            />
            <span className="font-extrabold text-lg">TalkToText</span>
          </span>
        </NavLink>
      </div>
      <div className="flex lg:justify-center gap-2 lg:gap-12 lg:items-center">
        <NavLink to="/#pricing" className={small}>
          Pricing
        </NavLink>
        {isSignedIn && (
          <NavLink to="/posts" className={small}>
            Your Posts
          </NavLink>
        )}
      </div>

      <div className="flex lg:justify-end lg:flex-1">
        {isSignedIn ? (
          <div className="flex gap-2 items-center">
            <NavLink to="/dashboard" className="hidden sm:inline">
              Upload a Video
            </NavLink>
            <ProfileMenu />
          </div>
        ) : (
          <NavLink to="/sign-in">Sign In</NavLink>
        )}
      </div>
    </nav>
  );
}