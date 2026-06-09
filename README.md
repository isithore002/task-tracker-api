# Task Tracker REST API

A RESTful backend API for managing projects and tasks, built with Spring Boot 3, Spring Data JPA (Hibernate), and MySQL. All endpoints tested with Postman.

## Features

- **Project Management** — Create, read, update, delete projects
- **Task Management** — Create tasks under projects, update status (TODO / IN_PROGRESS / DONE), set priority (LOW / MEDIUM / HIGH) and due dates
- **Filtering** — Get tasks by status or by project
- **Input Validation** — `@Valid` + `@NotBlank` on all request bodies with meaningful error messages
- **Exception Handling** — Custom `ResourceNotFoundException` returns clean 404 JSON responses
- **Auto Schema** — Hibernate DDL auto-update creates tables on startup

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2 |
| ORM | Spring Data JPA (Hibernate 6) |
| Database | MySQL 8 |
| Build Tool | Maven |
| Testing | Postman |

## Project Structure

```
task-tracker-api/
└── src/main/
    ├── java/com/tasktracker/
    │   ├── TaskTrackerApplication.java        # Spring Boot entry point
    │   ├── model/
    │   │   ├── Project.java                   # @Entity — projects table
    │   │   └── Task.java                      # @Entity — tasks table
    │   ├── repository/
    │   │   ├── ProjectRepository.java         # JpaRepository<Project, Long>
    │   │   └── TaskRepository.java            # + derived queries (findByStatus etc.)
    │   ├── service/
    │   │   ├── ProjectService.java            # Business logic for projects
    │   │   └── TaskService.java               # Business logic for tasks
    │   ├── controller/
    │   │   ├── ProjectController.java         # REST endpoints for /api/projects
    │   │   └── TaskController.java            # REST endpoints for /api/tasks
    │   └── exception/
    │       └── ResourceNotFoundException.java # 404 handler
    └── resources/
        └── application.properties             # DB + JPA config
```

## Setup & Run

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8

### 1. Create the Database

```sql
CREATE DATABASE task_tracker;
```

> Hibernate auto-creates the `projects` and `tasks` tables on first startup.

### 2. Configure Database Credentials

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run

```bash
mvn spring-boot:run
```

API is available at `http://localhost:8080`

## API Endpoints

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/{id}` | Get project by ID |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks?status=TODO` | Filter tasks by status |
| GET | `/api/tasks/{id}` | Get task by ID |
| GET | `/api/projects/{id}/tasks` | Get all tasks for a project |
| POST | `/api/projects/{id}/tasks` | Create a task under a project |
| PUT | `/api/tasks/{id}` | Update a task |
| PATCH | `/api/tasks/{id}/status?status=DONE` | Update task status only |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Sample Requests

**Create a project**
```http
POST /api/projects
Content-Type: application/json

{
  "name": "Internship Portal",
  "description": "Web app for managing internship applications"
}
```

**Create a task**
```http
POST /api/projects/1/tasks
Content-Type: application/json

{
  "title": "Build login API",
  "description": "JWT-based authentication endpoint",
  "priority": "HIGH",
  "dueDate": "2026-07-01"
}
```

**Update task status**
```http
PATCH /api/tasks/1/status?status=IN_PROGRESS
```

## Database Schema

```
projects
├── id           BIGINT PK AUTO_INCREMENT
├── name         VARCHAR(150) NOT NULL
├── description  VARCHAR(500)
└── created_at   DATETIME

tasks
├── id           BIGINT PK AUTO_INCREMENT
├── project_id   BIGINT FK → projects.id
├── title        VARCHAR(200) NOT NULL
├── description  VARCHAR(1000)
├── status       VARCHAR(20)   -- TODO | IN_PROGRESS | DONE
├── priority     VARCHAR(10)   -- LOW | MEDIUM | HIGH
├── due_date     DATE
└── created_at   DATETIME
```
