export interface PresentSlide {
  id: string
  index: number
  title: string
  keyPoints: string[]
  type: "cover" | "content" | "closing"
}

export interface PresentationData {
  id: string
  title: string
  slides: PresentSlide[]
  createdAt: string
}

export type BroadcastMsg =
  | { type: "SLIDE_CHANGE"; index: number }
  | { type: "STATE_SYNC"; index: number }
