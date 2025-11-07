/**
 * NaturaVida · Catálogo Interactivo
 * Backend en Google Apps Script
 */

const SPREADSHEET_ID = "1JFF44nFhV0HBm7L3o2f8_UzOHtGyZ255tNFAB1xniHs";
const HOJA = "Productos";
const FOLDER_ID = "1w6G3v60iCmbeUxDCguGg_3M96aKdF6nY";

/**
 * Punto de entrada del Web App.
 */
function doGet() {
  return HtmlService
    .createTemplateFromFile("Index")
    .evaluate()
    .setTitle("NaturaVida · Catálogo Interactivo")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
}

/**
 * Incluye archivos HTML parciales.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Lee todos los productos desde la hoja configurada.
 * Retorna un arreglo de objetos con claves igual a los encabezados.
 */
function getAllProducts() {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(HOJA);
  if (!sh) {
    throw new Error("No se encontró la hoja de productos configurada.");
  }

  const data = sh.getDataRange().getValues();
  if (data.length < 2) {
    return [];
  }

  const headers = data.shift();
  const productos = [];

  data.forEach(function(row) {
    const concatenado = row.map(function(v) { return v === null ? "" : String(v); }).join("").trim();
    if (concatenado === "") {
      return;
    }

    const obj = {};
    headers.forEach(function(h, i) {
      obj[h] = row[i];
    });

    if (!obj.ID_Producto) {
      return;
    }

    if (obj.Precio !== "" && !isNaN(obj.Precio)) {
      obj.Precio = Number(obj.Precio);
    }

    productos.push(obj);
  });

  return productos;
}

/**
 * Guarda o actualiza un producto.
 * Si base64Image no es nulo, almacena la imagen en Drive y actualiza Imagen_URL_1.
 */
function saveProduct(producto, base64Image) {
  if (!producto || !producto.ID_Producto) {
    throw new Error("El campo ID_Producto es obligatorio.");
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(HOJA);
  if (!sh) {
    throw new Error("No se encontró la hoja de productos configurada.");
  }

  const data = sh.getDataRange().getValues();
  const headers = data.shift();

  let rowIndex = -1;
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(producto.ID_Producto)) {
      rowIndex = i + 2;
      break;
    }
  }

  if (base64Image) {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const parts = String(base64Image).split(",");
    if (parts.length === 2) {
      const meta = parts[0];
      const b64 = parts[1];
      const mimeMatch = meta.match(/data:(.*?);base64/);
      const contentType = mimeMatch && mimeMatch[1] ? mimeMatch[1] : "image/png";
      const bytes = Utilities.base64Decode(b64);
      const blob = Utilities.newBlob(bytes, contentType, "producto_" + producto.ID_Producto + "_" + Date.now());
      const file = folder.createFile(blob);
      producto.Imagen_URL_1 = file.getUrl();
    }
  }

  const fila = headers.map(function(h) {
    return Object.prototype.hasOwnProperty.call(producto, h) ? producto[h] : "";
  });

  if (rowIndex === -1) {
    sh.appendRow(fila);
  } else {
    sh.getRange(rowIndex, 1, 1, fila.length).setValues([fila]);
  }

  return "Producto guardado correctamente.";
}

/**
 * Elimina un producto por ID.
 */
function deleteProduct(id) {
  if (!id) {
    throw new Error("Se requiere el ID_Producto para eliminar.");
  }

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(HOJA);
  if (!sh) {
    throw new Error("No se encontró la hoja de productos configurada.");
  }

  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sh.deleteRow(i + 1);
      return "Producto eliminado correctamente.";
    }
  }

  throw new Error("No se encontró un producto con el ID especificado.");
}

/**
 * Obtiene el listado de categorías distintas, útil para filtros.
 */
function getDistinctCategories() {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(HOJA);
  if (!sh) {
    throw new Error("No se encontró la hoja de productos configurada.");
  }

  const data = sh.getDataRange().getValues();
  if (data.length < 2) {
    return [];
  }

  const headers = data.shift();
  const idx = headers.indexOf("Categoria");
  if (idx === -1) {
    return [];
  }

  const set = {};
  data.forEach(function(row) {
    const cat = String(row[idx] || "").trim();
    if (cat) {
      set[cat] = true;
    }
  });

  return Object.keys(set).sort();
}
