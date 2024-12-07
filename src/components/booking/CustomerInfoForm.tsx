import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import type { CustomerInfo } from '../../types/booking';

interface CustomerInfoFormProps {
  onSubmit: (data: CustomerInfo) => void;
  initialData?: CustomerInfo;
}

export function CustomerInfoForm({ onSubmit, initialData }: CustomerInfoFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<CustomerInfo>(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
  );

  const formFields = [
    { 
      id: 'firstName', 
      label: t('booking.form.firstName'), 
      type: 'text', 
      icon: User, 
      placeholder: t('booking.form.enterFirstName'),
      required: true 
    },
    { 
      id: 'lastName', 
      label: t('booking.form.lastName'), 
      type: 'text', 
      icon: User, 
      placeholder: t('booking.form.enterLastName'),
      required: true 
    },
    { 
      id: 'email', 
      label: t('booking.form.email'), 
      type: 'email', 
      icon: Mail, 
      placeholder: t('booking.form.enterEmail'),
      required: true 
    },
    { 
      id: 'phone', 
      label: t('booking.form.phone'), 
      type: 'tel', 
      icon: Phone, 
      placeholder: t('booking.form.enterPhone'),
      required: true 
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {formFields.map(({ id, label, type, icon: Icon, placeholder, required }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label 
              htmlFor={id}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={type}
                id={id}
                required={required}
                value={formData[id as keyof CustomerInfo]}
                onChange={(e) => setFormData(prev => ({ ...prev, [id]: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-500 dark:placeholder-gray-400
                         transition-colors duration-200"
                placeholder={placeholder}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
        >
          {t('booking.form.continueToPayment')}
        </Button>
      </div>
    </motion.form>
  );
}