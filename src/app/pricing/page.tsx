import { FunctionComponent } from "react";

interface PricingPageProps {}

const PricingPage: FunctionComponent<PricingPageProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-xl text-gray-700 mb-6">Coming Soon</p>
        <p className="text-lg text-gray-600">
          For now, limited to 10 prompts in 24 hours
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
