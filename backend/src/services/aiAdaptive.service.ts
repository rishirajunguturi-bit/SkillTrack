import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { env } from '../config/env';
import { ISkillTrendItem } from '../models/adaptiveLearning.model';
import { AiUsage } from '../models/aiUsage.model';

const aiRecommendationSchema = z.object({
  type: z.enum([
    'FOCUS_MORE',
    'FOCUS_LESS',
    'REVISE',
    'PRACTICE_MORE',
    'REASSESS',
    'CONTINUE',
    'ADVANCE',
    'RESCHEDULE',
    'REDUCE_WORKLOAD',
    'GENERATE_NEW_PLAN',
  ]),
  skillName: z.string().optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  title: z.string().min(5),
  reason: z.string().min(10),
  actionLabel: z.string(),
  actionRoute: z.string(),
});

const aiAdaptiveResponseSchema = z.object({
  aiSummary: z.string().min(10),
  recommendations: z.array(aiRecommendationSchema).min(1),
});

export interface AdaptiveAnalysisInput {
  careerRoleName: string;
  trends: ISkillTrendItem[];
  overallRoadmapProgress: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  studyConsistencyPercentage: number;
  completedStudyMins: number;
  totalPlannedStudyMins: number;
}

export class AiAdaptiveService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateAdaptiveInsights(
    input: AdaptiveAnalysisInput
  ): Promise<{ aiSummary: string; recommendations: any[] }> {
    if (!this.genAI) {
      console.warn('[AiAdaptiveService] Gemini API key not configured. Using rule-based adaptive analysis.');
      return this.generateFallbackAdaptiveInsights(input);
    }

    try {
      const selectedModel = env.GEMINI_MODEL || 'gemini-2.5-flash';
      const model = this.genAI.getGenerativeModel({ model: selectedModel });

      const prompt = `You are a senior AI engineering mentor optimizing learning pathways for a student targeting ${input.careerRoleName}.

Student Learning Signals Input:
- Target Role: ${input.careerRoleName}
- Overall Roadmap Progress: ${input.overallRoadmapProgress}% (${input.completedTopicsCount}/${input.totalTopicsCount} topics)
- Study Plan Execution Consistency: ${input.studyConsistencyPercentage}% (${input.completedStudyMins}/${input.totalPlannedStudyMins} mins)
- Skill Trends:
${JSON.stringify(input.trends, null, 2)}

STRICT RULES:
1. Provide a concise, supportive executive summary of the student's learning trajectory.
2. Recommend 2 to 4 high-value adaptive actions matching these types:
   - FOCUS_MORE: Critical skill gap with weak performance
   - FOCUS_LESS: Strong skill with stable high scores (proficient >= target)
   - REVISE: Completed topic with recent assessment drop
   - PRACTICE_MORE: Good concept knowledge but needs problem-solving practice
   - REASSESS: Topic practice completed, ready to re-verify score
   - CONTINUE: Normal steady progress
   - REDUCE_WORKLOAD: If study consistency < 50%
3. Action routes MUST be valid frontend routes: '/learning', '/skill-gap', '/assessment', '/study-plan', or '/profile'.
4. Return raw JSON without markdown formatting:
{
  "aiSummary": "Your progress towards ${input.careerRoleName} shows steady improvement in core areas.",
  "recommendations": [
    {
      "type": "FOCUS_MORE",
      "skillName": "${input.trends[0]?.skillName || 'Core Fundamentals'}",
      "priority": "HIGH",
      "title": "Focus More on ${input.trends[0]?.skillName || 'Core Fundamentals'}",
      "reason": "This is currently your largest remaining career skill gap.",
      "actionLabel": "Open Learning Roadmap",
      "actionRoute": "/learning"
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      const validated = aiAdaptiveResponseSchema.parse(parsed);

      return {
        aiSummary: validated.aiSummary,
        recommendations: validated.recommendations,
      };
    } catch (error) {
      console.warn('[AiAdaptiveService] Gemini adaptive analysis failed. Using rule-based fallback.', error);
      return this.generateFallbackAdaptiveInsights(input);
    }
  }

  private generateFallbackAdaptiveInsights(
    input: AdaptiveAnalysisInput
  ): { aiSummary: string; recommendations: any[] } {
    const recommendations: any[] = [];
    const improvingSkills = input.trends.filter((t) => t.trend === 'IMPROVING');
    const decliningSkills = input.trends.filter((t) => t.trend === 'DECLINING');
    const largestGapSkill = [...input.trends].sort((a, b) => b.gap - a.gap)[0];
    const strongSkill = input.trends.find((t) => t.currentProficiency >= t.targetProficiency);

    let summary = `You are tracking towards ${input.careerRoleName} with ${input.overallRoadmapProgress}% roadmap completion.`;

    if (improvingSkills.length > 0) {
      summary += ` Great job improving in ${improvingSkills.map((s) => s.skillName).join(', ')}.`;
    }

    // 1. Focus More on Largest Gap
    if (largestGapSkill && largestGapSkill.gap > 15) {
      recommendations.push({
        type: 'FOCUS_MORE',
        skillName: largestGapSkill.skillName,
        priority: 'CRITICAL',
        title: `Prioritize ${largestGapSkill.skillName}`,
        reason: `Your current proficiency (${largestGapSkill.currentProficiency}%) is below target (${largestGapSkill.targetProficiency}%).`,
        actionLabel: 'Go to Learning Roadmap',
        actionRoute: '/learning',
      });
    }

    // 2. Revise Declining Skill
    if (decliningSkills.length > 0) {
      const decl = decliningSkills[0];
      recommendations.push({
        type: 'REVISE',
        skillName: decl.skillName,
        priority: 'HIGH',
        title: `Revise ${decl.skillName} Fundamentals`,
        reason: `Your latest assessment score dropped by ${Math.abs(decl.changePoints)} points. A quick revision will restore mastery.`,
        actionLabel: 'Review Weak Topics',
        actionRoute: '/learning',
      });
    }

    // 3. Focus Less on Strong Skill
    if (strongSkill) {
      recommendations.push({
        type: 'FOCUS_LESS',
        skillName: strongSkill.skillName,
        priority: 'LOW',
        title: `Maintain ${strongSkill.skillName} Mastery`,
        reason: `You have reached target proficiency (${strongSkill.currentProficiency}%). Allocate more time to remaining gaps.`,
        actionLabel: 'View Skill Gaps',
        actionRoute: '/skill-gap',
      });
    }

    // 4. Reduce Workload if study consistency is low
    if (input.studyConsistencyPercentage > 0 && input.studyConsistencyPercentage < 50) {
      recommendations.push({
        type: 'REDUCE_WORKLOAD',
        priority: 'HIGH',
        title: 'Calibrate Study Pace',
        reason: `Your recent study completion (${input.studyConsistencyPercentage}%) suggests your daily limit may be too high. Consider adjusting to a lighter schedule.`,
        actionLabel: 'Adjust Study Plan',
        actionRoute: '/study-plan',
      });
    }

    // 5. Default Reassess Recommendation
    if (recommendations.length < 2) {
      recommendations.push({
        type: 'REASSESS',
        priority: 'MEDIUM',
        title: 'Verify Skill Mastery via Assessment',
        reason: 'Take an assessment to measure your latest skill growth and update placement readiness.',
        actionLabel: 'Take Skill Assessment',
        actionRoute: '/assessment',
      });
    }

    return {
      aiSummary: summary,
      recommendations,
    };
  }

  /**
   * Grounded AI Trainee Assistant: Processes user questions directly via Google Gemini API SDK.
   * Enforces 0 fake canned responses, real-time multi-turn conversation memory, and server logging.
   */
  async chatWithTraineeAssistant(
    userId: string,
    userContext: {
      name: string;
      targetRole: string;
      degree?: string;
      graduationYear?: number;
      overallReadiness?: number;
      readinessLabel?: string;
      topGaps?: string[];
      strongSkills?: string[];
      recentAssessments?: Array<{ skillName: string; score: number; percentage: number; date: string }>;
      studyPlanProgress?: number;
    },
    userMessage: string,
    chatHistory?: Array<{ role: 'user' | 'assistant'; text: string }>
  ): Promise<{ reply: string; usage?: any }> {
    const today = new Date().toISOString().split('T')[0];
    const limit = env.AI_DAILY_REQUEST_LIMIT || 20;

    // STEP 1: SERVER-SIDE PRE-CHECK BEFORE CALLING GEMINI
    let usageRecord = await AiUsage.findOne({ userId, date: today });
    if (!usageRecord) {
      try {
        usageRecord = await AiUsage.create({
          userId,
          date: today,
          requestsUsed: 0,
          requestsLimit: limit,
        });
      } catch (e) {
        usageRecord = await AiUsage.findOne({ userId, date: today });
      }
    }

    if (usageRecord && usageRecord.requestsUsed >= limit) {
      console.warn(`⚠️ [AI Usage Limit Exceeded] User ${userId} reached daily limit (${usageRecord.requestsUsed}/${limit}). Blocking Gemini API call.`);
      return {
        reply: "You've reached today's SkillTrack AI limit. Try again after your daily allowance resets.",
        usage: {
          requestsUsed: usageRecord.requestsUsed,
          requestLimit: limit,
          requestsRemaining: 0,
          usagePercentage: 100,
          inputTokens: usageRecord.inputTokens || 0,
          outputTokens: usageRecord.outputTokens || 0,
          totalTokens: usageRecord.totalTokens || 0,
        },
      };
    }

    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

    // Re-initialize GoogleGenerativeAI if instance is not yet set or API key is updated
    if (apiKey && !this.genAI) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
      } catch (err) {
        console.error('[AiAdaptiveService] Failed to initialize GoogleGenerativeAI SDK:', err);
      }
    }

    // Phase 17: NO FAKE FALLBACKS. If Gemini API key is missing, report the error directly.
    if (!apiKey || !this.genAI) {
      console.warn('⚠️ [AiAdaptiveService] GEMINI_API_KEY is unconfigured in backend/.env');
      return {
        reply: 'Sorry, SkillTrack AI is currently unconfigured. Please add a valid GEMINI_API_KEY to your backend/.env file to enable real-time AI mentoring.',
      };
    }

    const topGap = userContext.topGaps && userContext.topGaps.length > 0 ? userContext.topGaps[0] : 'Core Engineering Skills';
    const allGapsStr = userContext.topGaps && userContext.topGaps.length > 0 ? userContext.topGaps.join(', ') : 'general technical skills';

    // Server-Side Diagnostic Logging (Phase 15)
    console.log(`\n🤖 [AI Assistant Request] User: "${userContext.name}" (${userId}) | Question: "${userMessage}"`);
    const selectedModel = env.GEMINI_MODEL || 'gemini-2.5-flash';
    console.log(`🚀 [AI Provider] Sending request to Gemini (model: ${selectedModel})...`);

    try {
      const model = this.genAI.getGenerativeModel({ model: selectedModel });

      // Convert conversation history into Gemini multi-turn format
      const history = (chatHistory || []).slice(-6).map((item) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }],
      }));

      const systemContextPrompt = `You are SkillTrack AI Mentor, an intelligent, personalized conversational AI assistant for engineering students on SkillTrack.
You are chatting with trainee: ${userContext.name}.

TRAINEE'S REAL LIVE SKILLTRACK CONTEXT:
- Target Career Role: ${userContext.targetRole}
- Degree & Graduation: ${userContext.degree || 'Engineering'} (${userContext.graduationYear || 'N/A'})
- Placement Readiness Score: ${userContext.overallReadiness !== undefined ? userContext.overallReadiness + '%' : 'Uncalculated'} (${userContext.readinessLabel || 'N/A'})
- Identified Skill Gaps: ${allGapsStr}
- Strong Assessed Skills: ${userContext.strongSkills && userContext.strongSkills.length > 0 ? userContext.strongSkills.join(', ') : 'None assessed yet'}
- Recent Assessment History: ${
        userContext.recentAssessments && userContext.recentAssessments.length > 0
          ? JSON.stringify(userContext.recentAssessments)
          : 'No completed assessments yet'
      }
- Study Plan Execution: ${userContext.studyPlanProgress !== undefined ? userContext.studyPlanProgress + '%' : 'N/A'}

STRICT RESPONSE RULES:
1. ANSWER THE ACTUAL USER QUESTION DIRECTLY: Understand what the user is asking and give a tailored, conversational answer.
2. GENERAL TECH/CS QUESTIONS (e.g., "What is polymorphism?", "Explain binary search", "How does React state work?"): Answer the educational concept directly and clearly. DO NOT mention their profile or say "Based on your profile..." when answering general CS questions!
3. QUESTION-SPECIFIC PERSONALIZED QUESTIONS:
   - "What should I learn next?": Recommend specific learning steps for their top gap (${topGap}).
   - "Explain my biggest skill gap": Identify ${topGap}, explain why it matters for ${userContext.targetRole}, and how to close it.
   - "How do I prepare for campus interviews?": Provide a 3-step technical interview preparation strategy tailored to ${userContext.targetRole}.
   - "Why is my readiness score low?": Explain contributing factors using their gaps (${allGapsStr}).
4. FOLLOW-UP QUESTIONS: If the user asks "Why?", "How?", "Give me a plan for that", use the recent conversation history to provide a seamless follow-up response.
5. NO REPETITIVE SUMMARY: Never output a generic "Based on your profile as a Software Engineer student..." summary unless specifically asked to summarize their profile!
6. DATA ACCURACY: Do not hallucinate fake test scores or non-existent assessments. If data is missing, state that it is unavailable in their SkillTrack profile.
7. Keep responses concise (2-4 sentences or clean bullet points), direct, and actionable.`;

      // Start multi-turn chat session with Gemini
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemContextPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: `Understood! I am SkillTrack AI Mentor. I have full context on ${userContext.name}'s performance record and am ready to provide direct, context-aware answers.` }],
          },
          ...history,
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const reply = result.response.text().trim();

      // STEP 2: EXTRACT TOKEN METADATA & INCREMENT USAGE RECORD UPON SUCCESSFUL AI GENERATION
      let promptTokens = 0;
      let candidateTokens = 0;
      let totalTokens = 0;

      try {
        const metadata = (result.response as any)?.usageMetadata;
        if (metadata) {
          promptTokens = metadata.promptTokenCount || 0;
          candidateTokens = metadata.candidatesTokenCount || 0;
          totalTokens = metadata.totalTokenCount || 0;
        }
      } catch (e) {}

      const updatedUsage = await AiUsage.findOneAndUpdate(
        { userId, date: today },
        {
          $inc: {
            requestsUsed: 1,
            inputTokens: promptTokens,
            outputTokens: candidateTokens,
            totalTokens: totalTokens,
          },
          $set: { requestsLimit: limit },
        },
        { new: true, upsert: true }
      );

      const reqUsed = updatedUsage.requestsUsed;
      const reqRemaining = Math.max(0, limit - reqUsed);
      const usagePct = Math.min(100, Math.round((reqUsed / limit) * 100));

      console.log(`✅ [AI Provider Response] Successfully received (${reply.length} chars). User Usage: ${reqUsed}/${limit} requests.\n`);
      return {
        reply: reply || 'I was unable to generate a response. Please try rephrasing your question.',
        usage: {
          requestsUsed: reqUsed,
          requestLimit: limit,
          requestsRemaining: reqRemaining,
          usagePercentage: usagePct,
          inputTokens: updatedUsage.inputTokens || 0,
          outputTokens: updatedUsage.outputTokens || 0,
          totalTokens: updatedUsage.totalTokens || 0,
        },
      };
    } catch (err: any) {
      console.error('❌ [AiAdaptiveService Error] Gemini API call failed:', err?.message || err);
      const isQuota = err?.message?.includes('429') || err?.message?.includes('Quota exceeded');
      return {
        reply: isQuota
          ? 'SkillTrack AI is temporarily unavailable because the AI service has reached its current provider limit. Please try again later.'
          : 'SkillTrack AI is temporarily unavailable. Please try again.',
      };
    }
  }
}

export const aiAdaptiveService = new AiAdaptiveService();
