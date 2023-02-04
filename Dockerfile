#Indicamos la imagen base, en este caso empleamos node v.18
FROM node:18

#Instalamos nodemon
RUN npm install -g nodemon

#Creamos la carpeta principal que contendrá el código fuente
RUN mkdir -p /usr/src/app

#Nos ubicamos en la carpeta app
WORKDIR /usr/src/app

#Copiamos package.json en el directorio actual de la imagen
COPY package*.json ./

#Instalamos todos los módulos y dependencias
RUN  npm install

#Copiamos todo en el directorio actual de la imagen
COPY . .

#Inico de la app
CMD ["npm", "run", "dev"]