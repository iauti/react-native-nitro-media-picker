# Security Policy

Report suspected vulnerabilities through the repository's private GitHub security advisory form once the repository is created. Do not include private document contents, credentials, or personal provider data in public issues.

## Files and providers

Treat selected filenames, MIME types, and sizes as provider metadata. Choose an absolute destination in an app-owned directory; do not concatenate untrusted filenames into filesystem paths. Save operations replace existing files. Handles provide session access, not a promise of durable access across restarts.

Cloud and third-party providers may revoke access or change content. The application owns saved copies and their cleanup. The newest published release is the supported security baseline.
