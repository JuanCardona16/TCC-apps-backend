# Rol de adminitrador

- Funcionalidades y casos de uso del rol de administrador.
- Flujo de datos y acciones para cada caso de uso, incluyendo las interacciones con la API.
- Esquema de MongoDB para las colecciones necesarias.
- Documentos de ejemplo con información falsa para llenar la base de datos.
- Código para inicializar MongoDB con los datos de prueba.
- Simulación del flujo del administrador con ejemplos de solicitudes API.

## Funcionalidades y Casos de Uso del Rol de Administrador

El administrador es responsable de configurar y supervisar el sistema académico. Los casos de uso son:

- Iniciar Sesión:
  - Autenticarse para acceder al sistema.
- Crear/Modificar/Eliminar Carreras:
  - Gestionar carreras (por ejemplo, "Ingeniería de Sistemas", "Medicina").
- Crear/Modificar/Eliminar Pensums (Curriculums):
  - Definir las materias por semestre para una carrera.
- Crear/Modificar/Eliminar Períodos Académicos:
  - Configurar semestres (por ejemplo, "2025-1").
- Crear/Modificar/Eliminar Materias:
  - Registrar materias con créditos, prerrequisitos, y asociarlas a períodos.
- Asignar Profesores a Materias:
  - Vincular profesores a materias específicas.
- Crear/Modificar/Eliminar Horarios:
  - Definir horarios de clases (día, hora, aula).
- Crear/Modificar/Eliminar Usuarios:
  - Gestionar estudiantes y profesores.
- Generar Reportes Globales:
  - Obtener reportes de notas, matriculaciones o horarios.
- Enviar Notificaciones Globales (opcional):
  - Enviar alertas a estudiantes o profesores.
