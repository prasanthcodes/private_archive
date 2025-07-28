async function createIssueAndComment(owner, repo, title, body, commentBody, token) {
    try {
        const baseUrl = 'https://api.github.com';
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        };

        // Create new issue
        const issueResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/issues`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title,
                body
            })
        });

        if (!issueResponse.ok) {
            throw new Error(`Failed to create issue: ${issueResponse.status}`);
        }

        const issue = await issueResponse.json();

        // Post comment to the created issue
        const commentResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/issues/${issue.number}/comments`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                body: commentBody
            })
        });

        if (!commentResponse.ok) {
            throw new Error(`Failed to post comment: ${commentResponse.status}`);
        }

        const comment = await commentResponse.json();

        return {
            issue: {
                number: issue.number,
                title: issue.title,
                body: issue.body,
                state: issue.state,
                created_at: issue.created_at,
                user: issue.user.login
            },
            comment: {
                id: comment.id,
                body: comment.body,
                user: comment.user.login,
                created_at: comment.created_at
            }
        };
    } catch (error) {
        console.error('Error creating issue or posting comment:', error);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        // Replace with your own values
        const owner = 'octocat';
        const repo = 'hello-world';
        const title = 'New Issue Title';
        const body = 'This is the body of the new issue.';
        const commentBody = 'This is a comment on the new issue.';
        const token = 'your_personal_access_token'; // Required for write operations

        const result = await createIssueAndComment(owner, repo, title, body, commentBody, token);

        console.log('Created Issue:');
        console.log(`#${result.issue.number}: ${result.issue.title}`);
        console.log(`State: ${result.issue.state}`);
        console.log(`Created by: ${result.issue.user}`);
        console.log(`Created at: ${result.issue.created_at}`);
        console.log(`Body: ${result.issue.body}`);
        console.log('\nPosted Comment:');
        console.log(`Comment ID: ${result.comment.id}`);
        console.log(`Comment by: ${result.comment.user}`);
        console.log(`Created at: ${result.comment.created_at}`);
        console.log(`Comment: ${result.comment.body}`);
    } catch (error) {
        console.error('Failed to create issue or comment:', error);
    }
}

// Run the example
main();