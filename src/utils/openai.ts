
const apiKey = process.env.OPEN_API_KEY || "";

export const callGeminiAPI = async (prompt: string) => {
  if (!apiKey) {
    await new Promise(r => setTimeout(r, 1000));
    return "Vui lòng nhập Gemini API Key trong code để sử dụng tính năng này.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI không thể đưa ra câu trả lời lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lỗi kết nối đến Gemini AI.";
  }
};