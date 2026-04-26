"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { User, CreditCard, Bell } from "lucide-react"
import { ProfileSettings } from "@/components/dashboard/settings/profile"
import { BillingSettings } from "@/components/dashboard/settings/billing"

const tabs = [
  { id: "profile", label: "Profil", icon: User },
  { id: "billing", label: "Facturation", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
]

function SettingsContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "profile")

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Paramètres</h1>
        <p className="text-slate-400 text-sm">Gérez votre compte et vos préférences</p>
      </div>

      <div className="flex gap-1 border-b border-white/10 pb-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px ${
              activeTab === id
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && <ProfileSettings />}
      {activeTab === "billing" && <BillingSettings />}
      {activeTab === "notifications" && (
        <div className="glass-card p-6 border-white/10 text-slate-400 text-sm">
          Les préférences de notification seront disponibles prochainement.
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="space-y-6 max-w-3xl animate-pulse" />}>
      <SettingsContent />
    </Suspense>
  )
}
