# Edureka Back-End Repository

## Description
Edureka is an event management and archival tool for 
RPI’s Event Office. The purpose of Edureka is to manage and 
coordinate campus-wide events created using RPI Event Hub and 
Study Compass to ensure one centralized place to find up-to-date 
events. Those with admin access will have the ability to overwrite 
existing events if needed.

## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/EdurekaRPI/back-end.git
```

2. Navigate to the project directory:
```bash
cd back-end
```

3. Install the dependencies:
```bash
npm install
```

### Environment Variables
Create a .env file at the root of your project and add
the following variable:
```env
MongoURI=mongodb://your-mongo-uri-here
```

### Running the Server Locally
To start the Express.js server:
```bash
node app.js
```

The server will typically run at `http://localhost:5000`, unless otherwise configured.
