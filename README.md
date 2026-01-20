# 🛒 Product Microservice

Microservicio de productos desarrollado con **NestJS** y **Prisma**, diseñado para formar parte de una arquitectura de microservicios.

---

## 🚀 Entorno de Desarrollo (Dev)

Sigue estos pasos para levantar el proyecto en tu entorno local:

###
```bash
1️⃣ Clonar el repositorio
git clone https://github.com/Nest-Microservices-Kometha/products-ms.git
cd products-ms

2️⃣ Instalar dependencias
npm install

3️⃣ Configurar variables de entorno

Crea un archivo .env basado en el template proporcionado:

cp env.template .env

4️⃣ Ejecutar migraciones de Prisma
npx prisma migrate dev

5️⃣ Iniciar el microservicio en modo desarrollo
npm run start:dev


Product Microservice — Nest Microservices Kometha