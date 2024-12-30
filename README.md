```markdown
# Campaign Dashboard Backend

Welcome to the **Campaign Dashboard Backend** repository! This project is a [NestJS](https://nestjs.com/) application that serves as the backend for managing campaigns, projects, and user accounts.

## Features

- **NestJS Framework**: Efficient, scalable server-side application framework.
- **PostgreSQL Integration**: Uses PostgreSQL as the database.
- **TypeORM**: Powerful ORM for managing database operations.
- **Authentication**: Includes JWT-based authentication.
- **Seeding**: Seed campaigns for testing pagination and search functionalities.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** for package management
- **Docker** (optional but recommended for setting up PostgreSQL and pgAdmin)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Samiur-UTI/campaign-dashboard-backend.git
   cd campaign-dashboard-backend
   ```

2. **Install Dependencies**:
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   - Rename the `env.example` file to `.env`:
     ```bash
     mv env.example .env
     ```
   - Open the `.env` file and configure the following environment variables:
     ```env
     POSTGRES_USER=your_username
     POSTGRES_PASSWORD=your_password
     POSTGRES_DB=your_database
     PGADMIN_DEFAULT_EMAIL=admin@example.com
     PGADMIN_DEFAULT_PASSWORD=admin_password
     API_PREFIX=/api/v1
     PORT=5000
     JWT_SECRET=example
     ```

4. **Set Up PostgreSQL and pgAdmin**:
   - Using Docker Compose:
     ```bash
     docker-compose up -d
     ```
   - Alternatively, start PostgreSQL and pgAdmin manually using your preferred setup.

5. **Run Database Migrations**:
   ```bash
   npm run migration:run
   ```

6. **Start the Application**:
   - Development mode:
     ```bash
     npm run start:dev
     ```
   - Production mode:
     ```bash
     npm run start:prod
     ```

   The API will be available at `http://localhost:5000/api/v1`.

### Seeding Data

To seed the database with test campaigns, use the following command:
```bash
npm run seed:campaigns
```

## Scripts

Here are the available npm scripts:

- **`npm run start`**: Start the application in production mode.
- **`npm run start:dev`**: Start the application in development mode with hot reloading.
- **`npm run build`**: Build the application for production.
- **`npm run lint`**: Lint the codebase.
- **`npm run migration:generate`**: Generate a new database migration.
- **`npm run migration:run`**: Run pending database migrations.
- **`npm run migration:revert`**: Revert the last applied migration.
- **`npm run seed:campaigns`**: Seed the database with sample campaigns.

## Folder Structure

```
/campaign-dashboard-backend
├── dist                 # Compiled application files
├── src                  # Source files
│   ├── config           # Configuration files
│   ├── migrations       # TypeORM migrations
│   ├── modules          # Application modules (auth, campaign, user, etc.)
│   ├── seed             # Data seeding scripts
│   └── main.ts          # Application entry point
├── docker-compose.yml   # Docker Compose file for PostgreSQL and pgAdmin
├── env.example          # Example environment configuration
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
├── tsconfig.build.json  # TypeScript build configuration
```

## Contributing

We welcome contributions! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Feedback

If you have any feedback, suggestions, or issues, please open an [issue](https://github.com/Samiur-UTI/campaign-dashboard-backend/issues) or contact us directly.

---

Happy coding! 🎉
```
