import React from 'react';
import clsx from 'clsx'; // npm install clsx

export default function Card({ title, children, className, headerAction }) {
  return (
    <div className={clsx("bg-white border border-gray-100 rounded-2xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700", className)}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
        {headerAction && headerAction}
      </div>
      {children}
    </div>
  );
}