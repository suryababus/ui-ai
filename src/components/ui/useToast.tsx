"use client";

import { create } from "zustand";

type ToastState = {
  show: boolean;
  message: string;
  showMessage: (message: string) => void;
};

export const useToast = create<ToastState>((set) => ({
  show: false,
  message: "",
  showMessage: (message: string) => {
    set({ message });

    set({ show: true });

    setTimeout(() => {
      set({ show: false });
    }, 3000);
  },
}));

export const ToastProvider = () => {
  const { message, show } = useToast((state) => state);

  return (
    <div
      className={`fixed left-0 w-full flex justify-center p-4 transition-all duration-1000 ${
        show ? " top-28 opacity-100" : " top-[-50px] opacity-0"
      }`}
    >
      <div className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-bounce">
        {message}
      </div>
    </div>
  );
};
