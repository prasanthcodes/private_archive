// Function to fetch and list all files and folders in a GitHub repository
async function listRepoContents(owner, repo, path = '', token = '') {
  try {
    // Construct the GitHub API URL for the repository contents
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    // Set up headers for the API request
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // Add authorization header if a token is provided
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    // Make the API request for contents
    const response = await fetch(url, { headers });
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse the JSON response
    const contents = await response.json();
    
    // Process each item in the repository
    for (const item of contents) {
      if (item.type === 'file') {
        // Fetch the last commit for the file to get the modified date
        const commitUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(item.path)}&per_page=1`;
        const commitResponse = await fetch(commitUrl, { headers });
        let lastModified = 'Unknown';
        
        if (commitResponse.ok) {
          const commits = await commitResponse.json();
          if (commits.length > 0) {
            lastModified = new Date(commits[0].commit.committer.date).toLocaleString();
          }
        }
        
        // Log file details: path, size (in bytes), and last modified date
        console.log(`File: ${item.path}, Size: ${item.size} bytes, Last Modified: ${lastModified}`);
      } else if (item.type === 'dir') {
        console.log(`Folder: ${item.path}`);
        // Recursively fetch contents of subdirectories
        await listRepoContents(owner, repo, item.path, token);
      }
    }
  } catch (error) {
    console.error('Error fetching repository contents:', error.message);
  }
}

// Example usage
const owner = 'google'; // Replace with the repository owner's username
const repo = 'mobly'; // Replace with the repository name
const token = ''; // Replace with your GitHub personal access token if accessing a private repo

// Call the function
listRepoContents(owner, repo, 'docs', token);