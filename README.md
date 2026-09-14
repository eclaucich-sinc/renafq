## 🛠 Project Setup Instructions

  - To install the Client and Server dependencies.
    
    ```
    npm run setup
    ```

  - La base de datos (MongoDB) corre localmente vía Docker Compose. Antes de levantar el server:

    ```
    cp .env.example .env
    cp server/config/config.env.example server/config/config.env
    ```

    Completar `.env` y `server/config/config.env` con credenciales propias (no commitear ninguno de los dos), y levantar Mongo:

    ```
    docker compose up -d
    ```

### Development mode scripts
  
  - To run the both end's using concurrently.
  
    ```
    npm run dev
    ```

  - To run the backend in development mode using Nodemon.
    
    ```
    npm run server
    ```   

  - To run the frontend in development mode.  
    
    ```
    npm run client
    ```  

### Production mode script
  
  - To build the client and run the server

    ```
    npm run prod
    ```