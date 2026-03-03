interface TourStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const TourStepIndicator = ({ currentStep, totalSteps }: TourStepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1" role="group" aria-label="Tour progress">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i + 1 === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
          }`}
          aria-label={`Step ${i + 1} of ${totalSteps}`}
        />
      ))}
    </div>
  );
};

export default TourStepIndicator;
