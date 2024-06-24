import { useState } from 'react';

interface TablistProps {
    tabs: string[];
    sizing?: 'xs' | 'sm' | 'md' | 'lg';
    amount?: number;
}

const Tablist: React.FC<TablistProps> = ({ tabs, sizing = 'xs', amount = tabs.length }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const sizeClasses: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
        xs: 'text-xs px-1 py-0.5',
        sm: 'text-sm px-2 py-1',
        md: 'text-md px-3 py-1.5',
        lg: 'text-lg px-4 py-2',
    };

    return (
        <div>
            <div className="p-1 rounded-md border border-secondary justify-center items-center inline-flex gap-1">
                {tabs.slice(0, amount).map((tab) => (
                    <div
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`rounded justify-center items-center flex hover:bg-tertiary ${activeTab === tab ? 'bg-tertiary' : 'opacity-50'
                            } ${sizeClasses[sizing]}`}
                    >
                        <div className="text-white">{tab}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tablist;
