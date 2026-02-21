# Challenge NimbleGravity – Postulación a Empleo

Aplicación desarrollada en React que consume una API para:

- Obtener datos del candidato por email (Step 2)
- Obtener la lista de posiciones disponibles (Step 3)
- Mostrar posiciones con input de repositorio y botón de envío (Step 4)
- Enviar la postulación a una posición (Step 5)

---

## Requisitos

- Node.js
- npm

---

## Instalación y ejecución

### 1) Instalar dependencias

```bash
npm install
```

### 2) Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto (junto a `package.json`):

```env
VITE_BASE_URL=https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net
```

### 3) Ejecutar el proyecto

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

---

## Cumplimiento de los Steps

### Step 2 — Obtener datos del candidato

1. Ingresar el correo electrónico.
2. Presionar **"Obtener Candidato"**.

La aplicación realiza la llamada:

```
GET {BASE_URL}/api/candidate/get-by-email?email=TU_EMAIL
```

La respuesta incluye:

```json
{
  "uuid": "...",
  "candidateId": "...",
  "applicationId": "...",
  "firstName": "...",
  "lastName": "...",
  "email": "..."
}
```

Se almacenan `uuid` y `candidateId` para utilizarse en el envío de la postulación.

---

### Step 3 — Obtener lista de posiciones abiertas

Al cargar la aplicación se realiza automáticamente la llamada:

```
GET {BASE_URL}/api/jobs/get-list
```

Respuesta esperada:

```json
[
  { "id": "4416372005", "title": "Fullstack developer" },
  { "id": "9100000001", "title": "Head Chef" }
]
```

---

### Step 4 — Mostrar listado de posiciones

Se renderiza dinámicamente la lista de posiciones obtenidas desde la API.

Cada posición incluye:

- Título (`title`)
- Input para ingresar la URL del repositorio de GitHub
- Botón **"Enviar"** para postularse

---

### Step 5 — Enviar postulación

Al presionar **"Enviar"** en una posición, la aplicación realiza:

```
POST {BASE_URL}/api/candidate/apply-to-job
```

Con el siguiente body:

```json
{
  "uuid": "uuid obtenido en Step 2",
  "jobId": "id de la posición seleccionada",
  "candidateId": "candidateId obtenido en Step 2",
  "repoUrl": "https://github.com/tu-usuario/tu-repo"
}
```

Respuesta exitosa esperada:

```json
{ "ok": true }
```

---

## Manejo de estados y errores

La aplicación incluye:

- Estado de carga al obtener posiciones
- Estado de carga al obtener datos del candidato
- Estado de carga independiente al enviar cada postulación
- Manejo de errores de red
- Manejo de errores devueltos por la API
- Mensajes visuales de éxito y error

---

## Estructura del proyecto

```
src/
  api/
    botfilter.js
  components/
    JobList.jsx
    JobItem.jsx
  pages/
    ApplyPage.jsx
  styles.css
  main.jsx
  App.jsx
```

