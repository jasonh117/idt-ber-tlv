# ID TECH TLV
Solution to managing ID TECH TLVs

## Requirements
- [NodeJS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## To set up project
```bash
brew install yarn --without-node  # Installs yarn without node, remove flags if you don't have node
yarn                              # Installs all packages specified in package.json
yarn migrate                      # Create sqlite3 db file with tables
yarn start                        # Run the server!
```

## Environment Variables that needs to be set
### Using Google login
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
### Using Outlook login
- OUTLOOK_CLIENT_ID
- OUTLOOK_CLIENT_SECRET
### Set session key when using production build
- SESSION_SECRET
### Optional
- GOOGLE_ANALYTICS_ID
