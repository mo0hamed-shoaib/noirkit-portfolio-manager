export interface PersonalInfo {
  id: string
  name: string
  jobTitle: string
  bio: string
  profileImage: string
  cvFile?: string
  email?: string
  phone?: string
  location?: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}

export interface Project {
  id: string
  name: string
  description: string
  deployLink?: string
  githubLink?: string
  techStack: string[]
  images: string[]
  order: number
}

export interface TechStack {
  id: string
  name: string
  icon: string
  order: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: "education" | "achievement"
  order: number
}

export interface ContactForm {
  id: string
  title: string
  description: string
  fields: ContactField[]
  showContactInfo: boolean
}

export interface ContactField {
  id: string
  name: string
  label: string
  type: "text" | "email" | "textarea"
  required: boolean
  placeholder?: string
}
