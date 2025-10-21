import React, { ReactNode } from 'react';

export const LegalSection = ({ title, children }: { title: string, children: ReactNode }) => (
    <div className="mb-6"> {/* */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3> {/* */}
        <div className="space-y-3">{children}</div> {/* */}
    </div>
);