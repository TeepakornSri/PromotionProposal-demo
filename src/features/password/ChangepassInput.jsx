import React from 'react';

export default function ChangepassInput({ placeholder, type = 'text', value, onChange, hasError }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`block w-[320px] rounded-xl px-4 py-3 outline-none border
                   ${hasError
                        ? "border-red-500 focus:ring-red-300"
                        : "focus:ring-blue-300 focus:border-blue-500 border-gray-300"
                    }`}
                    
            value={value}
            onChange={onChange}
        />
    );
}
