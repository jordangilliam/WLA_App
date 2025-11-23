'use client';

import { useState } from 'react';
import Image from 'next/image';

interface KeyStep {
  id: string;
  question: string;
  options: KeyOption[];
  imageUrl?: string;
}

interface KeyOption {
  id: string;
  label: string;
  nextStepId?: string;
  resultId?: string;
  imageUrl?: string;
}

interface IdentificationResult {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  habitat: string;
  characteristics: string[];
}

interface InteractiveKeyProps {
  title: string;
  description: string;
  steps: KeyStep[];
  results: Record<string, IdentificationResult>;
  onResult?: (result: IdentificationResult) => void;
}

export default function InteractiveKey({
  title,
  description,
  steps,
  results,
  onResult,
}: InteractiveKeyProps) {
  const [currentStepId, setCurrentStepId] = useState<string>(steps[0]?.id || '');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [currentResult, setCurrentResult] = useState<IdentificationResult | null>(null);

  const currentStep = steps.find((s) => s.id === currentStepId);

  const handleOptionSelect = (option: KeyOption) => {
    const newPath = [...selectedPath, option.id];
    setSelectedPath(newPath);

    if (option.resultId) {
      const result = results[option.resultId];
      if (result) {
        setCurrentResult(result);
        if (onResult) {
          onResult(result);
        }
      }
    } else if (option.nextStepId) {
      setCurrentStepId(option.nextStepId);
    }
  };

  const resetKey = () => {
    setCurrentStepId(steps[0]?.id || '');
    setSelectedPath([]);
    setCurrentResult(null);
  };

  if (currentResult) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Identification Complete!</h2>
          <p className="text-gray-600">You identified:</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex flex-col md:flex-row gap-6">
            {currentResult.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={currentResult.imageUrl}
                  alt={currentResult.name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{currentResult.name}</h3>
              <p className="text-gray-600 italic mb-4">{currentResult.scientificName}</p>
              <p className="text-gray-700 mb-4">{currentResult.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-900">Habitat: </span>
                  <span className="text-gray-700">{currentResult.habitat}</span>
                </div>
                {currentResult.characteristics.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">Characteristics: </span>
                    <ul className="list-disc list-inside text-gray-700 mt-1">
                      {currentResult.characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={resetKey}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Identify Another
          </button>
        </div>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <p className="text-gray-600">No identification steps available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {selectedPath.map((pathId, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              {index < selectedPath.length - 1 && (
                <div className="w-8 h-0.5 bg-blue-600"></div>
              )}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold">
            {selectedPath.length + 1}
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="space-y-4">
        {currentStep.imageUrl && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={currentStep.imageUrl}
              alt={currentStep.question}
              fill
              className="object-contain"
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentStep.question}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentStep.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  {option.imageUrl && (
                    <Image
                      src={option.imageUrl}
                      alt={option.label}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <span className="font-medium text-gray-900">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      {selectedPath.length > 0 && (
        <button
          onClick={() => {
            const newPath = selectedPath.slice(0, -1);
            setSelectedPath(newPath);
            // Find the step that leads to current step
            const previousStep = steps.find((s) =>
              s.options.some((o) => o.nextStepId === currentStepId)
            );
            if (previousStep) {
              setCurrentStepId(previousStep.id);
            } else {
              setCurrentStepId(steps[0].id);
            }
          }}
          className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

