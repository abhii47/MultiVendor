# Multi Vendor E-commerce API

## Overview
The Multi Vendor E-commerce API provides a robust set of functionalities for managing products, vendors, customers, and orders within a multi-vendor e-commerce platform. This API aims to streamline the interactions between vendors and customers, facilitating a seamless shopping experience.

## Features
- **Vendor Management**: Enables vendors to manage their profiles, products, and orders.
- **Product Management**: Allows for the listing, updating, and categorization of products available on the platform.
- **Customer Management**: Facilitates customer account creation, management, and order tracking.
- **Order Processing**: Handles the complete lifecycle of order placement, payment processing, and fulfillment.

## API Endpoints
### 1. Vendors
#### a. Register Vendor
- **POST** `/api/vendors/register`
- **Description**: Registers a new vendor.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
#### b. Get Vendor Details
- **GET** `/api/vendors/{id}`
- **Description**: Retrieves details for a specific vendor.

### 2. Products
#### a. List Products
- **GET** `/api/products`
- **Description**: Returns a list of products.

#### b. Add Product
- **POST** `/api/products`
- **Description**: Adds a new product to the vendor's catalog.
- **Request Body**:
  ```json
  {
    "name": "string",
    "price": "number",
    "description": "string",
    "vendorId": "string"
  }
  ```

### 3. Customers
#### a. Register Customer
- **POST** `/api/customers/register`
- **Description**: Registers a new customer.

### 4. Orders
#### a. Create Order
- **POST** `/api/orders`
- **Description**: Places a new order.

## Authentication
- All endpoints require a valid API token.
- Use the `Authorization` header with the token:
  ```plaintext
  Authorization: Bearer {token}
  ```

## Rate Limiting
- Requests are limited to 1000 per hour per IP.

## Contact
For support, please contact [support@multivendorapi.com](mailto:support@multivendorapi.com).

## License
This project is licensed under the MIT License.