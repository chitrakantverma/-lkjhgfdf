import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

export interface Skill {
  name: string;
  level: number; // 0-100 score for visualization
}

export interface JobRole {
  role: string;
  match: number; // 0-100 match percentage
}

export interface AnalysisResult {
  resume_score: number;
  technical_skills: Skill[];
  soft_skills: Skill[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  suitable_job_roles: JobRole[];
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyzerService {
  private resultSignal = signal<AnalysisResult | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly result = this.resultSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async analyzeResume(fileBase64: string, mimeType: string) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.resultSignal.set(null);

    try {
      const apiKey = process.env['API_KEY'];
      if (!apiKey) {
        throw new Error('API Key not found');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are an expert Senior Technical Recruiter and AI Resume Evaluator. 
        Analyze the provided resume document strictly. 
        Provide a professional assessment in the specified JSON format.
        
        For skills, estimate a proficiency level (0-100) based on context, years of experience implied, or project complexity.
        For job roles, estimate a match percentage (0-100).
        
        Be critical but constructive. Score purely based on content quality, formatting, and relevance.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: fileBase64
              }
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              resume_score: { type: Type.INTEGER, description: "Overall score from 0 to 100" },
              technical_skills: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    level: { type: Type.INTEGER, description: "Proficiency 0-100" }
                  }
                } 
              },
              soft_skills: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    level: { type: Type.INTEGER, description: "Proficiency 0-100" }
                  }
                } 
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              suitable_job_roles: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    match: { type: Type.INTEGER, description: "Match percentage 0-100" }
                  }
                } 
              },
              summary: { type: Type.STRING, description: "A short 2-3 sentence executive summary of the candidate" }
            },
            required: ["resume_score", "technical_skills", "soft_skills", "strengths", "weaknesses", "improvements", "suitable_job_roles", "summary"]
          }
        }
      });

      if (!response.text) {
        throw new Error('No response from AI');
      }

      const data = JSON.parse(response.text) as AnalysisResult;
      // Sort skills by level desc for better visualization
      data.technical_skills = data.technical_skills.sort((a, b) => b.level - a.level).slice(0, 8);
      data.soft_skills = data.soft_skills.sort((a, b) => b.level - a.level).slice(0, 6);
      data.suitable_job_roles = data.suitable_job_roles.sort((a, b) => b.match - a.match).slice(0, 3);
      
      this.resultSignal.set(data);

    } catch (e: any) {
      console.error('Analysis failed', e);
      this.errorSignal.set(e.message || 'Failed to analyze resume. Please try again.');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  reset() {
    this.resultSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }
}