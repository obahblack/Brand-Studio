import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface UploadResult {
  url: string
  path: string
}

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function uploadToStorage(
  bucket: string,
  path: string,
  file: Buffer,
  contentType: string
): Promise<UploadResult> {
  // Local file storage for demo mode
  const fullPath = join(UPLOAD_DIR, bucket, path)
  const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  writeFileSync(fullPath, file)

  return {
    url: `/uploads/${bucket}/${path}`,
    path
  }
}

export async function uploadAsset(
  brandKitId: string,
  assetType: string,
  assetName: string,
  file: Buffer,
  contentType: string
): Promise<UploadResult> {
  const path = `${brandKitId}/${assetType}/${assetName}`
  return uploadToStorage('assets', path, file, contentType)
}

export async function uploadLogo(
  brandKitId: string,
  file: Buffer,
  contentType: string,
  extension: string
): Promise<UploadResult> {
  const path = `logos/${brandKitId}/logo.${extension}`
  return uploadToStorage('logos', path, file, contentType)
}
