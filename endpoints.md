# Documentación de Endpoints

Este documento detalla los endpoints disponibles en la API, organizados por módulos.

## Autenticación

### `POST /register`
- **Descripción:** Registra un nuevo usuario.
- **Cuerpo de la Solicitud:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "username": "johndoe"
  }
  ```
- **Respuestas:**
  - `201 Created`: Usuario registrado exitosamente.
  - `400 Bad Request`: Solicitud inválida.

### `POST /login`
- **Descripción:** Inicia sesión de un usuario.
- **Cuerpo de la Solicitud:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Respuestas:**
  - `200 OK`: Usuario autenticado exitosamente.
  - `401 Unauthorized`: Credenciales inválidas.

### `POST /google-login`
- **Descripción:** Inicia sesión de un usuario utilizando autenticación de Google.
- **Cuerpo de la Solicitud:**
  ```json
  {
    "token": "ya29.a0AfH6SM..."
  }
  ```
- **Respuestas:**
  - `200 OK`: Usuario autenticado exitosamente.
  - `401 Unauthorized`: Token de Google inválido.

## Usuarios

### `GET /profile`
- **Descripción:** Recupera la información del perfil del usuario autenticado.
- **Respuestas:**
  - `200 OK`: Información del usuario.

### `GET /students`
- **Descripción:** Recupera una lista de todos los estudiantes.
- **Respuestas:**
  - `200 OK`: Lista de estudiantes.

### `GET /teachers`
- **Descripción:** Recupera una lista de todos los profesores.
- **Respuestas:**
  - `200 OK`: Lista de profesores.

## Períodos Académicos

### `POST /periods`
- **Descripción:** Crea un nuevo período académico.
- **Respuestas:**
  - `201 Created`: Período académico creado exitosamente.

### `GET /periods`
- **Descripción:** Recupera una lista de todos los períodos académicos.
- **Respuestas:**
  - `200 OK`: Lista de períodos académicos.

### `GET /periods/:id`
- **Descripción:** Recupera un período académico por su ID.
- **Respuestas:**
  - `200 OK`: Período académico encontrado.
  - `404 Not Found`: Período académico no encontrado.

### `PUT /periods/:id`
- **Descripción:** Actualiza un período académico existente por su ID.
- **Respuestas:**
  - `200 OK`: Período académico actualizado exitosamente.
  - `404 Not Found`: Período académico no encontrado.

### `DELETE /periods/:id`
- **Descripción:** Elimina un período académico por su ID.
- **Respuestas:**
  - `204 No Content`: Período académico eliminado exitosamente.
  - `404 Not Found`: Período académico no encontrado.

## Carreras

### `POST /careers`
- **Descripción:** Crea una nueva carrera.
- **Respuestas:**
  - `201 Created`: Carrera creada exitosamente.

### `GET /careers`
- **Descripción:** Recupera una lista de todas las carreras.
- **Respuestas:**
  - `200 OK`: Lista de carreras.

### `GET /careers/:uuid`
- **Descripción:** Recupera una carrera por su UUID.
- **Respuestas:**
  - `200 OK`: Carrera encontrada.
  - `404 Not Found`: Carrera no encontrada.

### `PUT /careers/:uuid`
- **Descripción:** Actualiza una carrera existente por su UUID.
- **Respuestas:**
  - `200 OK`: Carrera actualizada exitosamente.
  - `404 Not Found`: Carrera no encontrada.

### `DELETE /careers/:uuid`
- **Descripción:** Elimina una carrera por su UUID.
- **Respuestas:**
  - `204 No Content`: Carrera eliminada exitosamente.
  - `404 Not Found`: Carrera no encontrada.

## Asignaturas

### `POST /subjects`
- **Descripción:** Crea una nueva asignatura.
- **Respuestas:**
  - `201 Created`: Asignatura creada exitosamente.

### `GET /subjects`
- **Descripción:** Recupera una lista de todas las asignaturas.
- **Respuestas:**
  - `200 OK`: Lista de asignaturas.

### `GET /subjects/:uuid`
- **Descripción:** Recupera una asignatura por su UUID.
- **Respuestas:**
  - `200 OK`: Asignatura encontrada.
  - `404 Not Found`: Asignatura no encontrada.

### `PUT /subjects/:uuid`
- **Descripción:** Actualiza una asignatura existente por su UUID.
- **Respuestas:**
  - `200 OK`: Asignatura actualizada exitosamente.
  - `404 Not Found`: Asignatura no encontrada.

### `DELETE /subjects/:uuid`
- **Descripción:** Elimina una asignatura por su UUID.
- **Respuestas:**
  - `204 No Content`: Asignatura eliminada exitosamente.
  - `404 Not Found`: Asignatura no encontrada.

### `POST /subjects/:uuid/enroll`
- **Descripción:** Inscribe a un estudiante en una asignatura.
- **Respuestas:**
  - `200 OK`: Estudiante inscrito exitosamente.
  - `404 Not Found`: Asignatura o estudiante no encontrado.

## Planes de Estudio

### `POST /curriculums`
- **Descripción:** Crea un nuevo plan de estudio.
- **Respuestas:**
  - `201 Created`: Plan de estudio creado exitosamente.

### `GET /curriculums`
- **Descripción:** Recupera una lista de todos los planes de estudio.
- **Respuestas:**
  - `200 OK`: Lista de planes de estudio.

### `GET /curriculums/:uuid`
- **Descripción:** Recupera un plan de estudio por su UUID.
- **Respuestas:**
  - `200 OK`: Plan de estudio encontrado.
  - `404 Not Found`: Plan de estudio no encontrado.

### `PUT /curriculums/:uuid`
- **Descripción:** Actualiza un plan de estudio existente por su UUID.
- **Respuestas:**
  - `200 OK`: Plan de estudio actualizado exitosamente.
  - `404 Not Found`: Plan de estudio no encontrado.

### `DELETE /curriculums/:uuid`
- **Descripción:** Elimina un plan de estudio por su UUID.
- **Respuestas:**
  - `204 No Content`: Plan de estudio eliminado exitosamente.
  - `404 Not Found`: Plan de estudio no encontrado.

## Horarios

### `POST /schedules`
- **Descripción:** Crea un nuevo horario.
- **Respuestas:**
  - `201 Created`: Horario creado exitosamente.

### `GET /schedules`
- **Descripción:** Recupera una lista de todos los horarios.
- **Respuestas:**
  - `200 OK`: Lista de horarios.

### `GET /schedules/:uuid`
- **Descripción:** Recupera un horario por su UUID.
- **Respuestas:**
  - `200 OK`: Horario encontrado.
  - `404 Not Found`: Horario no encontrado.

### `PUT /schedules/:uuid`
- **Descripción:** Actualiza un horario existente por su UUID.
- **Respuestas:**
  - `200 OK`: Horario actualizado exitosamente.
  - `404 Not Found`: Horario no encontrado.

### `DELETE /schedules/:uuid`
- **Descripción:** Elimina un horario por su UUID.
- **Respuestas:**
  - `204 No Content`: Horario eliminado exitosamente.
  - `404 Not Found`: Horario no encontrado.

## Notas

### `POST /notes`
- **Descripción:** Crea una nueva nota.
- **Respuestas:**
  - `201 Created`: Nota creada exitosamente.

### `GET /notes`
- **Descripción:** Recupera una lista de todas las notas.
- **Respuestas:**
  - `200 OK`: Lista de notas.

### `GET /notes/:uuid`
- **Descripción:** Recupera una nota por su UUID.
- **Respuestas:**
  - `200 OK`: Nota encontrada.
  - `404 Not Found`: Nota no encontrada.

### `PUT /notes/:uuid`
- **Descripción:** Actualiza una nota existente por su UUID.
- **Respuestas:**
  - `200 OK`: Nota actualizada exitosamente.
  - `404 Not Found`: Nota no encontrada.

### `DELETE /notes/:uuid`
- **Descripción:** Elimina una nota por su UUID.
- **Respuestas:**
  - `204 No Content`: Nota eliminada exitosamente.
  - `404 Not Found`: Nota no encontrada.