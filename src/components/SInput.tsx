import React from 'react';

interface TextInputProps {
    type: "password" | "text";
    name: string;
    setter: Function;
    placeholder?: string;
}

const inputTypeMapping = {
    text: "text",
    password: "password"
}

export default function SInput({ type, name, setter, placeholder }: TextInputProps) {
    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    }

    return (
        <div className="w-full">
            <input className="p-2 rounded-sm w-full" type={inputTypeMapping[type]} name={name} placeholder={placeholder} onChange={updateValue} />
        </div>
    )
}
