import { supabase } from "./supabase"

export interface UploadResult {
  url?: string
  error?: string
}

export async function uploadProfileImage(file: File, userId: string): Promise<UploadResult> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/profile.${fileExt}`

    const { data, error } = await supabase.storage.from("profile-images").upload(fileName, file, {
      upsert: true,
    })

    if (error) {
      return { error: error.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (error) {
    return { error: "Failed to upload profile image" }
  }
}

export async function uploadProjectImage(
  file: File,
  userId: string,
  projectId: string,
  index: number,
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${projectId}_${index}.${fileExt}`

    const { data, error } = await supabase.storage.from("project-images").upload(fileName, file, {
      upsert: true,
    })

    if (error) {
      return { error: error.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-images").getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (error) {
    return { error: "Failed to upload project image" }
  }
}

export async function uploadCV(file: File, userId: string): Promise<UploadResult> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/cv.${fileExt}`

    const { data, error } = await supabase.storage.from("cv-files").upload(fileName, file, {
      upsert: true,
    })

    if (error) {
      return { error: error.message }
    }

    // For public files, we can use getPublicUrl instead of signed URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("cv-files").getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (error) {
    return { error: "Failed to upload CV" }
  }
}

export async function deleteFile(bucket: string, fileName: string): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      return { error: error.message }
    }

    return {}
  } catch (error) {
    return { error: "Failed to delete file" }
  }
}
