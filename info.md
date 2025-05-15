
# HR Management System - API Integration Documentation

This document outlines the backend API requirements for the HR Management System. The frontend is currently using mock data but is designed to integrate with a proper backend API. Below are the endpoints, data structures, and integration points needed.

## Authentication API

### 1. Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates a user and returns user information with an auth token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "admin | hr | employee",
        "avatar": "string (optional)"
      },
      "token": "string"
    }
  }
  ```

### 2. Logout
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Invalidates the user's session
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Logged out successfully"
  }
  ```

## Employee Management API

### 1. List Employees
- **Endpoint**: `GET /api/employees`
- **Description**: Returns a list of employees with pagination
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `search`: string (optional)
  - `department`: string (optional)
  - `status`: string (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "employees": [
        {
          "id": "string",
          "name": "string",
          "email": "string",
          "phone": "string",
          "department": "string",
          "role": "string",
          "joinDate": "string (YYYY-MM-DD)",
          "status": "active | inactive",
          "avatar": "string (optional)"
        }
      ],
      "pagination": {
        "total": "number",
        "pages": "number",
        "current": "number",
        "limit": "number"
      }
    }
  }
  ```

### 2. Get Employee
- **Endpoint**: `GET /api/employees/{id}`
- **Description**: Returns a specific employee's details
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "department": "string",
      "role": "string",
      "joinDate": "string (YYYY-MM-DD)",
      "status": "active | inactive",
      "avatar": "string (optional)",
      "salary": "number (optional)",
      "address": "string (optional)",
      "designation": "string (optional)"
    }
  }
  ```

### 3. Create Employee
- **Endpoint**: `POST /api/employees`
- **Description**: Creates a new employee
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "department": "string",
    "role": "string",
    "joinDate": "string (YYYY-MM-DD)",
    "status": "active | inactive",
    "avatar": "string (optional)",
    "salary": "number (optional)",
    "address": "string (optional)",
    "designation": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Employee created successfully",
    "data": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "department": "string",
      "role": "string",
      "joinDate": "string (YYYY-MM-DD)",
      "status": "active | inactive",
      "avatar": "string (optional)"
    }
  }
  ```

### 4. Update Employee
- **Endpoint**: `PUT /api/employees/{id}`
- **Description**: Updates an employee's information
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**: Same as Create Employee
- **Response**: Same as Create Employee with updated values

### 5. Delete Employee
- **Endpoint**: `DELETE /api/employees/{id}`
- **Description**: Deletes an employee
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Employee deleted successfully"
  }
  ```

## Attendance Management API

### 1. List Attendance
- **Endpoint**: `GET /api/attendance`
- **Description**: Returns attendance records with pagination
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `employeeId`: string (optional)
  - `date`: string (YYYY-MM-DD) (optional)
  - `startDate`: string (YYYY-MM-DD) (optional)
  - `endDate`: string (YYYY-MM-DD) (optional)
  - `status`: string (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "attendance": [
        {
          "id": "string",
          "employeeId": "string",
          "employeeName": "string",
          "date": "string (YYYY-MM-DD)",
          "status": "present | absent | half-day | late",
          "checkIn": "string (HH:MM) (optional)",
          "checkOut": "string (HH:MM) (optional)"
        }
      ],
      "pagination": {
        "total": "number",
        "pages": "number",
        "current": "number",
        "limit": "number"
      }
    }
  }
  ```

### 2. Mark Attendance
- **Endpoint**: `POST /api/attendance`
- **Description**: Marks attendance for an employee
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "employeeId": "string",
    "date": "string (YYYY-MM-DD)",
    "status": "present | absent | half-day | late",
    "checkIn": "string (HH:MM) (optional)",
    "checkOut": "string (HH:MM) (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Attendance marked successfully",
    "data": {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "date": "string (YYYY-MM-DD)",
      "status": "present | absent | half-day | late",
      "checkIn": "string (HH:MM) (optional)",
      "checkOut": "string (HH:MM) (optional)"
    }
  }
  ```

### 3. Update Attendance
- **Endpoint**: `PUT /api/attendance/{id}`
- **Description**: Updates an attendance record
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**: Same as Mark Attendance
- **Response**: Same as Mark Attendance with updated values

## Leave Management API

### 1. List Leaves
- **Endpoint**: `GET /api/leaves`
- **Description**: Returns leave requests with pagination
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `employeeId`: string (optional)
  - `status`: string (optional)
  - `type`: string (optional)
  - `startDate`: string (YYYY-MM-DD) (optional)
  - `endDate`: string (YYYY-MM-DD) (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "leaves": [
        {
          "id": "string",
          "employeeId": "string",
          "employeeName": "string",
          "type": "casual | sick | vacation | other",
          "startDate": "string (YYYY-MM-DD)",
          "endDate": "string (YYYY-MM-DD)",
          "reason": "string",
          "status": "pending | approved | rejected",
          "appliedOn": "string (YYYY-MM-DD)"
        }
      ],
      "pagination": {
        "total": "number",
        "pages": "number",
        "current": "number",
        "limit": "number"
      }
    }
  }
  ```

### 2. Get Leave Balance
- **Endpoint**: `GET /api/leaves/balance/{employeeId}`
- **Description**: Returns leave balance for an employee
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "casual": "number",
      "sick": "number",
      "vacation": "number",
      "total": "number"
    }
  }
  ```

### 3. Apply Leave
- **Endpoint**: `POST /api/leaves`
- **Description**: Applies for a leave
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "employeeId": "string",
    "type": "casual | sick | vacation | other",
    "startDate": "string (YYYY-MM-DD)",
    "endDate": "string (YYYY-MM-DD)",
    "reason": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Leave applied successfully",
    "data": {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "type": "casual | sick | vacation | other",
      "startDate": "string (YYYY-MM-DD)",
      "endDate": "string (YYYY-MM-DD)",
      "reason": "string",
      "status": "pending",
      "appliedOn": "string (YYYY-MM-DD)"
    }
  }
  ```

### 4. Approve/Reject Leave
- **Endpoint**: `PUT /api/leaves/{id}/status`
- **Description**: Updates the status of a leave request
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "status": "approved | rejected",
    "comment": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Leave status updated successfully",
    "data": {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "type": "casual | sick | vacation | other",
      "startDate": "string (YYYY-MM-DD)",
      "endDate": "string (YYYY-MM-DD)",
      "reason": "string",
      "status": "approved | rejected",
      "appliedOn": "string (YYYY-MM-DD)",
      "comment": "string (optional)"
    }
  }
  ```

## Payroll Management API

### 1. List Payrolls
- **Endpoint**: `GET /api/payrolls`
- **Description**: Returns payroll records with pagination
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `employeeId`: string (optional)
  - `month`: string (optional)
  - `year`: string (optional)
  - `status`: string (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "payrolls": [
        {
          "id": "string",
          "employeeId": "string",
          "employeeName": "string",
          "month": "string",
          "year": "string",
          "basic": "number",
          "hra": "number",
          "allowances": "number",
          "deductions": "number",
          "netSalary": "number",
          "status": "pending | processed | paid",
          "payslipUrl": "string (optional)"
        }
      ],
      "pagination": {
        "total": "number",
        "pages": "number",
        "current": "number",
        "limit": "number"
      }
    }
  }
  ```

### 2. Get Payroll
- **Endpoint**: `GET /api/payrolls/{id}`
- **Description**: Returns a specific payroll record
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "month": "string",
      "year": "string",
      "basic": "number",
      "hra": "number",
      "allowances": "number",
      "deductions": "number",
      "netSalary": "number",
      "status": "pending | processed | paid",
      "payslipUrl": "string (optional)"
    }
  }
  ```

### 3. Generate Payroll
- **Endpoint**: `POST /api/payrolls`
- **Description**: Generates a new payroll
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "employeeId": "string",
    "month": "string",
    "year": "string",
    "basic": "number",
    "hra": "number",
    "allowances": "number",
    "deductions": "number",
    "status": "pending | processed | paid"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Payroll generated successfully",
    "data": {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "month": "string",
      "year": "string",
      "basic": "number",
      "hra": "number",
      "allowances": "number",
      "deductions": "number",
      "netSalary": "number",
      "status": "pending | processed | paid"
    }
  }
  ```

### 4. Upload Payslip
- **Endpoint**: `POST /api/payrolls/{id}/payslip`
- **Description**: Uploads a payslip for a payroll record
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**: Form data with file
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Payslip uploaded successfully",
    "data": {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "month": "string",
      "year": "string",
      "payslipUrl": "string"
    }
  }
  ```

### 5. Send Payslip Email
- **Endpoint**: `POST /api/payrolls/{id}/email`
- **Description**: Sends a payslip via email
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Payslip sent successfully"
  }
  ```

## Settings API

### 1. Get Company Information
- **Endpoint**: `GET /api/settings/company`
- **Description**: Returns company information
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "name": "string",
      "logo": "string (optional)",
      "address": "string",
      "email": "string",
      "phone": "string",
      "website": "string (optional)",
      "taxId": "string (optional)"
    }
  }
  ```

### 2. Update Company Information
- **Endpoint**: `PUT /api/settings/company`
- **Description**: Updates company information
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "name": "string",
    "address": "string",
    "email": "string",
    "phone": "string",
    "website": "string (optional)",
    "taxId": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Company information updated successfully",
    "data": {
      "name": "string",
      "logo": "string (optional)",
      "address": "string",
      "email": "string",
      "phone": "string",
      "website": "string (optional)",
      "taxId": "string (optional)"
    }
  }
  ```

### 3. Upload Company Logo
- **Endpoint**: `POST /api/settings/company/logo`
- **Description**: Uploads a company logo
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**: Form data with file
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Logo uploaded successfully",
    "data": {
      "logo": "string"
    }
  }
  ```

### 4. Get Role Permissions
- **Endpoint**: `GET /api/settings/roles`
- **Description**: Returns role permissions
- **Request Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "roles": [
        {
          "role": "admin | hr | employee",
          "permissions": {
            "employees": {
              "view": "boolean",
              "create": "boolean",
              "edit": "boolean",
              "delete": "boolean"
            },
            "attendance": {
              "view": "boolean",
              "mark": "boolean",
              "edit": "boolean"
            },
            "leave": {
              "view": "boolean",
              "apply": "boolean",
              "approve": "boolean"
            },
            "payroll": {
              "view": "boolean",
              "generate": "boolean",
              "approve": "boolean"
            },
            "reports": {
              "view": "boolean",
              "export": "boolean"
            },
            "settings": {
              "view": "boolean",
              "edit": "boolean"
            }
          }
        }
      ]
    }
  }
  ```

### 5. Update Role Permissions
- **Endpoint**: `PUT /api/settings/roles`
- **Description**: Updates role permissions
- **Request Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "roles": [
      {
        "role": "admin | hr | employee",
        "permissions": {
          "employees": {
            "view": "boolean",
            "create": "boolean",
            "edit": "boolean",
            "delete": "boolean"
          },
          "attendance": {
            "view": "boolean",
            "mark": "boolean",
            "edit": "boolean"
          },
          "leave": {
            "view": "boolean",
            "apply": "boolean",
            "approve": "boolean"
          },
          "payroll": {
            "view": "boolean",
            "generate": "boolean",
            "approve": "boolean"
          },
          "reports": {
            "view": "boolean",
            "export": "boolean"
          },
          "settings": {
            "view": "boolean",
            "edit": "boolean"
          }
        }
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Role permissions updated successfully"
  }
  ```

## Reports API

### 1. Get Attendance Report
- **Endpoint**: `GET /api/reports/attendance`
- **Description**: Returns attendance report data
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `startDate`: string (YYYY-MM-DD)
  - `endDate`: string (YYYY-MM-DD)
  - `department`: string (optional)
  - `employeeId`: string (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "summary": {
        "totalEmployees": "number",
        "averageAttendance": "number",
        "presentPercentage": "number",
        "absentPercentage": "number",
        "latePercentage": "number"
      },
      "details": [
        {
          "date": "string (YYYY-MM-DD)",
          "present": "number",
          "absent": "number",
          "late": "number",
          "halfDay": "number",
          "total": "number"
        }
      ]
    }
  }
  ```

### 2. Get Leave Report
- **Endpoint**: `GET /api/reports/leave`
- **Description**: Returns leave report data
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `startDate`: string (YYYY-MM-DD)
  - `endDate`: string (YYYY-MM-DD)
  - `department`: string (optional)
  - `type`: string (optional)
  - `employeeId`: string (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "summary": {
        "totalLeaves": "number",
        "approvedLeaves": "number",
        "pendingLeaves": "number",
        "rejectedLeaves": "number",
        "byType": {
          "casual": "number",
          "sick": "number",
          "vacation": "number",
          "other": "number"
        }
      },
      "details": [
        {
          "employeeId": "string",
          "employeeName": "string",
          "department": "string",
          "casual": "number",
          "sick": "number",
          "vacation": "number",
          "other": "number",
          "total": "number"
        }
      ]
    }
  }
  ```

### 3. Get Payroll Report
- **Endpoint**: `GET /api/reports/payroll`
- **Description**: Returns payroll report data
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `month`: string (optional)
  - `year`: string (optional)
  - `department`: string (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "summary": {
        "totalEmployees": "number",
        "totalSalary": "number",
        "averageSalary": "number",
        "totalBasic": "number",
        "totalHRA": "number",
        "totalAllowances": "number",
        "totalDeductions": "number"
      },
      "details": [
        {
          "department": "string",
          "employeeCount": "number",
          "totalSalary": "number",
          "averageSalary": "number"
        }
      ]
    }
  }
  ```

### 4. Export Report
- **Endpoint**: `GET /api/reports/export`
- **Description**: Exports report data as CSV/Excel
- **Request Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `type`: string (attendance | leave | payroll)
  - `format`: string (csv | excel)
  - Other parameters specific to each report type
- **Response**: Binary file download

## Integration Steps

1. **Create Backend API**: Develop backend API endpoints following the structure outlined above.
   
2. **Update Frontend Environment Configuration**: Set up environment variables to point to your backend API server.

3. **Modify API Service Files**: Update the frontend to use the real API endpoints instead of mock data.

4. **Implement Authentication Logic**: Update the AuthContext to use JWT from the backend.

5. **Handle API Errors**: Implement error handling for API responses.

## Error Handling

All API endpoints should return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error response structure:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Error message for this field"
    }
  ]
}
```

## Security Considerations

1. Use HTTPS for all API communication.
2. Implement proper authentication with JWT tokens.
3. Use role-based access control for API endpoints.
4. Validate all inputs on the server side.
5. Implement rate limiting to prevent abuse.
6. Use CORS to restrict API access to allowed origins.
7. Implement proper logging for security events.
8. Consider implementing refresh tokens for better security.

## Database Schema Recommendations

For implementing the backend, consider the following database schema:

1. **Users Table**:
   - id (PK)
   - name
   - email
   - password (hashed)
   - role
   - avatar
   - created_at
   - updated_at

2. **Employees Table**:
   - id (PK)
   - user_id (FK to Users)
   - phone
   - department
   - role
   - join_date
   - status
   - salary
   - address
   - designation
   - created_at
   - updated_at

3. **Attendance Table**:
   - id (PK)
   - employee_id (FK to Employees)
   - date
   - status
   - check_in
   - check_out
   - created_at
   - updated_at

4. **Leave Table**:
   - id (PK)
   - employee_id (FK to Employees)
   - type
   - start_date
   - end_date
   - reason
   - status
   - applied_on
   - comment
   - created_at
   - updated_at

5. **Payroll Table**:
   - id (PK)
   - employee_id (FK to Employees)
   - month
   - year
   - basic
   - hra
   - allowances
   - deductions
   - net_salary
   - status
   - payslip_url
   - created_at
   - updated_at

6. **Company Table**:
   - id (PK)
   - name
   - logo
   - address
   - email
   - phone
   - website
   - tax_id
   - created_at
   - updated_at

7. **Role_Permissions Table**:
   - id (PK)
   - role
   - module
   - permission
   - value (boolean)
   - created_at
   - updated_at
