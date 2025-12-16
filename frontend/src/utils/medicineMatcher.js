import medicinesDb from '../data/medicines.json';

// Simple Levenshtein distance for fuzzy matching
const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; j++) {
            arr[i][j] =
                i === 0
                    ? j
                    : Math.min(
                        arr[i - 1][j] + 1,
                        arr[i][j - 1] + 1,
                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
        }
    }
    return arr[t.length][s.length];
};

export const findMedicineInDb = (extractedName) => {
    const normalizedInput = extractedName.toLowerCase().trim();
    let bestMatch = null;
    let minDistance = Infinity;
    const THRESHOLD = 3; // Max edits allowed

    // Direct exact match check first
    if (medicinesDb[normalizedInput]) {
        return { key: normalizedInput, ...medicinesDb[normalizedInput] };
    }

    // Fuzzy match
    Object.keys(medicinesDb).forEach((dbKey) => {
        // Check English Name
        const englishName = medicinesDb[dbKey].english.name.toLowerCase();

        // Check exact match with English name
        if (normalizedInput === englishName) {
            bestMatch = { key: dbKey, ...medicinesDb[dbKey] };
            minDistance = 0;
            return;
        }

        // Levenshtein check
        const dist = levenshteinDistance(normalizedInput, englishName);
        if (dist < minDistance && dist <= THRESHOLD) {
            minDistance = dist;
            bestMatch = { key: dbKey, ...medicinesDb[dbKey] };
        }
    });

    return bestMatch;
};
