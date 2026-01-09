---
description: How to run the Django backend server
---

1.  **Open a terminal** and navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  **Activate the virtual environment**:
    ```bash
    source venv/bin/activate
    ```

3.  **Ensure PostgreSQL is running** and the database exists. If you haven't created the database yet:
    ```bash
    createdb soultalk_db
    ```

4.  **Run database migrations** (if not already done):
    ```bash
    python3 manage.py migrate
    ```

5.  **Start the development server**:
    ```bash
    python3 manage.py runserver
    ```
