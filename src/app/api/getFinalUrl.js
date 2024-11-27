/**
 * Get the final URL after redirections
 * @param initialUrl
 * @returns {Promise<string|null>}
 */
export default async function getFinalUrl(initialUrl) {
    try {
        const response = await fetch(initialUrl, { redirect: "manual" });
        return response.headers.get("Location") || null;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'URL finale :", error);
        throw error;
    }
}
