'use server';
/**
 * @fileOverview A Genkit flow that analyzes dynamic content from Firestore for SEO and quality.
 * This solves the "blindness" of AI towards content stored in databases rather than source code.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {initializeFirebase} from '@/firebase';
import {doc, getDoc} from 'firebase/firestore';

const ContentAnalyzerInputSchema = z.object({
  contentType: z.enum(['page', 'blog']).describe('The type of content to analyze.'),
  slug: z.string().describe('The slug or pageId of the content.'),
});
export type ContentAnalyzerInput = z.infer<typeof ContentAnalyzerInputSchema>;

const ContentAnalyzerOutputSchema = z.object({
  analysis: z.string().describe('Detailed SEO and content quality analysis.'),
  recommendations: z.array(z.string()).describe('List of actionable improvements.'),
  score: z.number().min(0).max(100).describe('Overall SEO score.'),
});
export type ContentAnalyzerOutput = z.infer<typeof ContentAnalyzerOutputSchema>;

const analysisPrompt = ai.definePrompt({
  name: 'analysisPrompt',
  input: {
    schema: z.object({
      title: z.string(),
      content: z.string(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
  },
  output: {schema: ContentAnalyzerOutputSchema},
  prompt: `You are an expert SEO and Content Strategy Agent.
  Analyze the following content from Brand Name's "YourBrand" practice website.
  
  Title: {{{title}}}
  Content: {{{content}}}
  Current Meta Title: {{{metaTitle}}}
  Current Meta Description: {{{metaDescription}}}

  Tasks:
  1. Evaluate the personal resonance and professional tone (Strategic Psychoservice).
  2. Check for SEO keyword optimization (e.g., "שירות מקצועי", "טבעון", "ייעוץ").
  3. Provide a score from 0-100.
  4. List 3-5 specific, actionable recommendations in Hebrew.

  Output your analysis in Hebrew, focusing on warmth and professionalism.`,
});

const contentAnalyzerFlow = ai.defineFlow(
  {
    name: 'contentAnalyzerFlow',
    inputSchema: ContentAnalyzerInputSchema,
    outputSchema: ContentAnalyzerOutputSchema,
  },
  async (input) => {
    const { firestore } = initializeFirebase();
    const collectionName = input.contentType === 'page' ? 'siteContent' : 'blogPosts';
    
    // Fetch the actual content from the database
    const docRef = doc(firestore, collectionName, input.slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Content not found at ${collectionName}/${input.slug}`);
    }

    const data = docSnap.data();
    
    // Run the analysis prompt on the actual data
    const { output } = await analysisPrompt({
      title: data.heroTitle || data.title || input.slug,
      content: data.introContent || data.content || "",
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    });

    return output!;
  }
);

export async function analyzeContent(input: ContentAnalyzerInput): Promise<ContentAnalyzerOutput> {
  return contentAnalyzerFlow(input);
}
