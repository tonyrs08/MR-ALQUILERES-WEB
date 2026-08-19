# Reglas y Estándares del Proyecto - MR Alquileres

## 🚨 Regla Obligatoria de Validación y Control de Calidad
1. **Validación Exhaustiva de Código:**
   - Antes de dar por finalizado cualquier cambio, SIEMPRE se debe ejecutar una verificación de sintaxis en los archivos JavaScript modificados (ej. `node -c script.js`).
   - Comprobar que no queden bloques, funciones o estructuras de control (`if`, `addEventListener`, etc.) abiertas o mal cerradas.
   - Revisar que la estructura HTML y las llaves `{}` de CSS estén completamente íntegras.

2. **Verificación de Carga y Animaciones:**
   - Confirmar que las llamadas a funciones de renderizado inicial (ej. `renderCatalog()`, `recalcularEvento()`) y los observadores de visibilidad (`.reveal`) funcionen sin interrupciones.

3. **Gestión de Caché:**
   - Actualizar siempre el número de versión de caché (`?v=XX`) en `index.html` y el nombre de caché en `sw.js` para asegurar que el navegador cargue siempre la versión correcta.

4. **Principio de Cero Errores:**
   - Nunca declarar una tarea como "lista" o "completada" sin haber ejecutado las comprobaciones técnicas correspondientes.
