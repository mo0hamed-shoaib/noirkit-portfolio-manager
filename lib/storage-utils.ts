import { supabase } from './supabase'

export interface StorageFile {
  name: string
  created_at: string
  updated_at: string
  metadata: any
  bucket_id: string
}

export interface DatabaseFile {
  id: string
  name: string
  created_at: string
  updated_at: string
  size: number
  type: string
  field_name?: string // To track which field this file is stored in
}

export async function listProfileImages(userId?: string): Promise<DatabaseFile[]> {
  try {
    console.log('Listing profile images for user:', userId || 'all users')
    
    let query = supabase
      .from('profiles')
      .select('id, profile_image, updated_at')
      .not('profile_image', 'is', null)

    if (userId) {
      query = query.eq('id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error listing profile images:', error)
      return []
    }

    const files = data?.map(profile => ({
      id: profile.id,
      name: 'profile-image.jpg',
      created_at: profile.updated_at,
      updated_at: profile.updated_at,
      size: profile.profile_image ? Math.round(profile.profile_image.length * 0.75) : 0, // Approximate base64 size
      type: 'image/jpeg',
      field_name: 'profile_image'
    })) || []

    console.log('Profile images found:', files.length)
    return files
  } catch (error) {
    console.error('Failed to list profile images:', error)
    return []
  }
}

export async function listProjectImages(userId?: string): Promise<DatabaseFile[]> {
  try {
    let query = supabase
      .from('projects')
      .select('id, project_image, updated_at')
      .not('project_image', 'is', null)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error listing project images:', error)
      return []
    }

    const files = data?.map(project => ({
      id: project.id,
      name: 'project-image.jpg',
      created_at: project.updated_at,
      updated_at: project.updated_at,
      size: project.project_image ? Math.round(project.project_image.length * 0.75) : 0, // Approximate base64 size
      type: 'image/jpeg',
      field_name: 'project_image'
    })) || []

    return files
  } catch (error) {
    console.error('Failed to list project images:', error)
    return []
  }
}

export async function listCVFiles(userId?: string): Promise<DatabaseFile[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('id, cv_file, updated_at')
      .not('cv_file', 'is', null)

    if (userId) {
      query = query.eq('id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error listing CV files:', error)
      return []
    }

    const files = data?.map(profile => ({
      id: profile.id,
      name: 'cv-file.pdf',
      created_at: profile.updated_at,
      updated_at: profile.updated_at,
      size: profile.cv_file ? Math.round(profile.cv_file.length * 0.75) : 0, // Approximate base64 size
      type: 'application/pdf',
      field_name: 'cv_file'
    })) || []

    return files
  } catch (error) {
    console.error('Failed to list CV files:', error)
    return []
  }
}

export async function deleteProfileImage(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_image: null })
      .eq('id', userId)

    if (error) {
      console.error('Error deleting profile image:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete profile image:', error)
    return { success: false, error: 'Failed to delete profile image' }
  }
}

export async function deleteProjectImage(projectId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('projects')
      .update({ project_image: null })
      .eq('id', projectId)

    if (error) {
      console.error('Error deleting project image:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete project image:', error)
    return { success: false, error: 'Failed to delete project image' }
  }
}

export async function deleteCVFile(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ cv_file: null })
      .eq('id', userId)

    if (error) {
      console.error('Error deleting CV file:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete CV file:', error)
    return { success: false, error: 'Failed to delete CV file' }
  }
}

export async function getStorageStats(): Promise<{
  profileImages: number
  projectImages: number
  cvFiles: number
}> {
  try {
    console.log('Getting storage stats from database...')
    
    const [profileImages, projectImages, cvFiles] = await Promise.all([
      listProfileImages(),
      listProjectImages(),
      listCVFiles(),
    ])

    const stats = {
      profileImages: profileImages.length,
      projectImages: projectImages.length,
      cvFiles: cvFiles.length,
    }

    console.log('Storage stats:', stats)
    return stats
  } catch (error) {
    console.error('Failed to get storage stats:', error)
    return {
      profileImages: 0,
      projectImages: 0,
      cvFiles: 0,
    }
  }
} 