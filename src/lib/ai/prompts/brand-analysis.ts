export const brandAnalysisPrompt = `You are a brand identity expert. Analyze the following brand information and extract key brand attributes.

Input:
- Website URL: {url}
- Brand Name: {brandName}
- Brand Description: {description}
- Extracted Colors: {colors}
- Extracted Fonts: {fonts}
- Page Title: {pageTitle}
- Page Description: {pageDescription}

Based on this information, generate a comprehensive brand analysis.

Return as JSON with this exact structure:
{
  "personality": ["modern", "professional", "innovative"],
  "audience": "Target audience description",
  "tone": "Professional yet approachable",
  "visualStyle": "Clean and minimal",
  "industry": "Industry category",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "competitors": ["competitor1", "competitor2"],
  "uniqueSellingPoints": ["usp1", "usp2", "usp3"]
}

Focus on:
1. Brand Personality - 3-5 adjectives that describe the brand
2. Target Audience - Who this brand serves
3. Brand Tone - How the brand communicates
4. Visual Style - The aesthetic direction
5. Industry - The market category
6. Keywords - Important terms associated with the brand
7. Competitors - Similar brands in the space
8. Unique Selling Points - What makes this brand different

Be specific and actionable. This analysis will be used to generate a complete design system.`
