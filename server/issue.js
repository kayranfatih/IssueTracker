'use strict';

const validIssueStatus = {
    New: true,
    Open: true,
    Assigned: true,
    Fixed: true,
    Verified: true,
    Closed: true
};

const issueFieldType = {
    status: 'notrequired',
    owner: 'notrequired',
    effort: 'notrequired',
    created: 'notrequired',
    completionDate: 'notrequired',
    title: 'notrequired'
};

function validateIssue(issue) {
    /*for (const field in issueFieldType) {
        const type = issueFieldType[field];
        if (!type) {
            delete issue[field];
        }
        else if (type == 'required' && !issue[field]) {
            return `${field} is required.`;
        }
    }
    if (!validateIssue[issue.status])
        return `${issue.status} is not a valid status`;
    return null;*/
}

module.exports = {
    validateIssue: validateIssue
}