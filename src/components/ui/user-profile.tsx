"use client";

import { googleAuth } from "@/lib/firebase";
import { logout } from "@/lib/login";
import { headers } from "next/headers";
import { FunctionComponent, useEffect, useState } from "react";

interface UserProfileProps {
  email: string;
  profileImg: string;
}

const UserProfile: FunctionComponent<UserProfileProps> = (
  props: UserProfileProps
) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const { email, profileImg } = props;
  const loggedIn = !!email;

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropDown((showDropDown) => !showDropDown);
          }}
        >
          <img src={profileImg ?? ""} className="w-8 h-8 rounded-full" />
          <span className="ml-2">▼</span>
        </button>
      </div>
      {showDropDown && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button
              className="text-gray-700 block px-4 py-2 text-sm w-full"
              role="menuitem"
              id="menu-item-1"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
