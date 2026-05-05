import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateModulAjar(params: {
  subject: string;
  grade: string;
  topic: string;
  objectives: string;
}) {
  const prompt = `
    Bertindaklah sebagai ahli kurikulum pendidikan di Indonesia. 
    Buatlah sebuah Modul Ajar lengkap untuk Kurikulum Merdeka dengan detail berikut:
    - Mata Pelajaran: ${params.subject}
    - Kelas: ${params.grade}
    - Topik: ${params.topic}
    - Tujuan Pembelajaran: ${params.objectives}

    Modul Ajar harus mencakup:
    1. Informasi Umum (Identitas, Kompetensi Awal, Profil Pelajar Pancasila, Sarana Prasarana)
    2. Komponen Inti (Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran - Pendahuluan, Inti, Penutup)
    3. Asesmen (Diagnostik, Formatif, Sumatif)
    4. Pengayaan dan Remedial
    5. Lampiran (LKPD, Glosarium, Daftar Pustaka)

    Gunakan format Markdown yang rapi dan profesional dalam Bahasa Indonesia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating modul ajar:", error);
    throw error;
  }
}

export async function generateLearningMaterial(subject: string, topic: string) {
  const prompt = `
    Buatlah ringkasan materi pembelajaran yang menarik untuk siswa tentang topik: ${topic} dalam mata pelajaran ${subject}.
    Sertakan poin-poin penting, contoh nyata, dan analogi yang mudah dipahami.
    Gunakan format Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating material:", error);
    throw error;
  }
}
