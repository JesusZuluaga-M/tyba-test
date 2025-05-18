
# PRueba Tyba - Backend con NestJS, PostgreSQL, Redis y Docker

Este proyecto es un backend construido con [NestJS](https://nestjs.com/) que ofrece funcionalidades de autenticación, consulta de restaurantes y gestión de transacciones. Utiliza PostgreSQL con soporte para vectores (`pgvector`) y Redis para almacenamiento en caché.

## 🚀 Inicio rápido

Para iniciar el entorno de desarrollo, ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker compose up -d
```

Esto levantará los siguientes servicios:

- PostgreSQL (`pgvector`)
- Redis
- Aplicación NestJS (`tyba`)

## ⚠️ Nota importante

Aunque es una **mala práctica** incluir variables de entorno dentro del repositorio por motivos de seguridad, **en este proyecto se han dejado visibles deliberadamente** para facilitar la configuración del entorno y permitir una ejecución inmediata sin pasos adicionales.

---

## 📦 Variables de entorno incluidas

```env
POSTGRES_DB=tyba
POSTGRES_USER=tyba
POSTGRES_PASSWORD=tyba
DB_PORT=5432
DB_HOST=pgvector
DB_USERNAME=tyba
DB_PASSWORD=tyba
DB_DATABASE=tyba
DB_POOL_MAX=10
DB_POOL_MIN=2
REDIS_URL=redis://redis:6379
DB_DRIVER=postgres
```

---

## 📬 Endpoints disponibles

Usa [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) o Postman para probar los siguientes endpoints:

```http
@server = http://localhost:3000
@token = eyJhbGciOi... (token de ejemplo)
```
El token se puede tomar al momento de hacer login con el usuario.

### 🔐 Autenticación

#### Registro

```http
POST {{server}}/auth/register 
Content-Type: application/json

{
  "username": "padmeamidala",
  "fullname": "Padme Amidala",
  "password": "Anakin1234"
}
```

#### Login

```http
POST {{server}}/auth/login 
Content-Type: application/json

{
  "username": "padmeamidala",
  "password": "Anakin1234"
}
```

#### Obtener perfil

```http
GET {{server}}/auth/me 
Authorization: Bearer {{token}}
```

#### Logout

```http
GET {{server}}/auth/logout
Authorization: Bearer {{token}}
```

---

### 🍽 Restaurantes

#### Buscar por ciudad

```http
GET {{server}}/restaurantes/nearby?city=Barranquilla
Authorization: Bearer {{token}}
```

#### Buscar por coordenadas

```http
GET {{server}}/restaurantes/nearby?lat=10.948162&lon=-74.778326
Authorization: Bearer {{token}}
```

---

### 💳 Transacciones

#### Crear transacción

```http
POST {{server}}/transactions/create
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "amount": 4800000,
  "description": "Payment For babies"
}
```

#### Obtener todas las transacciones

```http
GET {{server}}/transactions/getalltransactions
Authorization: Bearer {{token}}
```

---

## 🐳 Requisitos

- Docker
- Docker Compose
- (Opcional) VSCode con extensión REST Client

---

## 🧪 Testing

Aún no se ha incluido testing automatizado, pero puede integrarse con Jest fácilmente.

---

## 📂 Estructura del proyecto

```
tyba/
├── src/
│   ├── auth/
│   ├── restaurantes/
│   ├── transactions/
│   └── main.ts
├── Dockerfile
├── .dockerignore
├── .env.deployment
└── docker-compose.yml
```

---

## 📝 Licencia

Este proyecto se publica sin restricciones de uso durante el desarrollo.