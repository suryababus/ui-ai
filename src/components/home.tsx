import { FunctionComponent, useEffect } from "react";
import Link from "next/link";
import BetaTag from "./ui/beta-tag";
import { NextRequest } from "next/server";
import { headers } from "next/headers";

interface HomePageProps {}

const HomePage: FunctionComponent<HomePageProps> = () => {
  return (
    <>
      <main className="flex-grow container mx-auto px-6 py-16 flex flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Create UI Components from Text Prompts
          </h1>
          <p className="text-gray-600 mb-8">
            Transform your ideas into beautiful UI components effortlessly.
          </p>
          <a
            href="/app"
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600"
          >
            Try it for free
          </a>
        </div>

        <img
          src="/ui-generator.png"
          alt="UI Generator"
          className="w-3/4 mt-8 justify-self-center self-center bg-white p-2 rounded-xl shadow-xl"
        />
      </main>

      <footer className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 text-center">
          <p className="text-gray-600">
            &copy; 2024 LLM-Minds UI Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
