async function fetchAllIssues(owner, repo, token = null) {
    try {
        const baseUrl = 'https://api.github.com';
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
        };
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        let allIssues = [];
        let page = 1;
        const perPage = 100; // Max allowed by GitHub API

        while (true) {
            const response = await fetch(
                `${baseUrl}/repos/${owner}/${repo}/issues?state=all&per_page=${perPage}&page=${page}`,
                { headers }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch issues: ${response.status}`);
            }

            const issues = await response.json();

            if (issues.length === 0) {
                break; // No more issues to fetch
            }

            // Filter out pull requests
            const filteredIssues = issues.filter(issue => !issue.pull_request);

            allIssues = allIssues.concat(filteredIssues.map(issue => ({
                number: issue.number,
                title: issue.title,
                body: issue.body,
                state: issue.state,
                created_at: issue.created_at,
                user: issue.user.login,
                labels: issue.labels.map(label => label.name)
            })));

            page++;
        }

        return allIssues;
    } catch (error) {
        console.error('Error fetching issues:', error);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        // Replace with your own values
		//https://github.com/jenkinsci/JenkinsPipelineUnit
        const owner = 'jenkinsci';
        const repo = 'JenkinsPipelineUnit';
        // Optional: Add GitHub Personal Access Token for authenticated requests
        const token = 'your_personal_access_token';

        const issues = await fetchAllIssues(owner, repo);

        console.log(`Total Issues: ${issues.length}`);
        console.log('Issues List:');
        issues.forEach(issue => {
            console.log(`#${issue.number}: ${issue.title}`);
            console.log(`State: ${issue.state}`);
            console.log(`Created by: ${issue.user}`);
            console.log(`Created at: ${issue.created_at}`);
            console.log(`Labels: ${issue.labels.join(', ') || 'None'}`);
			console.log(`Type: ${issue.is_pull_request ? 'Pull Request' : 'Issue'}`);
            //console.log(`Body: ${issue.body || 'No body content'}`);
            console.log('---');
        });
    } catch (error) {
        console.error('Failed to fetch issues:', error);
    }
}

// Run the example
main();