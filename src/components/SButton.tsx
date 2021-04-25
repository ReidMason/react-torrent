import React from 'react';

interface SButtonProps {
    children?: React.ReactNode;
    onClick: Function;
    bgColour?: String;
    bgHover?: String;
    textColour?: String;
}

export default function SButton({ children, onClick, bgColour, textColour, bgHover }: SButtonProps) {
    bgColour = bgColour ?? "nord-10";
    bgHover = bgHover ?? "nord-9";
    textColour = textColour ?? "nord-6";

    return (
        <div>
            <button className={`bg-${bgColour} text-${textColour} hover:bg-${bgHover} focus:outline-none focus:bg-${bgHover} p-2 px-4 rounded max-w-md`} onClick={() => { onClick() }}>{children}</button>
        </div>
    )
}
