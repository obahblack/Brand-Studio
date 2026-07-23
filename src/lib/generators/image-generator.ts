import { openai } from '@/lib/openai'
import type { DesignSystem } from '@/types/database'

interface GenerateImageInput {
  prompt: string
  style?: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
}

export async function generateImage(input: GenerateImageInput): Promise<Buffer> {
  const { prompt, size = '1024x1024' } = input

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size,
    quality: 'hd',
    response_format: 'b64_json'
  })

  const imageData = response.data?.[0]
  if (!imageData || !imageData.b64_json) {
    throw new Error('Failed to generate image')
  }

  return Buffer.from(imageData.b64_json, 'base64')
}

export async function generateBrandBackground(
  designSystem: DesignSystem,
  brandName: string
): Promise<Buffer> {
  const primaryColor = designSystem.colors.primary['500']
  const secondaryColor = designSystem.colors.secondary?.['500'] || designSystem.colors.primary['600']
  
  const prompt = `Abstract gradient background for ${brandName} brand, 
    using colors ${primaryColor} and ${secondaryColor}, 
    modern minimalist style, clean and professional, 
    suitable for marketing materials, high quality, 4k`

  return generateImage({ 
    prompt, 
    size: '1792x1024' 
  })
}

export async function generateSocialBackground(
  designSystem: DesignSystem,
  platform: string
): Promise<Buffer> {
  const primaryColor = designSystem.colors.primary['500']
  
  const prompts: Record<string, string> = {
    'linkedin': `Professional abstract background for LinkedIn post, gradient with ${primaryColor}, modern corporate style, minimal geometric shapes`,
    'instagram': `Vibrant abstract background for Instagram post, gradient with ${primaryColor}, trendy and eye-catching, modern design`,
    'twitter': `Clean abstract background for Twitter card, gradient with ${primaryColor}, minimal and professional`,
    'youtube': `Dynamic abstract background for YouTube thumbnail, gradient with ${primaryColor}, engaging and attention-grabbing`
  }

  const prompt = prompts[platform] || prompts['linkedin']
  
  return generateImage({ 
    prompt,
    size: platform === 'youtube' ? '1792x1024' : '1024x1024'
  })
}
