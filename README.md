# INF331-evaluaciones
# Resumen
RunTrack es una plataforma web diseñada para corredores y organizadores de carreras. Su objetivo es simplificar la participación en eventos de running, permitiendo a los organizadores publicar carreras y a los corredores inscribirse, compartir resultados y valorar experiencias. 
Esta primera entrega se enfoca en implementar un CRUD básico para las funcionalidades principales.
# Tecnologías Usadas
*Frontend:* NextJS

*Backend:* NodeJS

*Base de Datos:* MongoDB

*Testing:*  Azure

*Control de Versiones:* Git con GitHub

*Metodología:* Kanban con JIRA

*CI/CD:* GitHub Actions

# Instalación

  ## Requisitos Previos
    Node.js (v14 o superior)
    MongoDB
  ## Levantamineto del Backend
    cd BE
    yarn install
    npm install dotenv
    npm install express mongoose cors
    Cp .env.example .env
    #Esto crea el archivo .env y donde debes poner la URL de la base de datos en la variable 'MONGO_URI=' y pegas tu URL
    node src/server.js
  ## Levantamiento del Frontend
    cd FE #Moverse a la carpeta de Frontend
    yarn install
    yarn dev
# Tutorial de instalacion
  https://youtu.be/r1T_bT_pjeA

# Avances 
  ##  Acceso a la aplicación  
  - **URL de producción**: [https://grupo9-proyecto.eastus.cloudapp.azure.com/](https://grupo9-proyecto.eastus.cloudapp.azure.com/)  

  ## ⚙️ CI/CD Automatizado  
  - **GitHub Actions**:  
    - Se ejecuta en cada `push/merge` a `master`.  
    - Despliega automáticamente en la VM de Azure.  
    - Notifica resultados vía Slack.  
    ![Badge](https://github.com/inf-331-grupo-9/proyecto/blob/master/.github/workflows/deploy.yml)  

## 📚 Documentación técnica  
Detalles completos en la [Wiki del proyecto](https://github.com/inf-331-grupo-9/proyecto/wiki)

  
    
# Licencia
Este proyecto está bajo la [MIT License](./LICENSE)
