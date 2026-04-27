"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, ShieldOff, Plus, X, Loader2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FluidDropdown } from "@/components/ui/fluid-dropdown"
import { formatDate } from "@/lib/utils"

type Plan = "starter" | "pro" | "enterprise"

const planOptions = [
  { value: "starter", label: "Starter (gratuit)" },
  { value: "pro", label: "Pro — 49€/mois" },
  { value: "enterprise", label: "Enterprise — 199€/mois" },
]

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  subscriptions: Array<{ plan: Plan; status: string; current_period_end: string | null }> | null
}

// ─── Petit modale réutilisable ──────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full h-10 px-3 rounded-lg text-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"

// ─── Modale Créer un utilisateur ──────────────────────────
function CreateUserModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ email: "", password: "", fullName: "", plan: "starter" as Plan, durationDays: "0" })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    startTransition(async () => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, durationDays: Number(form.durationDays) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      onClose()
      router.refresh()
    })
  }

  return (
    <Modal title="Créer un utilisateur" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <Field label="Nom complet">
          <input className={inputCls} placeholder="Jean Dupont" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
        </Field>
        <Field label="Adresse email *">
          <input className={inputCls} type="email" required placeholder="jean@exemple.fr" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </Field>
        <Field label="Mot de passe *">
          <input className={inputCls} type="password" required placeholder="Minimum 6 caractères" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </Field>
        <Field label="Plan attribué">
          <FluidDropdown options={planOptions} value={form.plan} onChange={v => setForm(f => ({ ...f, plan: v as Plan }))} />
        </Field>
        <Field label="Durée d'activation (jours) — 0 = illimitée">
          <input className={inputCls} type="number" min="0" max="3650" placeholder="0" value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))} />
        </Field>
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? <Loader2 size={15} className="animate-spin mr-2" /> : <UserPlus size={15} className="mr-2" />}
            Créer le compte
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Modale Modifier le plan ────────────────────────────────
function EditPlanModal({ user, onClose }: { user: User; onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const sub = user.subscriptions?.[0]
  const [plan, setPlan] = useState<Plan>((sub?.plan ?? "starter") as Plan)
  const [durationDays, setDurationDays] = useState("0")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    startTransition(async () => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "update_plan", plan, durationDays: Number(durationDays) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      onClose()
      router.refresh()
    })
  }

  return (
    <Modal title={`Modifier le plan — ${user.full_name ?? user.email}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <Field label="Plan">
          <FluidDropdown options={planOptions} value={plan} onChange={v => setPlan(v as Plan)} />
        </Field>
        <Field label="Nouvelle durée (jours) — 0 = illimitée">
          <input className={inputCls} type="number" min="0" max="3650" placeholder="0" value={durationDays} onChange={e => setDurationDays(e.target.value)} />
        </Field>
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending && <Loader2 size={15} className="animate-spin mr-2" />}
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Modale Révoquer ────────────────────────────────────────
function RevokeModal({ user, onClose }: { user: User; onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleRevoke = () => {
    startTransition(async () => {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "revoke" }),
      })
      onClose()
      router.refresh()
    })
  }

  return (
    <Modal title="Révoquer l'accès" onClose={onClose}>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
        Le compte de <strong className="text-slate-900 dark:text-white">{user.email}</strong> sera rétrogradé au plan <strong>Starter</strong> et marqué comme annulé. L'utilisateur ne pourra plus accéder aux fonctionnalités payantes.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
        <Button variant="destructive" className="flex-1" onClick={handleRevoke} disabled={pending}>
          {pending && <Loader2 size={15} className="animate-spin mr-2" />}
          Révoquer l'accès
        </Button>
      </div>
    </Modal>
  )
}

// ─── Modale Supprimer le compte ─────────────────────────────
function DeleteModal({ user, onClose }: { user: User; onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [confirm, setConfirm] = useState("")

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/admin/users?userId=${user.id}`, { method: "DELETE" })
      onClose()
      router.refresh()
    })
  }

  return (
    <Modal title="Supprimer le compte" onClose={onClose}>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Cette action est <strong className="text-red-500">irréversible</strong>. Toutes les données de <strong className="text-slate-900 dark:text-white">{user.email}</strong> seront supprimées définitivement.
      </p>
      <Field label={`Tapez "${user.email}" pour confirmer`}>
        <input className={inputCls} placeholder={user.email} value={confirm} onChange={e => setConfirm(e.target.value)} />
      </Field>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
        <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={confirm !== user.email || pending}>
          {pending && <Loader2 size={15} className="animate-spin mr-2" />}
          Supprimer définitivement
        </Button>
      </div>
    </Modal>
  )
}

// ─── Table principale ───────────────────────────────────────
const planBadge: Record<string, "default" | "secondary" | "warning"> = {
  starter: "secondary", pro: "default", enterprise: "warning",
}

export function UserActionsClient({ users }: { users: User[] }) {
  const [modal, setModal] = useState<{ type: "create" | "edit" | "revoke" | "delete"; user?: User } | null>(null)

  return (
    <>
      {/* Bouton créer */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Gestion des utilisateurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{users.length} compte{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setModal({ type: "create" })}>
          <Plus size={15} className="mr-2" />
          Créer un utilisateur
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                {["Nom / Email", "Plan", "Statut", "Expire le", "Rôle", "Inscription", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">Aucun utilisateur</td>
                </tr>
              ) : users.map((u) => {
                const sub = u.subscriptions?.[0]
                const expired = sub?.current_period_end
                  ? new Date(sub.current_period_end) < new Date()
                  : false
                return (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{u.full_name ?? "—"}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {sub ? <Badge variant={planBadge[sub.plan] ?? "secondary"}>{sub.plan}</Badge> : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {sub ? (
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          sub.status === "active" && !expired
                            ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sub.status === "active" && !expired ? "bg-green-500" : "bg-red-500"}`} />
                          {expired ? "Expiré" : sub.status === "active" ? "Actif" : "Révoqué"}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {sub?.current_period_end ? formatDate(sub.current_period_end) : "Illimitée"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal({ type: "edit", user: u })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all cursor-pointer"
                          title="Modifier le plan"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setModal({ type: "revoke", user: u })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all cursor-pointer"
                          title="Révoquer l'accès"
                        >
                          <ShieldOff size={13} />
                        </button>
                        <button
                          onClick={() => setModal({ type: "delete", user: u })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Supprimer le compte"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {modal?.type === "create" && <CreateUserModal onClose={() => setModal(null)} />}
      {modal?.type === "edit" && modal.user && <EditPlanModal user={modal.user} onClose={() => setModal(null)} />}
      {modal?.type === "revoke" && modal.user && <RevokeModal user={modal.user} onClose={() => setModal(null)} />}
      {modal?.type === "delete" && modal.user && <DeleteModal user={modal.user} onClose={() => setModal(null)} />}
    </>
  )
}
