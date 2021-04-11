import React, { useState } from 'react';

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
    const [value, setValue] = useState<string | number>("");

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setter(e.target.value);
    }

    return (
        <div className="w-full">
            <input className="p-2 rounded-sm w-full" type={inputTypeMapping[type]} name={name} placeholder={placeholder} onChange={updateValue} />
        </div>
    )
}
