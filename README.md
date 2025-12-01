# Api proyectProduct de Express con Typescript

Base para el proyecto proyectProduct de Express.ts con entornos de ejecución y manejo de errores.

## Sobre la API:

Esta API fue construida de manera híbrida. Es decir, la parte de Repositories, Services y Controllers está desarrollada bajo el paradigma OOP (Programación Orientada a Objetos). Sin embargo, los routers y la aplicación en sí no lo están.

En esta plantilla encontrará ambos paradigmas funcionando codo a codo. A partir de aquí, puede adaptarla según su preferencia. Si bien está construida de una manera básica, es funcional. Al revisar el código podrá ver, si desea mantener este enfoque, cómo continuar. ¡Buena suerte y buen código!

## Cómo comenzar:

### Instalaciones:

La app viene con las instalaciones básicas para comenzar a trabajar con Sequelize y una base de datos PostgreSQl. Las variables de entorno vienen ya con un usuario por defecto (random) y una base de datos ficticia, usted deberia cambiar esto por su propia base de datos apropiada para cada entorno.

### Scripts disponibles:

- `npm start`: Inicializa la app en modo producción con Node.js y Express (.env.production).
- `npm run dev`: Inicializa la app en modo desarrollo con jsx y Express (.env.development).
- `npm test`: Ejecuta todos los tests. También puede ejecutarse un test específico, por ejemplo: `npm test EnvDb`. La app se inicializa en modo test (.env.test).
