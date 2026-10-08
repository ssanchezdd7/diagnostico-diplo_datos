# Diagnóstico de la diplomatura · IIEE

Aplicación estática en español, con JavaScript equivalente a una solución frontend sin compilador. Incluye SheetJS CE 0.20.3 y Chart.js 4.5.1 dentro de `dist/vendor`; no carga bibliotecas desde servicios externos durante el uso. No necesita paquetes npm ni claves.

## Ejecutar

Con Node.js instalado, desde esta carpeta:

```sh
npm start
```

Abrir `http://127.0.0.1:4173`. También se puede abrir `dist/index.html` directamente en un navegador. El servidor incluido solo entrega archivos estáticos; no tiene API ni recibe la encuesta.

## Versión estática

```sh
npm run build
npm test
```

La carpeta `dist` es la versión completa para cualquier alojamiento estático. No publicar el Excel ni incorporar respuestas en el código. Se entrega con un recurso de resultados agregados generado del Excel real, que se carga automáticamente.

## Cargar nuevas exportaciones

Esta carga es opcional, desde “Analizar otro Excel”; no se necesita para abrir el tablero.

1. Exportar respuestas de Google Sheets a Excel (.xlsx) o CSV. La primera fila debe contener encabezados únicos y completos.
2. Elegir el archivo en la aplicación. Si tiene varias hojas, seleccionar la correspondiente.
3. Revisar resumen y vista previa protegida. Confirmar las opciones completas de selección múltiple; no dividir automáticamente por comas. Las dos preguntas conocidas tienen opciones con comas internas.
4. Revisar campos nuevos, escalas, fechas ambiguas y reglas en Configuración. Los campos nuevos empiezan excluidos.
5. Explorar las cuatro vistas y combinar filtros. Una nueva exportación sustituye la anterior. Limpiar datos restablece toda la sesión.

## Configuración de preguntas

La fuente editable es `dist/questions.json`. Contiene encabezados originales, títulos breves, roles, tipos, dimensiones, orden ordinal, opciones completas y categorías de necesidad/fortaleza. Identifica preguntas por encabezado normalizado y admite columnas reordenadas. Ejecutar `npm run build` después de modificarla para regenerar `config.js`.

También se puede configurar cada campo en la interfaz y descargar/cargar el JSON de configuración. Ese archivo no contiene respuestas ni equivalencias de organismos. Los cambios en la interfaz duran solo durante la sesión, salvo descarga explícita. `curriculum` contiene los ocho módulos enumerados en el programa oficial y el TIF, con páginas de referencia y límites de cobertura. `moduleIds`, `content` y `curriculumNote` documentan y permiten editar la correspondencia pedagógica por pregunta. Esta correspondencia no forma parte de una prueba de desempeño.

Roles: `date`, `organism`, `profile`, `question`, `excluded`. Tipos: `date`, `category`, `ordinal`, `multiple`, `text`. `order`, `need`, `strength`, `options` y `moduleIds` son listas de textos completos. `multiple` necesita confirmación; `splitMode: "options"` consume etiquetas completas y marca textos desconocidos como no interpretables. Para nuevas encuestas se puede confirmar un `separator` literal mediante `splitMode: "separator"`.

## Criterios del análisis

- Registro importado válido: fila no vacía; no se eliminan duplicados. Se informa coincidencia exacta de todos los campos.
- Base por pregunta: respuestas no vacías e interpretables. Se informan aparte vacías y no interpretables. “No sabe”, “No corresponde” y niveles bajos conservan sus categorías.
- Selección múltiple: participantes únicos por opción; los porcentajes pueden superar 100 % al sumarse.
- Necesidad y fortaleza: conteo de participantes cuyas respuestas coinciden con categorías explícitas y editables; no hay puntajes, índices ni semáforos. Una persona cuenta una vez en cada regla.
- Se declaran familiaridad y prácticas, no desempeño observado. Muestreo y series de tiempo no pueden separarse a partir de la pregunta general. Sistemas de información no tiene una pregunta específica.
- Normalización: espacios, mayúsculas y acentos; las variantes del IIEE se unifican bajo Instituto de Investigaciones Económicas y Estadísticas por indicación del usuario. El número de organismos puede incluir variantes sin homologar. Los valores no reconocidos como etiquetas institucionales se protegen.
- Comparaciones descriptivas, con tamaño del grupo y base por pregunta. Menos de 5 respuestas válidas se señala como grupo pequeño. No se infiere representatividad del sector público.
- Los textos libres muestran cobertura, sin exponer respuestas individuales ni asignar temas automáticamente.

## Privacidad

El Excel nunca se incorpora al sitio. La fuente inicial contiene tablas de frecuencias, sin filas individuales, identificadores, textos libres ni marcas temporales individuales. La aplicación usa File API y memoria del navegador; no usa almacenamiento web, cookies, service workers, analítica ni llamadas de red. La política CSP limita las conexiones al mismo origen para leer el JSON estático. No se envían respuestas a ningún servicio. Los identificadores por encabezado, correos y números largos se protegen. Los posibles nombres personales en organismo quedan como valores pendientes de revisión. Las descargas CSV son tablas agregadas; se neutralizan fórmulas de hoja de cálculo. Limpiar datos elimina el análisis local, los filtros y los resultados de esa sesión. Recargar elimina ese estado y vuelve a abrir la fuente inicial agregada.

La detección preventiva de identificadores es conservadora y no puede reconocer todas las formas posibles de datos personales. Revisar la configuración antes de incorporar nuevas preguntas o formatos de encuesta. Los textos libres permanecen ocultos.

## Bibliotecas y licencias

SheetJS CE: Apache 2.0 · [instalación oficial](https://docs.sheetjs.com/docs/getting-started/installation/standalone/).
Chart.js: MIT · [integración oficial](https://www.chartjs.org/docs/latest/getting-started/integration.html).

## Verificación

`npm test` verifica porcentajes y denominadores, opciones con comas internas, categorías desconocidas, vacías, filtros combinados, fechas ambiguas, duplicados, protección y CSV. La prueba de integración `tests/workbook.test.cjs` acepta la ruta del Excel original como argumento y no almacena registros. Los resultados de la revisión se documentan en `VERIFICACION.md`.

## Programa oficial incorporado

Fuente: “Diplomatura en Producción, Análisis y Comunicación de Datos Estadísticos.pdf”, adjuntado por el usuario. Estructura de contenidos: páginas 5–7; TIF: página 9; cronograma: páginas 10–11. Se incorporan títulos, síntesis de contenidos y referencias de página, sin copiar el PDF dentro de la aplicación.

La vinculación distingue contenidos oficiales de decisiones pedagógicas revisables. Python / R no se desagrega en la encuesta; el módulo V menciona Excel e introducción a Python. El uso de herramientas de informes no se equipara al dominio de comunicación estratégica. No hay diagnóstico específico de muestreo, series de tiempo, sistemas de información o el enfoque ético y humanizador del módulo VIII.

El documento menciona “siete módulos” en duración y cronograma, aunque la estructura y la tabla enumeran ocho (I–VIII). La aplicación conserva esa enumeración y señala la discrepancia, sin modificar el programa original.

## Apertura automática y actualización de la fuente

El tablero abre con resumen, todos los gráficos de preguntas, dimensiones y comparaciones. La fecha de actualización se muestra en la cabecera. `dist/data/diagnostico.json` contiene resultados agregados separados del código de interfaz. En un sitio estático se lee mediante fetch al mismo origen; `diagnostico.js` es una envoltura del mismo recurso para permitir abrir `index.html` con doble clic, sin servidor. No se cargan Excel ni planillas embebidas.

Para actualizar, reemplazá la exportación original fuera de `dist` y ejecutá desde esta carpeta:

```sh
node generate-data.cjs "RUTA/AL/NUEVO-EXCEL.xlsx" "Respuestas de formulario 1" "2026-10-07"
npm run build
npm test
```

Sustituí la fecha por el día real de actualización. Si se omite, se usa la fecha del proceso en America/Buenos_Aires. Se puede omitir la hoja para usar la primera. El generador inspecciona encabezados, omite filas vacías e identificadores y usa la configuración de preguntas. Rechaza opciones múltiples desconocidas y fechas ambiguas para que se revisen antes de publicar. Nunca copia el Excel ni escribe sus respuestas individuales. Publicá solo `dist`.

## Privacidad y filtros de la fuente inicial

Todos los organismos conservan su etiqueta normalizada, cualquiera sea su cantidad de respuestas. Los vacíos y los valores no identificables se muestran en categorías separadas. Los posibles nombres personales permanecen excluidos de las etiquetas.

El JSON contiene frecuencias por pregunta para grupos y combinaciones autorizadas de filtros, sin unir las respuestas de distintas preguntas en registros individuales. Mantiene exactos los totales, denominadores y faltantes de las selecciones disponibles. Todos los cruces incluyen sus frecuencias, porcentajes y bases, incluso cuando reúnen entre una y cuatro respuestas. No hay supresión por tamaño de grupo. Las descargas CSV también incluyen estos resultados.

Se admiten selección múltiple de grupos de organismos y de las cinco opciones de vínculo; dentro de cada campo se usa “o” y entre campos “y”. Los filtros por respuestas ausentes de vínculo no se ofrecen en la fuente publicada, pues podrían aislar una persona; las ausencias siguen informándose en denominadores. Las configuraciones de interpretación se modifican en `questions.json` y requieren regenerar el recurso. El modo de otro Excel conserva la configuración editable en memoria.

Se eliminó el umbral mínimo por solicitud del usuario. Se mantienen los conteos y tamaños de grupo para interpretar las comparaciones. El recurso contiene tablas de frecuencias por pregunta; no incluye el Excel, nombres, correos, textos libres ni marcas temporales individuales.

## Agrupación del IIEE

Se unifican las etiquetas que contienen la sigla IIEE (incluidas IPC IIEE, Hacienda IIEE encuestadora EPH e IIEE - Min de Economia), las variantes ortográficas del nombre completo y “Instituto de estadística”. La regla se aplica en `dist/core.js`, tanto al regenerar la fuente como al analizar otra exportación local. Las entradas que solo mencionan el Ministerio de Economía se mantienen separadas. Con el Excel inicial, el grupo reúne 26 respuestas y quedan 22 etiquetas institucionales, además de las categorías sin organismo o protegido.
