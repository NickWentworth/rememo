# Rememo

Rememo is a modern planner application that allows you to track your tasks, courses, and terms. It is built using the Next.js framework.

## Features

-   Secure OAuth2 authentication using NextAuth
-   Full support to track terms, courses, and tasks
    -   Filter and search for tasks based on name, description, course, and more
    -   Daily and weekly calendar views to keep track of course times
-   User data stored and accessed using Prisma ORM
-   Beautiful user interface designed and developed from scratch

### Planned

-   Improved mobile support
-   Canvas and Blackboard API integration
    -   Allow sign-in or account linking through Canvas/Blackboard
    -   Import courses and assignments into Rememo
-   Toggle for light/dark mode

## Usage

Rememo is online and available [here](https://rememo.nickwentworth.me)! If you instead would prefer to run it locally:

### Hosting Locally

1. Install [Node.js](https://nodejs.org/en/), clone this repository, and navigate to the root of this project

2. Install npm dependencies with the following command:

    ```bash
    npm install
    ```

3. Rememo expects multiple environment variables to function properly. Create a `.env` file in the root folder and include the following variables:

    ```bash
    # database path
    DATABASE_URL="file:./database.db" # or any other preferred path

    # authentication
    NEXTAUTH_URL="http://localhost:3000/"
    NEXTAUTH_SECRET="<randomized 32-character base64 string>"

    # obtain OAuth2 client credentials from the Google API Console
    # more information at https://developers.google.com/identity/protocols/oauth2
    GOOGLE_ID=""
    GOOGLE_SECRET=""
    ```

4. Run the Next.js server in either development or production mode:

    ```bash
    # development
    npm run dev

    # production
    npm run build
    npm run start
    ```

5. Visit http://localhost:3000 and try it out!
