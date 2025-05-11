# BookBuy Hub - Online Bookstore

This is a Next.js-based online bookstore application. It features a customer-facing storefront for browsing and purchasing books, and an admin panel for managing books, orders, and users.

## Running the Project

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository (if applicable):**
    If you've received this as a project, you might already have the files. If it's a Git repository, clone it:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    This project uses npm as its package manager. Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. For this application, it's primarily used for Genkit configuration if AI features are extended. If you have a Google AI API key for Genkit, add it here:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    If you don't have a key or are not using AI features that require it, you can leave it blank for now, but some AI-driven suggestions might not work.

4.  **Run the development server:**
    To start the Next.js development server, run:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`.

5.  **Run Genkit development server (for AI features):**
    If you plan to use or develop AI-powered features (like book suggestions), you need to run the Genkit development server in a separate terminal:
    ```bash
    npm run genkit:dev
    ```
    Or, for automatic reloading on changes to AI flows:
    ```bash
    npm run genkit:watch
    ```

## Accessing the Admin Panel

The admin panel allows for the management of the bookstore's inventory, orders, and customer data.

1.  **Navigate to the admin URL:**
    Once the main application is running, open your browser and go to:
    `http://localhost:9002/admin`

2.  **Login Credentials:**
    Use the following hardcoded credentials to log in:
    *   **Username:** `admin`
    *   **Password:** `admin`

## Technologies Used

This project is built with a modern web development stack:

*   **Framework:** [Next.js](https://nextjs.org/) (using the App Router, Server Components, and Server Actions for enhanced performance and developer experience).
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for static typing and improved code quality.
*   **UI Library:** [React](https://reactjs.org/) for building interactive user interfaces.
*   **Styling:**
    *   [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS styling.
    *   [ShadCN/UI](https://ui.shadcn.com/) for a pre-built, customizable component library built on Tailwind CSS and Radix UI.
*   **Icons:** [Lucide React](https://lucide.dev/) for a comprehensive set of SVG icons.
*   **AI/Generative Features:** [Genkit](https://firebase.google.com/docs/genkit) (an open-source framework from Google) for integrating AI models (e.g., for book suggestions). It uses Google AI plugins by default.
*   **Schema Validation:** [Zod](https://zod.dev/) for robust data validation on both client and server.
*   **Form Handling:** [React Hook Form](https://react-hook-form.com/) for efficient and flexible form management, integrated with Zod for validation.
*   **Date Utilities:** [date-fns](https://date-fns.org/) for easy and reliable date manipulation and formatting.
*   **State Management:** React Context API (e.g., for shopping cart state).
*   **Development Tools:**
    *   ESLint and Prettier (implicitly, through Next.js defaults and common practices) for code linting and formatting.

The application uses mock data stored internally for all its data needs (books, orders, users), simulating a backend without an actual database connection. This makes it easy to run and test locally without external dependencies.
