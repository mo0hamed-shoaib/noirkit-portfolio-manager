"use client"

import { create } from "zustand"
import { supabase } from "./supabase"
import type { PersonalInfo, SocialLink, Project, TechStack, Achievement, ContactForm, ContactField } from "./types"

interface PortfolioStore {
  personalInfo: PersonalInfo | null
  socialLinks: SocialLink[]
  projects: Project[]
  techStack: TechStack[]
  achievements: Achievement[]
  contactForm: ContactForm | null
  loading: boolean
  error: string | null

  // Actions
  fetchAllData: () => Promise<void>
  updatePersonalInfo: (info: Partial<PersonalInfo>) => Promise<void>

  // Social Links
  addSocialLink: (link: Omit<SocialLink, "id">) => Promise<void>
  updateSocialLink: (id: string, link: Partial<SocialLink>) => Promise<void>
  deleteSocialLink: (id: string) => Promise<void>
  reorderSocialLinks: (links: SocialLink[]) => Promise<void>

  // Projects
  addProject: (project: Omit<Project, "id">) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  reorderProjects: (projects: Project[]) => Promise<void>

  // Tech Stack
  addTechStack: (tech: Omit<TechStack, "id">) => Promise<void>
  updateTechStack: (id: string, tech: Partial<TechStack>) => Promise<void>
  deleteTechStack: (id: string) => Promise<void>
  reorderTechStack: (techStack: TechStack[]) => Promise<void>

  // Achievements
  addAchievement: (achievement: Omit<Achievement, "id">) => Promise<void>
  updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<void>
  deleteAchievement: (id: string) => Promise<void>
  reorderAchievements: (achievements: Achievement[]) => Promise<void>

  // Contact Form
  updateContactForm: (form: Partial<ContactForm>) => Promise<void>
  addContactField: (field: Omit<ContactField, "id">) => Promise<void>
  updateContactField: (id: string, field: Partial<ContactField>) => Promise<void>
  deleteContactField: (id: string) => Promise<void>
  reorderContactFields: (fields: ContactField[]) => Promise<void>
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  personalInfo: null,
  socialLinks: [],
  projects: [],
  techStack: [],
  achievements: [],
  contactForm: null,
  loading: false,
  error: null,

  fetchAllData: async () => {
    set({ loading: true, error: null })

    try {
      // Check if user is authenticated (for edit permissions)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // For public portfolio, fetch the first available profile
      // This allows both authenticated and public users to see the portfolio
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single()

      if (profilesError || !profiles) {
        set({ loading: false })
        return
      }

      const userId = profiles.id

      // Fetch personal info
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      // Fetch social links
      const { data: socialLinks, error: socialError } = await supabase
        .from("social_links")
        .select("*")
        .eq("user_id", userId)
        .order("order_index")

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("order_index")

      // Fetch tech stack
      const { data: techStack, error: techError } = await supabase
        .from("tech_stack")
        .select("*")
        .eq("user_id", userId)
        .order("order_index")

      // Fetch achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("order_index")

      // Fetch contact form
      const { data: contactForm, error: contactError } = await supabase
        .from("contact_form")
        .select(`
          *,
          contact_form_fields (*)
        `)
        .eq("user_id", userId)
        .single()

      // Transform data
      const transformedPersonalInfo: PersonalInfo = profile
        ? {
            id: profile.id,
            name: profile.name || "",
            jobTitle: profile.job_title || "",
            bio: profile.bio || "",
            profileImage: profile.profile_image || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            cvFile: profile.cv_file || "",
          }
        : {
            id: "",
            name: "",
            jobTitle: "",
            bio: "",
            profileImage: "",
            email: "",
            phone: "",
            location: "",
            cvFile: "",
          }

      const transformedSocialLinks: SocialLink[] =
        socialLinks?.map((link) => ({
          id: link.id,
          platform: link.platform,
          url: link.url,
          icon: link.icon,
          order: link.order_index,
        })) || []

      const transformedProjects: Project[] =
        projects?.map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          deployLink: project.deploy_link || "",
          githubLink: project.github_link || "",
          techStack: project.tech_stack || [],
          images: project.images || [],
          order: project.order_index,
        })) || []

      const transformedTechStack: TechStack[] =
        techStack?.map((tech) => ({
          id: tech.id,
          name: tech.name,
          icon: tech.icon,
          order: tech.order_index,
        })) || []

      const transformedAchievements: Achievement[] =
        achievements?.map((achievement) => ({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          type: achievement.type as "education" | "achievement",
          order: achievement.order_index,
        })) || []

      const transformedContactForm: ContactForm | null = contactForm
        ? {
            id: contactForm.id,
            title: contactForm.title || "Get In Touch",
            description: contactForm.description || "Let's discuss your next project",
            showContactInfo: contactForm.show_contact_info || false,
            fields:
              contactForm.contact_form_fields?.map((field: any) => ({
                id: field.id,
                name: field.name,
                label: field.label,
                type: field.type,
                required: field.required,
                placeholder: field.placeholder,
              })) || [],
          }
        : {
            id: "",
            title: "Get In Touch",
            description: "Let's discuss your next project",
            showContactInfo: false,
            fields: [],
          }

      set({
        personalInfo: transformedPersonalInfo,
        socialLinks: transformedSocialLinks,
        projects: transformedProjects,
        techStack: transformedTechStack,
        achievements: transformedAchievements,
        contactForm: transformedContactForm,
        loading: false,
      })
    } catch (error: any) {
      console.error("Error fetching data:", error)
      set({ error: error.message, loading: false })
    }
  },

  updatePersonalInfo: async (info: Partial<PersonalInfo>) => {
    const { personalInfo } = get()
    if (!personalInfo?.id) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: info.name,
          job_title: info.jobTitle,
          bio: info.bio,
          profile_image: info.profileImage,
          email: info.email,
          phone: info.phone,
          location: info.location,
          cv_file: info.cvFile,
        })
        .eq("id", personalInfo.id)

      if (error) throw error

      set((state) => ({
        personalInfo: state.personalInfo
          ? { ...state.personalInfo, ...info }
          : null,
      }))
    } catch (error: any) {
      console.error("Error updating personal info:", error)
      throw error
    }
  },

  addSocialLink: async (link) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No authenticated user")

      const { data, error } = await supabase
        .from("social_links")
        .insert({
          user_id: user.id,
          platform: link.platform,
          url: link.url,
          icon: link.icon,
          order_index: get().socialLinks.length,
        })
        .select()
        .single()

      if (error) throw error

      const newLink: SocialLink = {
        id: data.id,
        platform: data.platform,
        url: data.url,
        icon: data.icon,
      }

      set((state) => ({
        socialLinks: [...state.socialLinks, newLink],
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateSocialLink: async (id, link) => {
    try {
      const { error } = await supabase
        .from("social_links")
        .update({
          platform: link.platform,
          url: link.url,
          icon: link.icon,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        socialLinks: state.socialLinks.map((l) => (l.id === id ? { ...l, ...link } : l)),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteSocialLink: async (id) => {
    try {
      const { error } = await supabase.from("social_links").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        socialLinks: state.socialLinks.filter((l) => l.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  reorderSocialLinks: async (links) => {
    try {
      // Update each link individually to avoid RLS issues
      for (let i = 0; i < links.length; i++) {
        const { error } = await supabase.from("social_links").update({ order_index: i }).eq("id", links[i].id)

        if (error) throw error
      }

      set({ socialLinks: links })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  addProject: async (project) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No authenticated user")

      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: project.name,
          description: project.description,
          deploy_link: project.deployLink,
          github_link: project.githubLink,
          tech_stack: project.techStack,
          images: project.images,
          order_index: get().projects.length,
        })
        .select()
        .single()

      if (error) throw error

      const newProject: Project = {
        id: data.id,
        name: data.name,
        description: data.description,
        deployLink: data.deploy_link,
        githubLink: data.github_link,
        techStack: data.tech_stack || [],
        images: data.images || [],
        order: data.order_index,
      }

      set((state) => ({
        projects: [...state.projects, newProject],
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateProject: async (id, project) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: project.name,
          description: project.description,
          deploy_link: project.deployLink,
          github_link: project.githubLink,
          tech_stack: project.techStack,
          images: project.images,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  reorderProjects: async (projects) => {
    try {
      // Update each project individually to avoid RLS issues
      for (let i = 0; i < projects.length; i++) {
        const { error } = await supabase.from("projects").update({ order_index: i }).eq("id", projects[i].id)

        if (error) throw error
      }

      set({ projects })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  addTechStack: async (tech) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No authenticated user")

      const { data, error } = await supabase
        .from("tech_stack")
        .insert({
          user_id: user.id,
          name: tech.name,
          icon: tech.icon,
          order_index: get().techStack.length,
        })
        .select()
        .single()

      if (error) throw error

      const newTech: TechStack = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        order: data.order_index,
      }

      set((state) => ({
        techStack: [...state.techStack, newTech],
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateTechStack: async (id, tech) => {
    try {
      const { error } = await supabase
        .from("tech_stack")
        .update({
          name: tech.name,
          icon: tech.icon,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        techStack: state.techStack.map((t) => (t.id === id ? { ...t, ...tech } : t)),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteTechStack: async (id) => {
    try {
      const { error } = await supabase.from("tech_stack").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        techStack: state.techStack.filter((t) => t.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  reorderTechStack: async (techStack) => {
    try {
      // Update each tech individually to avoid RLS issues
      for (let i = 0; i < techStack.length; i++) {
        const { error } = await supabase.from("tech_stack").update({ order_index: i }).eq("id", techStack[i].id)

        if (error) throw error
      }

      set({ techStack })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  addAchievement: async (achievement) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No authenticated user")

      const { data, error } = await supabase
        .from("achievements")
        .insert({
          user_id: user.id,
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          type: achievement.type,
          order_index: get().achievements.length,
        })
        .select()
        .single()

      if (error) throw error

      const newAchievement: Achievement = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        type: data.type,
        order: data.order_index,
      }

      set((state) => ({
        achievements: [...state.achievements, newAchievement],
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateAchievement: async (id, achievement) => {
    try {
      const { error } = await supabase
        .from("achievements")
        .update({
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          type: achievement.type,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        achievements: state.achievements.map((a) => (a.id === id ? { ...a, ...achievement } : a)),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteAchievement: async (id) => {
    try {
      const { error } = await supabase.from("achievements").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        achievements: state.achievements.filter((a) => a.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  reorderAchievements: async (achievements) => {
    try {
      // Update each achievement individually to avoid RLS issues
      for (let i = 0; i < achievements.length; i++) {
        const { error } = await supabase.from("achievements").update({ order_index: i }).eq("id", achievements[i].id)

        if (error) throw error
      }

      set({ achievements })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateContactForm: async (form) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No authenticated user")

      const currentContactForm = get().contactForm

      let data
      let error

      if (currentContactForm && currentContactForm.id) {
        // Update existing contact form
        const result = await supabase
          .from("contact_form")
          .update({
            title: form.title,
            description: form.description,
            show_contact_info: form.showContactInfo,
          })
          .eq("id", currentContactForm.id)
          .select()
          .single()
        
        data = result.data
        error = result.error
      } else {
        // Create new contact form
        const result = await supabase
          .from("contact_form")
          .insert({
            user_id: user.id,
            title: form.title,
            description: form.description,
            show_contact_info: form.showContactInfo,
          })
          .select()
          .single()
        
        data = result.data
        error = result.error
      }

      if (error) throw error

      set((state) => ({
        contactForm: state.contactForm 
          ? { 
              ...state.contactForm, 
              ...form,
              id: data.id 
            } 
          : {
              id: data.id,
              title: form.title || "Get In Touch",
              description: form.description || "Let's discuss your next project",
              showContactInfo: form.showContactInfo || false,
              fields: []
            },
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  addContactField: async (field) => {
    try {
      let contactForm = get().contactForm
      
      // If no contact form exists, create one first
      if (!contactForm || !contactForm.id) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("No authenticated user")

        // Check if there's an existing contact form for this user
        const { data: existingForms, error: fetchError } = await supabase
          .from("contact_form")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)

        if (fetchError) throw fetchError

        if (existingForms && existingForms.length > 0) {
          // Use existing contact form
          const existingForm = existingForms[0]
          contactForm = {
            id: existingForm.id,
            title: existingForm.title,
            description: existingForm.description,
            showContactInfo: existingForm.show_contact_info,
            fields: [],
          }
        } else {
          // Create new contact form
          const { data: newContactForm, error: createError } = await supabase
            .from("contact_form")
            .insert({
              user_id: user.id,
              title: "Get In Touch",
              description: "Let's discuss your next project",
              show_contact_info: false,
            })
            .select()
            .single()

          if (createError) throw createError

          contactForm = {
            id: newContactForm.id,
            title: newContactForm.title,
            description: newContactForm.description,
            showContactInfo: newContactForm.show_contact_info,
            fields: [],
          }
        }

        set((state) => ({
          contactForm,
        }))
      }

      const { data, error } = await supabase
        .from("contact_form_fields")
        .insert({
          contact_form_id: contactForm.id,
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required,
          placeholder: field.placeholder,
          order_index: contactForm.fields.length,
        })
        .select()
        .single()

      if (error) throw error

      const newField: ContactField = {
        id: data.id,
        name: data.name,
        label: data.label,
        type: data.type,
        required: data.required,
        placeholder: data.placeholder,
      }

      set((state) => ({
        contactForm: state.contactForm
          ? {
              ...state.contactForm,
              fields: [...state.contactForm.fields, newField],
            }
          : null,
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  updateContactField: async (id, field) => {
    try {
      const { error } = await supabase
        .from("contact_form_fields")
        .update({
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required,
          placeholder: field.placeholder,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        contactForm: state.contactForm
          ? {
              ...state.contactForm,
              fields: state.contactForm.fields.map((f) => (f.id === id ? { ...f, ...field } : f)),
            }
          : null,
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteContactField: async (id) => {
    try {
      const { error } = await supabase.from("contact_form_fields").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        contactForm: state.contactForm
          ? {
              ...state.contactForm,
              fields: state.contactForm.fields.filter((f) => f.id !== id),
            }
          : null,
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  reorderContactFields: async (fields) => {
    try {
      // Update each field individually to avoid RLS issues
      for (let i = 0; i < fields.length; i++) {
        const { error } = await supabase.from("contact_form_fields").update({ order_index: i }).eq("id", fields[i].id)

        if (error) throw error
      }

      set((state) => ({
        contactForm: state.contactForm
          ? {
              ...state.contactForm,
              fields,
            }
          : null,
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },
}))
