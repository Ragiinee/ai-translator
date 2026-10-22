import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

// 1. กำหนด Interface สำหรับข้อมูลที่รับเข้ามาจาก Frontend
interface TranslationRequestBody {
  sourceText: string
  sourceLanguage: string
  targetLanguage: string
  languageLevel: string
  context?: string
  funMode: boolean
}

// 2. กำหนด Interface สำหรับ Response ที่จะส่งกลับ
interface TranslationResponseBody {
  translatedText?: string
  error?: string
}

// Initialize SDK (ระบบจะอ่าน GEMINI_API_KEY จาก process.env อัตโนมัติ)
const ai = new GoogleGenAI()

export async function POST (
  request: Request
): Promise<NextResponse<TranslationResponseBody>> {
  try {
    const body: TranslationRequestBody = await request.json()
    const {
      sourceText,
      sourceLanguage,
      targetLanguage,
      languageLevel,
      context,
      funMode
    } = body

    // ตรวจสอบความถูกต้องเบื้องต้นของ Input
    if (!sourceText || !sourceText.trim()) {
      return NextResponse.json(
        { error: 'กรุณาระบุข้อความที่ต้องการแปล' },
        { status: 400 }
      )
    }

    // สร้าง Prompt สำหรับสั่งงาน AI
    // สร้าง Prompt สำหรับสั่งงาน AI ให้ตอบกลับเป็น JSON Structure
   const prompt = `You are a professional translator and linguistic expert.

Task:
- Source Language: ${sourceLanguage === 'auto' ? 'Detect automatically' : sourceLanguage}
- Target Language: ${targetLanguage}
- Translation Level/Style: ${languageLevel}
- Context: ${context || 'General'}
- Fun Mode / Creative Style: ${
  funMode
    ? 'Enabled (Use creative, playful, or humorous idioms while preserving the core meaning)'
    : 'Disabled (Keep it natural, direct, and faithful to the level/style)'
}

Instructions:
1. Translate the provided text based on the specifications above.
2. Detect the actual source language of the input text.
3. LANGUAGE RULE FOR EXPLANATIONS (CRITICAL):
   - "contextMeaning" MUST be written entirely in the **SAME LANGUAGE as the source text** (e.g., if the user inputs Thai, explain in Thai).
   - "keyPhrases" MUST map the target language terms with explanations written in the **Source Language** (e.g., "[Japanese Word/Romaji] = [ความหมาย/คำอธิบายเป็นภาษาไทย]").
   - Do NOT use English or the Target Language for explanations unless the source text itself is in English.
4. Generate the "explanation" object contextually:
   - For single simple words or basic greetings: Leave explanation fields as empty arrays/null.
   - For long paragraphs/articles: Provide a concise overall "contextMeaning" in the source language, and leave "keyPhrases" as [].
   - For medium/complex sentences: Provide insightful context and key phrases.
5. Return STRICTLY as a valid JSON object. Do NOT include markdown code blocks (like \`\`\`json).

Use this exact JSON structure:
{
  "translatedText": "The final translated text here",
  "detectedSourceLanguage": "code of detected language (e.g. th, ja, en)",
  "explanation": {
    "contextMeaning": "คำอธิบายบริบทเป็นภาษาเดียวกับต้นฉบับ (หรือ null ถ้าไม่จำเป็น)",
    "keyPhrases": ["คำศัพท์เป้าหมาย/การอ่าน = คำอธิบายความหมายเป็นภาษาต้นฉบับ"] or [],
    "alternatives": ["Alternative option 1"] or []
  }
}

Text to translate:
"${sourceText}"`;

    // เรียกใช้งาน Interactions API ตัวใหม่ในรูปแบบ TypeScript
    const interaction = await ai.interactions.create({
      model: 'gemini-3.1-flash-lite',
      input: prompt
    })

    const rawOutput = interaction.output_text
      ? interaction.output_text.trim()
      : ''
    // console.log('=== 📥 Raw Output จาก AI ===', rawOutput)

    // เผื่อ AI เผลอติด Markdown block มาด้วย (เช่น ```json ... ```) ให้ทำความสะอาดก่อน parse
    const cleanedOutput = rawOutput
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')

    let aiData
    try {
      aiData = JSON.parse(cleanedOutput)
    } catch (parseError) {
      console.error('JSON Parse Error. Raw text was:', rawOutput)
      throw new Error('AI ส่งข้อมูลกลับมาไม่ถูกต้องตามโครงสร้าง JSON ที่กำหนด')
    }

    // ประกอบร่างข้อมูลให้ตรงกับ Type ที่หน้าจอ Result คาดหวัง
    const responseData = {
      translatedText: aiData.translatedText || '',
      sourceLanguage: sourceLanguage,
      detectedSourceLanguage: aiData.detectedSourceLanguage || sourceLanguage,
      targetLanguage: targetLanguage,
      languageLevel: languageLevel,
      context: context || '',
      funMode: funMode,
      explanation: {
        contextMeaning: aiData.explanation?.contextMeaning || '',
        keyPhrases: Array.isArray(aiData.explanation?.keyPhrases)
          ? aiData.explanation.keyPhrases
          : [],
        alternatives: Array.isArray(aiData.explanation?.alternatives)
          ? aiData.explanation.alternatives
          : []
      }
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error: any) {
    console.error('=== Interactions API Error ===', error)

    // รองรับการส่ง Status Code เช่น 503 (High Demand) หรือ Error อื่นๆ กลับไปยัง Frontend
    const statusCode = error.status || error.statusCode || 500
    const errorMessage = error.message || 'เกิดข้อผิดพลาดในการประมวลผลการแปล'

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
