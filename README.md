# NaturaVida · Catálogo Interactivo

Proyecto listo para importar en Google Apps Script y publicar como Web App conectado a una hoja de cálculo con la hoja `Productos` y una carpeta de imágenes en Google Drive.

## Archivos principales

- `Code.gs`: backend con funciones `doGet`, `include`, `getAllProducts`, `saveProduct`, `deleteProduct`, `getDistinctCategories`.
- `Index.html`: estructura principal de la interfaz.
- `Head.html`: metadatos y carga de fuentes y estilos.
- `Navbar.html`: barra superior.
- `Footer.html`: pie de página.
- `Styles.html`: estilos completos en modo oscuro elegante.
- `Scripts.html`: lógica de interacción, filtros, modal y CRUD con `google.script.run`.
- `appsscript.json`: configuración del proyecto Apps Script.

## Pasos de implementación

1. Crear una hoja de cálculo con la hoja `Productos` y las columnas mínimas:
   `ID_Producto`, `Nombre_Producto`, `Categoria`, `Descripcion_Corta`, `Precio`, `Imagen_URL_1`.
2. Crear una carpeta en Google Drive para almacenar las imágenes.
3. Actualizar en `Code.gs` las constantes:
   - `SPREADSHEET_ID`
   - `FOLDER_ID`
4. En Google Apps Script:
   - Crear un proyecto.
   - Crear los archivos con el mismo nombre y pegar el contenido correspondiente.
   - Reemplazar el contenido de `appsscript.json` en la configuración del proyecto.
5. Implementar como Web App desde `Publicar` o `Implementar`, seleccionando:
   - `Ejecutar la aplicación como`: propietario.
   - `Quién tiene acceso`: según el objetivo (por ejemplo, cualquier usuario con el vínculo).