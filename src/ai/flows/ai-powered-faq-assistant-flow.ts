'use server';
/**
 * @fileOverview An AI-powered FAQ assistant flow for Brand Name's Brand Name practice.
 * This flow dynamically fetches all content from Firestore to ensure responses are always in sync with the CMS.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {initializeFirebase} from '@/firebase';
import {collection, getDocs} from 'firebase/firestore';

const AIPoweredFaqAssistantInputSchema = z.object({
  question: z.string().describe('The user\'s question about Brand Name\'s practice.'),
});
export type AIPoweredFaqAssistantInput = z.infer<typeof AIPoweredFaqAssistantInputSchema>;

const AIPoweredFaqAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question, based on the dynamic site context.'),
});
export type AIPoweredFaqAssistantOutput = z.infer<typeof AIPoweredFaqAssistantOutputSchema>;

const faqPrompt = ai.definePrompt({
  name: 'faqPrompt',
  input: {
    schema: AIPoweredFaqAssistantInputSchema.extend({
      dynamicContext: z.string().describe('Latest content from the website database.')
    })
  },
  output: {schema: AIPoweredFaqAssistantOutputSchema},
  prompt: `אתה עוזר וירטואלי למרחב השירות "YourBrand — Tagline" של Brand Name. המטרה שלכם היא לענות על שאלות משתמשים בצורה תמציתית, חמה ומדויקת.

  המידע הבא נשלף כרגע ממסד הנתונים המעודכן של האתר (הוא משקף בדיוק את מה שמופיע בעמודים השונים):
  {{{dynamicContext}}}

  הנחיות לתשובה:
  - ענה אך ורק על סמך המידע שסופק לעיל.
  - המידע כולל תכנים מעמוד "About", "התהליך", "שירות אונליין" ומאמרי הבלוג.
  - אם המידע לא קיים בטקסט שסופק, אל תמציא! הפנה את המשתמש לContact Us עם מורן בטלפון 000-000-0000.
  - שמור על טון אמפתי, מקצועי ואישי.

  שאלת המשתמש: {{{question}}}

  תשובה:`,
});

const aiPoweredFaqAssistantFlow = ai.defineFlow(
  {
    name: 'aiPoweredFaqAssistantFlow',
    inputSchema: AIPoweredFaqAssistantInputSchema,
    outputSchema: AIPoweredFaqAssistantOutputSchema,
  },
  async input => {
    // 1. Initialize Firebase on the server
    const { firestore } = initializeFirebase();

    // 2. Deep scan: Fetch all site content and blog posts to build current context
    let dynamicContext = "";
    try {
      const siteContentSnap = await getDocs(collection(firestore, 'siteContent'));
      const blogPostsSnap = await getDocs(collection(firestore, 'blogPosts'));

      // Build a comprehensive context map
      const pagesInfo = siteContentSnap.docs.map(doc => {
        const data = doc.data();
        return `
        עמוד: ${data.heroTitle || doc.id}
        כותרת משנית: ${data.heroSubtitle || ''}
        תוכן פתיחה: ${data.introContent || ''}
        שירותים/יתרונות: ${JSON.stringify(data.features || [])}
        שאלות נפוצות: ${JSON.stringify(data.faqs || [])}
        `;
      }).join('\n\n');

      const blogInfo = blogPostsSnap.docs.map(doc => {
        const data = doc.data();
        return `מאמר בבלוג: ${data.title}\nתקציר: ${data.summary || ''}\nקטגוריה: ${data.category || ''}`;
      }).join('\n');

      dynamicContext = `--- מידע מעודכן מהאתר ---\n${pagesInfo}\n\n--- מידע מהבלוג ---\n${blogInfo}`;
    } catch (e) {
      console.error("Error performing dynamic context scan:", e);
      dynamicContext = "Brand Name היא יועצת אסטרטגית המנהלת את מרחב Brand Name. היא מומחית בנשים ונוער בטבעון ובאונליין.";
    }

    // 3. Run the prompt with the real-time context
    const {output} = await faqPrompt({
      ...input,
      dynamicContext
    });
    
    return output!;
  }
);

export async function aiPoweredFaqAssistant(
  input: AIPoweredFaqAssistantInput
): Promise<AIPoweredFaqAssistantOutput> {
  return aiPoweredFaqAssistantFlow(input);
}
