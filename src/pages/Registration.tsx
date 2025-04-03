
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import RegistrationForm from '@/components/RegistrationForm';

const Registration = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Profile Registration</h1>
        <RegistrationForm />
      </main>
      <Navigation />
    </div>
  );
};

export default Registration;
