import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

interface BookingStepsProps {
  currentStep: number;
}

export function BookingSteps({ currentStep }: BookingStepsProps) {
  const { t } = useTranslation();

  const steps = [
    { 
      id: 1, 
      name: t('booking.steps.personalInfo.title'), 
      description: t('booking.steps.personalInfo.description') 
    },
    { 
      id: 2, 
      name: t('booking.steps.payment.title'), 
      description: t('booking.steps.payment.description') 
    },
    { 
      id: 3, 
      name: t('booking.steps.confirmation.title'), 
      description: t('booking.steps.confirmation.description') 
    },
  ];

  return (
    <nav aria-label="Progress" className="px-4 sm:px-0">
      <motion.ol 
        role="list"
        className="flex items-center justify-between space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {steps.map((step, stepIdx) => (
          <motion.li
            key={step.name}
            className={cn(
              'relative flex-1',
              stepIdx !== steps.length - 1 ? 'pr-8' : ''
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: stepIdx * 0.1 }}
          >
            {stepIdx !== steps.length - 1 && (
              <div className="absolute top-4 right-0 w-full">
                <div className="h-0.5 w-full">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                  {step.id <= currentStep && (
                    <motion.div
                      className="absolute inset-0 bg-amber-600"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="group relative flex flex-col items-center">
              <span className="flex h-9 items-center" aria-hidden="true">
                <span className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                  step.id < currentStep 
                    ? "bg-amber-600" 
                    : step.id === currentStep
                    ? "border-2 border-amber-600 bg-white dark:bg-gray-800"
                    : "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                )}>
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : step.id === currentStep ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  )}
                </span>
              </span>
              <div className="mt-3 text-center">
                <h3 className={cn(
                  "text-sm font-medium",
                  step.id <= currentStep 
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  {step.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </nav>
  );
}