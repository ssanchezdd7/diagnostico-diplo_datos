<p align="center">
  <img src="logo-economicas-uccuyo.png" alt="Facultad de Ciencias Económicas y Empresariales · Universidad Católica de Cuyo" width="560">
</p>

# 📊 Diagnóstico de la diplomatura · IIEE

<p align="center">
  <a href="#-cómo-usar-el-tablero"><img alt="Guía de uso" src="https://img.shields.io/badge/Gu%C3%ADa_de_uso-245f9f?style=for-the-badge"></a>
  <a href="#-publicar-en-github-pages"><img alt="Publicar sitio" src="https://img.shields.io/badge/Publicar_sitio-177f83?style=for-the-badge"></a>
  <a href="#-actualizar-los-resultados"><img alt="Actualizar datos" src="https://img.shields.io/badge/Actualizar_datos-142e50?style=for-the-badge"></a>
  <a href="#-datos-y-privacidad"><img alt="Datos y privacidad" src="https://img.shields.io/badge/Datos_y_privacidad-617289?style=for-the-badge"></a>
</p>


Tablero interactivo para explorar los resultados del diagnóstico inicial de la Diplomatura en Producción, Análisis y Comunicación de Datos Estadísticos.

Presenta conocimientos y experiencias declarados por los participantes y propone nuevas preguntas para profundizar el diagnóstico. Los resultados provienen de la encuesta original; las preguntas propuestas todavía no tienen respuestas recopiladas.

## 🧭 Cómo usar el tablero

1. **Resumen general:** consultá el panorama completo y los gráficos de la encuesta.
2. **Filtros:** elegí organismos y vínculos con los datos. El contador indica cuántas respuestas estás viendo. Usá **Restablecer filtros** para volver al total.
3. **Por pregunta:** seleccioná una pregunta del menú o buscá una palabra.
4. **Comparar grupos:** elegí el campo de agrupación y la pregunta que querés comparar.
5. **Profundizar el diagnóstico:** consultá las preguntas propuestas para una próxima encuesta, incluido el módulo de series de tiempo.
6. **Glosario:** encontrá explicaciones sencillas de los términos y una guía de uso.

La aplicación abre con los resultados disponibles. No es necesario cargar un archivo. La opción **Analizar otro Excel** permite explorar una exportación local únicamente durante la sesión; no actualiza el sitio publicado.

## 🔎 Cómo interpretar los resultados

- Los porcentajes se calculan sobre las respuestas válidas de cada pregunta. Las respuestas vacías y no interpretables se informan por separado.
- En preguntas de selección múltiple, una persona puede elegir varias opciones; los porcentajes pueden sumar más de 100 %.
- Dentro de un mismo filtro se incluyen las opciones seleccionadas; entre distintos filtros se exige cumplir ambos criterios.
- Las variantes del nombre del IIEE se agrupan como **Instituto de Investigaciones Económicas y Estadísticas**. Las menciones generales al Ministerio de Economía se mantienen separadas.
- Se muestran los grupos pequeños y sus bases. Las comparaciones son descriptivas y no prueban diferencias estadísticas ni representatividad.
- Los conocimientos son declarados por los participantes: no equivalen a una evaluación de desempeño.

La fecha de actualización y el total de respuestas aparecen en el tablero.

## 🚀 Publicar en GitHub Pages

Este repositorio contiene la versión estática del sitio: `index.html` debe estar en la raíz, junto con los demás archivos y las carpetas `data` y `vendor`.

1. Subí todo el contenido de la carpeta `dist` al repositorio, conservando las subcarpetas.
2. Entrá a **Settings → Pages**.
3. En **Source**, seleccioná **Deploy from a branch**.
4. Elegí la rama **main** y la carpeta **/(root)**; presioná **Save**.
5. Cuando termine la publicación, GitHub mostrará el enlace del sitio en esa pantalla.

No subas el ZIP ni el Excel original. Para este sitio no se necesita backend, base de datos, autenticación ni un proceso de compilación en GitHub.

[Documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 💻 Abrir en la computadora

Descargá y descomprimí los archivos. Abrí `index.html` en un navegador actualizado. Conservá los archivos y subcarpetas juntos.

## 🔒 Datos y privacidad

La fuente inicial está en `data/diagnostico.json`, separada del código de la interfaz. `data/diagnostico.js` contiene el mismo recurso en un formato que permite abrir el sitio con doble clic.

La versión publicada contiene tablas agregadas, sin nombres, correos, textos libres ni filas de respuestas individuales. Incluye frecuencias de grupos pequeños: los datos publicados son accesibles para cualquier visitante.

La aplicación no guarda nuevas respuestas ni conserva filtros o cambios al cerrar o recargar la página. No usa almacenamiento persistente del navegador ni envía respuestas a servicios externos. Las bibliotecas están incluidas en `vendor`.

## 🔄 Actualizar los resultados

La actualización se realiza con el **proyecto completo de desarrollo**, que incluye `generate-data.cjs`, `build.cjs` y las pruebas. Esos archivos no son necesarios para alojar el sitio y no forman parte de esta carpeta de publicación.

1. Guardá la nueva exportación Excel fuera de la carpeta pública `dist`.
2. Desde la carpeta del proyecto completo, con Node.js instalado, ejecutá:

```sh
node generate-data.cjs "RUTA/AL/NUEVO-EXCEL.xlsx" "Respuestas de formulario 1"
npm run build
npm test
```

El segundo argumento debe coincidir con el nombre de la hoja. Al no indicar una fecha, se usa el día de ejecución en la zona horaria de Buenos Aires.

3. Revisá el tablero generado: total de respuestas, fecha, categorías y filtros. Si cambiaron los encabezados u opciones, revisá `dist/questions.json` antes de regenerar los datos.
4. Reemplazá los archivos publicados con el contenido actualizado de `dist`, manteniendo sus carpetas. No subas el Excel.

## 🛠️ Tecnologías

HTML, CSS y JavaScript. Gráficos con Chart.js y lectura local de planillas con SheetJS CE. No se requieren claves de servicios.

Las bibliotecas de terceros conservan sus propias licencias: Chart.js (MIT) y SheetJS CE (Apache 2.0). Los logos institucionales pertenecen a sus respectivos titulares.
