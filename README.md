# 🔧 maro-plugin-oc

Domina OpenShift desde la consola, sin distracciones ni clics.

Con este plugin, Maro se convierte en tu puente directo hacia clusters de OpenShift y OKD. Gestiona proyectos, pods, deployments, pipelines y configuraciones, todo desde la fluidez del terminal y la potencia de workflows automatizados.

Lleva el control de tu infraestructura containerizada sin abandonar tu entorno de trabajo natural.

---

## 📦 Capacidades principales

### 🌐 Gestión de Servidores y Proyectos
- Conectar múltiples clusters OpenShift (desarrollo, staging, producción)
- Autenticación con credenciales personalizadas por servidor
- Selección interactiva de proyectos/namespaces
- Soporte para entornos de producción y desarrollo

### 🚀 Operaciones de Pods
- Visualizar pods de un proyecto con filtrado
- Seguimiento en tiempo real de logs
- Descargar logs para análisis offline
- Ejecutar comandos dentro de pods (`oc exec`)
- Sesiones remotas interactivas
- Monitoreo de métricas en tiempo real

### 📦 Deployments y Aplicaciones
- Listar deployments de un proyecto
- Reiniciar deployments
- Gestionar fuentes de deployment
- Filtrado por tipo de aplicación

### ⚙️ Configuración y Secretos
- Crear, editar y eliminar ConfigMaps
- Crear, editar y eliminar Secrets
- Generación automática de ConfigMaps
- Integración con Vault para gestión de secretos
- Soporte para mock secrets en desarrollo

### 🔄 Pipelines CI/CD
- Visualizar PipelineRuns y TaskRuns
- Esperar a que pipelines completen
- Monitorear estado de ejecuciones
- Integración con Tekton Pipelines

### 🛣️ Recursos Adicionales
- Gestión de Routes
- Configuración de CronJobs
- Manipulación genérica de recursos Kubernetes/OpenShift

---

## 🔌 Integración con Maro

Este plugin se integra con el ecosistema Maro mediante:
- **Steps exportados**: `PromptOcServer`, `PromptOcProject`, `PromptOcPod`, `PromptOcDeployment`, `PromptOcConfigMaps`, `PromptOcSecrets`, `PromptOcPipeline`
- **Modelos de datos**: Clases tipadas para Pod, Deployment, ConfigMap, Secret, PipelineRun, Route, etc.
- **Configuración flexible**: Múltiples servidores, prefijos de namespace, templates de host
- **Dependencia**: Requiere `maro-plugin-vault` para gestión avanzada de secretos

## 🚀 Uso

### En workflows de Maro

```typescript
import { PromptOcServer, PromptOcProject, PromptOcPod } from 'maro-plugin-oc';

// Seleccionar servidor y proyecto
const server = await PromptOcServer.run(ctx);
const project = await PromptOcProject.run(ctx);

// Trabajar con pods
const pod = await PromptOcPod.run(ctx);
```

### Desde la línea de comandos

El plugin extiende las capacidades de Maro para trabajar con OpenShift, permitiendo la construcción de workflows complejos que combinen operaciones de infraestructura con otras herramientas del ecosistema.

---

Convierte cada intervención manual en un flujo reproducible y lleva la gestión de OpenShift a la velocidad del pensamiento.
