import { FunctionComponent } from "react";

interface BetaTagProps {
  children: React.ReactNode;
}

const BetaTag: FunctionComponent<BetaTagProps> = ({ children }) => {
  return (
    <div className="flex items-center space-x-2">
      {children}
      <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
        Beta
      </span>
    </div>
  );
};

export default BetaTag;
