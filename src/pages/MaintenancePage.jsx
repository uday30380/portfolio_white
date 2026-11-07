import React from 'react';
import { useData } from '../context/DataContext';
import { Settings, Clock } from 'lucide-react';

const MaintenancePage = () => {
    const { data } = useData();
    const message = data?.settings?.maintenanceMessage || "Updating the site with new work";
    const time = data?.settings?.maintenanceTime || "shortly";

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white border border-[#DDE7E5] rounded-[12px] p-8 shadow-sm text-center">
                <div className="w-14 h-14 bg-[#E6F4F2] text-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Settings size={26} />
                </div>

                <span className="inline-block px-2.5 py-1 bg-[#E6F4F2] text-[#0F766E] text-xs font-medium rounded-[6px] mb-4">
                    Maintenance in progress
                </span>

                <h1 className="text-2xl font-semibold text-[#102A28] mb-3">
                    Under scheduled maintenance
                </h1>

                <p className="text-base text-[#4B5F5C] leading-relaxed mb-6">
                    {message}
                </p>

                <div className="p-4 bg-[#EEF4F3] rounded-[8px] border border-[#DDE7E5] text-xs text-[#4B5F5C] flex items-center justify-center gap-2 mb-6">
                    <Clock size={15} className="text-[#0F766E]" />
                    <span>Estimated completion: <strong className="text-[#102A28]">{time}</strong></span>
                </div>

                <p className="text-xs text-[#8A9B98]">
                    Uday Kiran Vempati &bull; Full-stack developer and designer
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
