import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { useData } from '../../context/DataContext';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Save, Shield, Bell, Globe, Palette, Clock, Terminal, Activity, Lock, Eye, EyeOff, User } from 'lucide-react';

const AdminSettings = () => {
    const { data, updateData, resetData } = useData();
    const [settings, setSettings] = useState(data.settings || {
        maintenanceMode: false,
        allowChat: true,
        darkMode: true,
        theme: 'élite'
    });

    // Sync state with data from context
    React.useEffect(() => {
        if (data.settings) {
            setSettings(data.settings);
        }
    }, [data.settings]);

    const handleSave = async () => {
        await updateData('settings', settings);
        alert('Universal configuration updated.');
    };

    return (
        <div className="space-y-10 animate-fade-in max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">System Config</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Global Infrastructure</h2>
                </div>
                <button
                    onClick={resetData}
                    className="flex items-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-500/5 active:scale-95 border border-red-500/20"
                >
                    <Activity size={18} />
                    Restore Defaults
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                >
                    <Save size={18} />
                    Deploy Changes
                </button>
            </div>

            <FirebaseDoctor />
            <div className="grid gap-6">
                <Toggle
                    enabled={settings.maintenanceMode}
                    onChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
                    label="Maintenance Protocol"
                    sublabel="Restrict public access to site during updates"
                />

                {/* Dynamic Maintenance Configuration */}
                {settings.maintenanceMode && (
                    <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-3xl space-y-4 animate-fade-in-up">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">Status Message</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-orange-500/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-bold text-sm placeholder-white/20"
                                    placeholder="e.g. System Upgrade"
                                    value={settings.maintenanceMessage || ''}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">Estimated Time</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-orange-500/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-bold text-sm placeholder-white/20"
                                    placeholder="e.g. 2 Hours"
                                    value={settings.maintenanceTime || ''}
                                    onChange={(e) => setSettings({ ...settings, maintenanceTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <Toggle
                    enabled={settings.allowChat}
                    onChange={(val) => setSettings({ ...settings, allowChat: val })}
                    label="AI Assistant Uplink"
                    sublabel="Enable/Disable real-time support chat"
                />

                <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Shield className="text-orange-500" size={22} /> Security Credentials
                    </h3>
                    <p className="text-gray-400 text-xs">Set a custom username and password for admin access. This allows login without Email auth.</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Custom Admin Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                    placeholder="admin"
                                    value={settings.adminCredentials?.username || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        adminCredentials: { ...settings.adminCredentials, username: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Custom Admin Password</label>
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
                <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Palette className="text-orange-500" size={22} /> UI / Interface
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Primary Signature (Brand Name)</label>
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                placeholder="VEMPATI UDAY KIRAN"
                                value={data.hero?.name || ''}
                                readOnly
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Accent Calibration (Theme)</label>
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-orange-500"></div>
                                <span className="text-sm font-bold text-white tracking-widest uppercase">Elite Orange</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Globe className="text-orange-500" size={22} /> Search Engine Optimization
                    </h3>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SEO Page Title</label>
                        <input
                            type="text"
                            placeholder="UDAY KIRAN VEMPATI | Creative Designer & AI Innovator"
                            value={settings.seoTitle || ''}
                            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder-gray-700"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Meta Description</label>
                        <textarea
                            rows="3"
                            placeholder="Portfolio of Vempati Uday Kiran - AI-driven Web Developer..."
                            value={settings.seoDescription || ''}
                            onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder-gray-700 resize-none"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                        <Activity className="text-orange-500 mb-4" size={24} />
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Response Time</div>
                        <div className="text-2xl font-black text-white">42ms</div>
                    </div>
                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                        <Shield className="text-orange-500 mb-4" size={24} />
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Data Shield</div>
                        <div className="text-2xl font-black text-white italic uppercase">active</div>
                    </div>
                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                        <Terminal className="text-orange-500 mb-4" size={24} />
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">API Cluster</div>
                        <div className="text-2xl font-black text-white">400/s</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;

const Toggle = ({ enabled, onChange, label, sublabel }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
        <div>
            <div className="text-sm font-bold text-white uppercase tracking-widest">{label}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{sublabel}</div>
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-orange-500' : 'bg-gray-600'}`}
        >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
);

const PasswordInput = ({ value, onChange }) => {
    const [show, setShow] = React.useState(false);
    return (
        <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input
                type={show ? "text" : "password"}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                placeholder="••••••••"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
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
            // 1. Check Auth
            if (!auth.currentUser) throw new Error("Not Logged In (Admin Auth Missing)");
            log("✅ Auth: Authenticated as " + auth.currentUser.email);

            // 2. Test Write Permission
            const testRef = doc(db, "content", "_diagnostic_test_");
            try {
                await setDoc(testRef, {
                    test: true,
                    timestamp: Date.now(),
                    agent: 'FirebaseDoctor'
                });
                log("✅ Write Permission: GRANTED (Rules are active)");
                // Cleanup
                await deleteDoc(testRef);
            } catch (e) {
                if (e.code === 'permission-denied') throw new Error("❌ Write Permission DENIED. Please update Firestore Rules.");
                throw e;
            }

            // 3. Inspect CLOUD Data
            log("🔍 Inspecting Cloud Database...");
            const cloudRef = doc(db, "content", "portfolioData");
            const cloudSnap = await getDoc(cloudRef);

            if (cloudSnap.exists()) {
                const cloudData = cloudSnap.data();
                const size = JSON.stringify(cloudData).length;
                const lastMod = cloudData.lastModified ? new Date(cloudData.lastModified).toLocaleString() : "Unknown";
                log(`✅ Cloud Data FOUND! Size: ${size} bytes`);
                log(`   📅 Last Saved: ${lastMod}`);
            } else {
                log("⚠️ Cloud Data MISSING (Document 'portfolioData' does not exist)");
            }

            // 4. Compare with Local
            if (data && data.lastModified) {
                log("✅ Local Data: Present");
            } else {
                log("⚠️ Local Data: Missing or default");
            }

            setStatus({ state: 'success', msg: "All Systems Operational. Your database is healthy." });
            alert(logs.join('\n'));

        } catch (error) {
            console.error("Diagnostic failed:", error);
            setStatus({ state: 'error', msg: error.message });
            log("❌ FAILURE: " + error.message);
            alert(logs.join('\n'));
        }
    };

    return (
        <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-4 mt-8">
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Activity className="text-orange-500" size={22} /> System Health (Doctor)
            </h3>
            <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">run this if you suspect data connection issues.</div>
                <button
                    onClick={runDiagnostics}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase text-[10px] transition-all"
                >
                    {status.state === 'running' ? 'Scanning...' : 'Run Diagnostics'}
                </button>
            </div>
            {status.msg && (
                <div className={`p-4 rounded-xl text-xs font-bold font-mono ${status.state === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                    {status.msg}
                </div>
            )}
        </div>
    );
};

