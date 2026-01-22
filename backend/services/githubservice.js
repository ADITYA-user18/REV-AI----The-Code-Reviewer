import axios from 'axios';

/**
 * Fetches the file changes (diffs) between two commits.
 */
export const fetchFileDiffs = async (owner, repo, base, head, token) => {
  try {
    // 1. Call GitHub Compare API (Base Commit vs New Commit)
    const url = `https://api.github.com/repos/${owner}/${repo}/compare/${base}...${head}`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const files = response.data.files;
    if (!files || files.length === 0) return [];

    // 2. Filter: We only want text files that have actual code changes ('patch')
    // We ignore removed files or binary files (images)
    const processedFiles = files
      .filter(file => file.patch) 
      .map(file => ({
        filename: file.filename,
        status: file.status, // 'modified', 'added'
        patch: file.patch    // The actual code lines that changed
      }));

    return processedFiles;

  } catch (error) {
    console.error('Error fetching diffs:', error.message);
    return null;
  }
};