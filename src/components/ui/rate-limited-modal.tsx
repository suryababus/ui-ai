type RateLimitedModalProps = {
  onCloseClick: () => void;
};

export const RateLimitedModal = ({ onCloseClick }: RateLimitedModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Beta Limit Reached</h2>
        <p className="mb-6">
          You have exceeded the daily limit of 10 prompts. Please come back
          tomorrow.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onCloseClick}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
