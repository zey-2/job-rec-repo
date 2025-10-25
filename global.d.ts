// Minimal ambient module declarations to satisfy TypeScript when using CDN import maps at runtime
// This avoids requiring full type packages in a no-build setup.
declare module "@google/genai" {
  export const GoogleGenAI: any;
  export const Type: any;
}
