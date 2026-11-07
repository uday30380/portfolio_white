import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { useData } from '../../context/DataContext';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Save, Shield, Globe, Palette, Activity, Lock, Eye, EyeOff, User } from 'lucide-react';

const AdminSettings = () => {
    const { data, updateData, resetData } = useData();
    const [settings, setSettings] = useState(data.settings || {
        maintenanceMode: false,
        allowChat: true,
        darkMode: false,
        theme: 'light'
    });
    const [prevSettings, setPrevSettings] = useState(data.settings);

    if (data.settings !== prevSettings) {
        setPrevSettings(data.settings);
        if (data.settings) setSettings(data.settings);
    }

    const handleSave = async () => {
        await updateData('settings', settings);
        alert('Configuration saved.');
    };

    return (
        <div className="space-y-6 max-w-4xl text-[#102A28]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Settings</h2>
                    <p className="text-xs text-[#8A9B98]">Global site settings, credentials, and maintenance</p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={resetData}
                        className="btn-secondary !text-[#DC2626]"
                    >
                        Reset defaults
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn-primary"
                    >
                        <Save size={16} />
                        <span>Save settings</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Maintenance Section */}
                <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm space-y-4">
                    <Toggle
                        enabled={settings.maintenanceMode}
                        onChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
                        label="Maintenance mode"
                        sublabel="Show maintenance page to public visitors while working on the site"
                    />

                    {settings.maintenanceMode && (
                        <div className="p-4 bg-[#EEF4F3] border border-[#DDE7E5] rounded-[8px] space-y-3">
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Status message</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-[#DDE7E5] rounded-[6px] h-9 px-3 text-xs text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                        placeholder="e.g. Updating site content"
                                        value={settings.maintenanceMessage || ''}
                                        onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Estimated completion</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-[#DDE7E5] rounded-[6px] h-9 px-3 text-xs text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                        placeholder="e.g. 1 hour"
                                        value={settings.maintenanceTime || ''}
                                        onChange={(e) => setSettings({ ...settings, maintenanceTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Credentials */}
                <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-base font-semibold text-[#102A28] flex items-center gap-2 mb-1">
                            <Shield className="text-[#102A28]" size={18} />
                            <span>Admin credentials</span>
                        </h3>
                        <p className="text-xs text-[#4B5F5C]">Custom username and password for password-based admin login.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Admin username</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" size={15} />
                                <input
                                    type="text"
                                    className="w-full bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] h-10 pl-10 pr-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                    placeholder="admin"
                                    value={settings.adminCredentials?.username || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        adminCredentials: { ...settings.adminCredentials, username: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Admin password</label>
                            <PasswordInput
                                value={settings.adminCredentials?.password || ''}
                                onChange={(val) => setSettings({
                                    ...settings,
                                    adminCredentials: { ...settings.adminCredentials, password: val }
                                })}
                            />
                        </div>
                    </div>
                </div>

                {/* UI Branding */}
                <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-base font-semibold text-[#102A28] flex items-center gap-2 mb-1">
                            <Palette className="text-[#102A28]" size={18} />
                            <span>Theme & branding</span>
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Brand name</label>
                            <input
                                type="text"
                                className="w-full bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28]"
                                value="Uday Kiran Vempati"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Accent color</label>
                            <div className="flex items-center gap-3 p-2 bg-[#F7FAFA] rounded-[8px] border border-[#DDE7E5]">
                                <div className="w-6 h-6 rounded bg-[#102A28]" />
                                <span className="text-xs font-medium text-[#102A28]">#102A28 (Terracotta Accent)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO */}
                <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-base font-semibold text-[#102A28] flex items-center gap-2 mb-1">
                            <Globe className="text-[#102A28]" size={18} />
                            <span>SEO meta details</span>
                        </h3>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Page title</label>
                        <input
                            type="text"
                            placeholder="Uday Kiran Vempati · Full-stack Developer and Designer"
                            value={settings.seoTitle || ''}
                            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Meta description</label>
                        <textarea
                            rows="2"
                            placeholder="Personal portfolio of Uday Kiran Vempati..."
                            value={settings.seoDescription || ''}
                            onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
                        />
                    </div>
                </div>

                {/* Diagnostics */}
                <FirebaseDoctor />
            </div>
        </div>
    );
};

export default AdminSettings;

const Toggle = ({ enabled, onChange, label, sublabel }) => (
    <div className="flex items-center justify-between p-3 bg-[#F7FAFA] rounded-[8px] border border-[#DDE7E5]">
        <div>
            <div className="text-sm font-medium text-[#102A28]">{label}</div>
            <div className="text-xs text-[#8A9B98]">{sublabel}</div>
        </div>
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`w-11 h-6 rounded-full relative transition-colors ${enabled ? 'bg-[#102A28]' : 'bg-[#DDE7E5]'}`}
        >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

const PasswordInput = ({ value, onChange }) => {
    const [show, setShow] = React.useState(false);
    return (
        <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" size={15} />
            <input
                type={show ? "text" : "password"}
                className="w-full bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] h-10 pl-10 pr-10 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                placeholder="••••••••"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9B98] hover:text-[#0F766E]"
            >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </div>
    );
};

const FirebaseDoctor = () => {
    const { data } = useData();
    const [status, setStatus] = useState({ state: 'idle', msg: '' });

    const runDiagnostics = async () => {
        setStatus({ state: 'running', msg: 'Running diagnostics...' });
        const logs = [];
        const log = (m) => logs.push(m);

        try {
            if (!auth.currentUser) throw new Error("Not logged in (Admin auth missing)");
            log("Auth: Authenticated as " + auth.currentUser.email);

            const testRef = doc(db, "content", "_diagnostic_test_");
            try {
                await setDoc(testRef, {
                    test: true,
                    timestamp: Date.now(),
                    agent: 'FirebaseDoctor'
                });
                log("Write permission: Granted (Rules active)");
                await deleteDoc(testRef);
            } catch (e) {
                if (e.code === 'permission-denied') throw new Error("Write permission denied. Check Firestore rules.");
                throw e;
            }

            const cloudRef = doc(db, "content", "portfolioData");
            const cloudSnap = await getDoc(cloudRef);

            if (cloudSnap.exists()) {
                const cloudData = cloudSnap.data();
                const size = JSON.stringify(cloudData).length;
                log(`Cloud data: Found (${size} bytes)`);
            } else {
                log("Cloud data: Document 'portfolioData' not found");
            }

            if (data && data.lastModified) {
                log("Local cache: Present");
            }

            setStatus({ state: 'success', msg: "All systems operational. Database connected." });
            alert(logs.join('\n'));

        } catch (error) {
            console.error("Diagnostic failed:", error);
            setStatus({ state: 'error', msg: error.message });
            alert(error.message);
        }
    };

    return (
        <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm space-y-3">
            <h3 className="text-base font-semibold text-[#102A28] flex items-center gap-2">
                <Activity className="text-[#102A28]" size={18} />
                <span>Connection diagnostics</span>
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs text-[#4B5F5C]">Verify Firebase read/write permissions and connection health.</p>
                <button
                    type="button"
                    onClick={runDiagnostics}
                    className="btn-secondary !h-8 text-xs shrink-0"
                >
                    {status.state === 'running' ? 'Scanning...' : 'Run diagnostics'}
                </button>
            </div>
            {status.msg && (
                <div className={`p-3 rounded-[6px] text-xs font-medium ${status.state === 'error' ? 'bg-[#EEF4F3] text-[#102A28]' : 'bg-[#EEF4F3] text-[#15803D]'}`}>
                    {status.msg}
                </div>
            )}
        </div>
    );
};
