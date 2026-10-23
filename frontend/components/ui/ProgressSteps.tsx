interface ProgressStepsProps {
  currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = ['Event details', 'Choose vendors', 'Build package', 'Pay deposit'];

  return (
    <div className="flex items-center justify-between mb-8 max-w-3xl mt-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                isActive ? 'bg-[#266665] text-white' : 
                isCompleted ? 'bg-[#DAEDED] text-[#266665]' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                ) : stepNumber}
              </div>
              <span className={`text-sm font-medium ${
                isActive ? 'text-[#266665]' : 
                isCompleted ? 'text-gray-700' : 
                'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-[1px] mx-4 ${isCompleted ? 'bg-[#266665]' : 'bg-gray-200'}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
