import { useState, useEffect } from "react";

interface LoaderProps {
  steps?: string[];
  onComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ steps = [], onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (steps.length === 0) return;
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), 2000);
      return () => clearTimeout(timer);
    } else {
      const completeTimer = setTimeout(() => onComplete && onComplete(), 2000);
      return () => clearTimeout(completeTimer);
    }
  }, [currentStep, steps.length, onComplete]);

  if (steps.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <p className="text-lg font-semibold mb-4">{steps[currentStep]}</p>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-200"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
