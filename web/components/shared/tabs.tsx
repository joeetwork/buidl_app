import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: number;
  setTab: (tab: number) => void;
}

export default function Tabs({ tabs, activeTab, setTab }: TabsProps) {
  const handleTabClick = (tabIndex: number) => {
    setTab(tabIndex);
  };

  return (
    <div role="tablist" className="tabs tabs-boxed w-max">
      {tabs.map((tab, i) => {
        return (
          <a
            key={i}
            role="tab"
            className={`tab ${activeTab === i ? 'tab-active' : ''}`}
            onClick={() => handleTabClick(i)}
          >
            {tab}
          </a>
        );
      })}
    </div>
  );
}
