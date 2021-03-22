# dectector-mutantes

## DETECTOR DE MUTANTES

Magneto quiere reclutar la mayor cantidad de mutantes para poder luchar
contra los X-Men.
Te ha contratado a ti para que desarrolles un proyecto que detecte si un
humano es mutante basándose en su secuencia de ADN.

# Pasos para compilar

1. Instalar Mongodb y crear una base de datos llamada "magnetomutants".
2. Instalar NodeJs
3. Clonar el repositorio https://github.com/trentmind/dectector-mutantes.git
4. Instalar los paquetes usando el comando "npm install"
5. Compilar usando la instrucción npm run build
6. Correr pruebas usando la instrucción npm test
7. Limpiar base de datos usando la instruccion npm run clean-database

# Pasos para ejecutar
 
 1. Arrancar aplicación de node usando el comando npm start
 2. Formato revisión de secuencia:

        POST → /api/mutant/
        {
        “dna”:["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]
        }
3. Formato revisión de estadisticas

        GET → /api/stats


Rafael Albarracin