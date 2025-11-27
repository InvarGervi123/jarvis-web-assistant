// כאן בהמשך נעשה חיבור אמיתי ל-Gemini / OpenAI
async function reply({ message, user, context }) {
    // כרגע: מחזיר תשובת דמה
    return `AI placeholder: I received your message "${message}"`;
}

module.exports = { reply };
