'use client';

import { useState, FC } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  title: string;
  description: string;
  bankName: string;
  accountNumber: string;
}

interface StepProps {
  nextStep?: () => void;
  prevStep?: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  submitForm?: () => void;
}

const Step1: FC<StepProps> = ({ nextStep, formData, setFormData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Purpose of FundMe</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
      <button onClick={nextStep} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-md hover:from-cyan-600 hover:to-blue-600">
        Next
      </button>
    </div>
  );
};

const Step2: FC<StepProps> = ({ nextStep, prevStep, formData, setFormData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Description of Loss</h2>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
        ></textarea>
      </div>
      <div className="flex justify-between">
        <button onClick={prevStep} className="bg-gray-600 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-500">
          Previous
        </button>
        <button onClick={nextStep} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-md hover:from-cyan-600 hover:to-blue-600">
          Next
        </button>
      </div>
    </div>
  );
};

const Step3: FC<StepProps> = ({ prevStep, formData, setFormData, submitForm }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Bank Details</h2>
      <div className="mb-4">
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-300">
          Bank Name
        </label>
        <input
          type="text"
          id="bankName"
          value={formData.bankName}
          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300">
          Account Number
        </label>
        <input
          type="text"
          id="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-between">
        <button onClick={prevStep} className="bg-gray-600 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-500">
          Previous
        </button>
        <button onClick={submitForm} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-md hover:from-cyan-600 hover:to-blue-600">
          Submit
        </button>
      </div>
    </div>
  );
};

const NewFundMePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bankName: '',
    accountNumber: '',
  });
  const router = useRouter();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const submitForm = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    router.push('/fundme');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700">
          {step === 1 && <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} />}
          {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />}
          {step === 3 && <Step3 prevStep={prevStep} formData={formData} setFormData={setFormData} submitForm={submitForm} />}
        </div>
      </div>
    </div>
  );
};

export default NewFundMePage;
