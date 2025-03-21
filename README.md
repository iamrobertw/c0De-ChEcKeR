# Automated Coupon Code Checker

## Overview

This project is an automated coupon code validation script using Puppeteer to check a list of discount codes on a website. The script logs valid codes into `valid_codes.txt`.

## Project Structure

```
.
├── check_coupons.js     # Main script
├── valid_codes.txt      # Output file
├── package.json         # Dependencies
├── package-lock.json    # Lock file
└── .gitignore           # Ignored files
```

## Technologies Used

- Node.js
- Puppeteer
- dotenv
- File System (fs)

## Prerequisites

- Node.js v18.18.0 or higher
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iamrobertw/c0De-ChEcKeR.git
   cd c0De-ChEcKeR
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory:

- **On Linux/Mac:**

  ```bash
  touch .env
  ```

- **On Windows (PowerShell):**

  ```bash
  New-Item -ItemType File .env
  ```

2. Add the following variables to the `.env` file:

```dotenv
URL=INSERT_URL_HERE
CODES=<CODE1>,<CODE2>,<CODE3>,<CODE4>
```

## Usage

1. Run the script:
   ```bash
   node check_coupons.js
   ```
2. Check valid codes:
   ```bash
   cat valid_codes.txt
   ```

## Example Output

Console log:

```
Kod CODE1 jest prawidłowy.
Kod CODE3 nie działa.
Prawidłowe kody zapisane do valid_codes.txt
```

Valid codes file:

```
CODE1
CODE4
```

## License

MIT License
