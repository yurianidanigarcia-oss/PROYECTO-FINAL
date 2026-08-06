## 📦 Plan de Respaldos (Backups)

### 1. Información Respaldada
* **Base de Datos PostgreSQL:** Copia de seguridad completa del esquema (tablas, restricciones) y los datos contenidos (`pg_dump`).
* **Variables de Entorno:** Copia segura en gestor de secretos (1Password / Dashlane) de las credenciales de producción.

### 2. Frecuencia de Respaldos
* **Respaldos Automáticos:** Diarios a las 02:00 UTC (Baja concurrencia).
* **Retención:** 7 días de respaldos diarios y 4 respaldos semanales retenidos al mes.

### 3. Almacenamiento de Respaldos
* Almacenamiento seguro en **AWS S3 / Cloud Storage** en una región geográficamente distinta a la del servidor principal, con cifrado en reposo (AES-256).

### 4. Procedimiento de Recuperación Ante Fallos (Disaster Recovery)
1. **Identificación:** Detectar pérdida de integridad de datos o caída crítica mediante el endpoint `/health`.
2. **Aprovisionamiento:** Si la base de datos fue eliminada o corrupta, crear un nuevo cluster PostgreSQL.
3. **Restauración:** Ejecutar el comando de restauración desde la CLI con la última copia válida:
   ```bash
   pg_restore --clean --no-owner -h <HOST> -U <USUARIO> -d <NOMBRE_DB> backup_latest.dump