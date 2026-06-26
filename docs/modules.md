# Módulos principales del sistema - ReportaP'

## Descripción general

ReportaP' se divide en módulos funcionales que permiten registrar denuncias y propuestas ciudadanas, cruzarlas con datos públicos del Estado peruano, generar expedientes formales con IA y publicarlas en un mapa para que otros vecinos puedan apoyar o escalar el caso.

## Módulos del sistema

| Módulo | Responsabilidad | Se comunica con |
|---|---|---|
| Frontend Web/Móvil | Interfaz para ciudadanos. Permite registrar reportes, propuestas, fotos, ubicación GPS, visualizar el mapa y apoyar casos existentes. | Backend API |
| Backend API | Expone los endpoints principales, valida solicitudes, coordina reglas de negocio y conecta los módulos internos. | Frontend, base de datos, Cloudinary, Redis |
| Módulo de reportes | Gestiona denuncias ciudadanas, categorías, descripción, estado, ubicación y evidencia. | Backend API, PostGIS, Cloudinary, Workers |
| Módulo de propuestas | Gestiona iniciativas vecinales geolocalizadas y permite convertir propuestas en denuncias si existen proyectos públicos sin ejecutar. | Backend API, PostGIS, Workers, módulo comunitario |
| Módulo geoespacial | Procesa coordenadas, puntos en mapa, zonas territoriales y entidad responsable según ubicación. | PostGIS, GeoPerú / IDEPerú |
| Módulo de evidencia | Administra imágenes subidas por ciudadanos y evidencia adicional de vecinos. | Cloudinary, Backend API, base de datos |
| Módulo de datos del Estado | Consulta y cruza información pública de fuentes como INFOBRAS, MEF, INVIERTE.pe, OEFA, SEACE, GeoPerú, SIGERSOL, SUNASS y OSINERGMIN. | Workers, fuentes externas del Estado |
| Módulo de IA | Analiza descripción, foto y datos públicos para clasificar el caso y generar un expediente formal. | Claude API, Claude Vision, Workers |
| Módulo de expedientes | Estructura el reporte final con evidencia, entidad responsable, datos cruzados y acción sugerida. | IA, base de datos, Backend API |
| Módulo comunitario | Gestiona apoyos, firmas digitales, comentarios y evidencia adicional de vecinos. | Backend API, base de datos |
| Módulo de notificaciones / estado | Permite consultar el avance del reporte, estado del expediente y escalamiento comunitario. | Backend API, base de datos |
| Base de datos | Persiste usuarios, reportes, propuestas, firmas, evidencias, fuentes consultadas y expedientes generados. | Backend API, Workers |
| Workers asíncronos | Ejecutan tareas pesadas como consultas externas, análisis con IA y generación de expedientes sin bloquear al usuario. | Redis, IA, fuentes externas, base de datos |

## Diagrama de módulos

```mermaid
flowchart TD
    Usuario[Ciudadano / Vecino] --> Frontend[Frontend Web/Móvil]

    Frontend --> API[Backend API]

    API --> Reportes[Módulo de reportes]
    API --> Propuestas[Módulo de propuestas]
    API --> Comunidad[Módulo comunitario]
    API --> Expedientes[Módulo de expedientes]
    API --> Geo[Módulo geoespacial]
    API --> Evidencia[Módulo de evidencia]

    Reportes --> DB[(PostgreSQL + PostGIS)]
    Propuestas --> DB
    Comunidad --> DB
    Expedientes --> DB
    Geo --> DB
    Evidencia --> DB

    Evidencia --> Cloudinary[Cloudinary]

    API --> Redis[(Redis)]
    Redis --> Workers[Celery Workers]

    Workers --> Estado[Módulo de datos del Estado]
    Workers --> IA[Módulo de IA]
    Workers --> DB

    Estado --> INFOBRAS[INFOBRAS]
    Estado --> MEF[MEF / SIAF]
    Estado --> Invierte[INVIERTE.pe]
    Estado --> SEACE[OECE / SEACE]
    Estado --> OEFA[OEFA]
    Estado --> GeoPeru[GeoPerú / IDEPerú]
    Estado --> Otros[SIGERSOL / SUNASS / OSINERGMIN]

    IA --> Claude[Claude API]
    IA --> Vision[Claude Vision]

    Expedientes --> PDF[Expediente formal / PDF]
    Frontend --> Mapa[Mapa público de reportes y propuestas]
```

## Flujo principal de módulos - Denuncia ciudadana

```mermaid
sequenceDiagram
    actor Ciudadano
    participant Frontend
    participant API as Backend API
    participant Reportes as Módulo de reportes
    participant Evidencia as Módulo de evidencia
    participant Geo as Módulo geoespacial
    participant Worker as Worker asíncrono
    participant Estado as Datos del Estado
    participant IA as Módulo de IA
    participant Expediente as Módulo de expedientes
    participant DB as PostgreSQL + PostGIS

    Ciudadano->>Frontend: Registra denuncia con foto, ubicación y descripción
    Frontend->>API: Envía solicitud de creación
    API->>Reportes: Valida categoría y datos del reporte
    Reportes->>Evidencia: Solicita almacenamiento de imagen
    Evidencia-->>Reportes: Retorna URL de imagen
    Reportes->>Geo: Valida coordenadas y zona
    Geo-->>Reportes: Retorna ubicación territorial
    Reportes->>DB: Guarda denuncia inicial
    Reportes->>Worker: Encola procesamiento del caso
    API-->>Frontend: Confirma registro del reporte

    Worker->>Estado: Consulta fuentes públicas según categoría y ubicación
    Estado-->>Worker: Retorna datos cruzados

    Worker->>IA: Envía descripción, foto y datos del Estado
    IA-->>Worker: Retorna análisis y redacción estructurada

    Worker->>Expediente: Genera expediente formal
    Expediente->>DB: Guarda expediente generado

    Frontend->>API: Consulta estado del reporte
    API->>DB: Obtiene reporte actualizado
    API-->>Frontend: Muestra expediente y estado del caso
```

## Flujo principal de módulos - Propuesta vecinal

```mermaid
sequenceDiagram
    actor Ciudadano
    participant Frontend
    participant API as Backend API
    participant Propuestas as Módulo de propuestas
    participant Worker as Worker asíncrono
    participant Estado as Datos del Estado
    participant IA as Módulo de IA
    participant Comunidad as Módulo comunitario
    participant DB as PostgreSQL + PostGIS

    Ciudadano->>Frontend: Crea propuesta geolocalizada
    Frontend->>API: Envía datos de la propuesta
    API->>Propuestas: Valida descripción, categoría y ubicación
    Propuestas->>DB: Guarda propuesta inicial
    Propuestas->>Worker: Encola verificación con datos públicos
    API-->>Frontend: Confirma creación de propuesta

    Worker->>Estado: Consulta si existe proyecto o presupuesto relacionado
    Estado-->>Worker: Retorna coincidencias encontradas

    alt Existe proyecto público sin ejecutar
        Worker->>IA: Solicita conversión de propuesta en denuncia sustentada
        IA-->>Worker: Retorna expediente de denuncia
        Worker->>DB: Actualiza propuesta como denuncia escalable
    else No existe proyecto relacionado
        Worker->>IA: Solicita generación de petición formal inicial
        IA-->>Worker: Retorna documento base
        Worker->>DB: Guarda petición vecinal
    end

    Ciudadano->>Frontend: Firma o apoya propuesta
    Frontend->>API: Registra apoyo ciudadano
    API->>Comunidad: Valida firma o apoyo
    Comunidad->>DB: Actualiza contador de firmas
```

## Comunicación con fuentes del Estado por categoría

| Categoría | Fuentes consultadas | Resultado esperado |
|---|---|---|
| Obra pública paralizada | INFOBRAS, MEF/SIAF, OECE/SEACE | Identificar obra registrada, presupuesto, avance, entidad y contratista |
| Proyecto sin ejecutar | INVIERTE.pe, MEF | Identificar proyecto aprobado, presupuesto asignado y entidad ejecutora |
| Contaminación / humo / ruido | OEFA, GeoPerú | Identificar antecedentes ambientales y entidad competente |
| Basura / botadero ilegal | SIGERSOL, MINAM, GeoPerú | Identificar municipalidad responsable y sustento normativo |
| Agua sin servicio | SUNASS, GeoPerú | Identificar EPS responsable y datos de calidad del servicio |
| Alumbrado roto | OSINERGMIN, GeoPerú | Identificar distribuidora eléctrica y competencia municipal |
| Pista / vereda rota | GeoPerú | Identificar municipalidad responsable de vías locales |
| Parque descuidado | GeoPerú | Identificar municipalidad responsable |
| Inseguridad / delincuencia | GeoPerú | Identificar PNP, serenazgo o municipalidad competente |
| Construcción ilegal | GeoPerú | Identificar municipalidad responsable de licencias y fiscalización |

## Estados principales de un reporte

```mermaid
stateDiagram-v2
    [*] --> Registrado
    Registrado --> EnAnalisis: Se encola procesamiento
    EnAnalisis --> DatosCruzados: Se consultan fuentes públicas
    DatosCruzados --> ExpedienteGenerado: IA genera expediente
    ExpedienteGenerado --> Publicado: Se muestra en mapa público
    Publicado --> EnEscalamiento: Vecinos apoyan el caso
    EnEscalamiento --> SolicitudColectiva: Alcanza umbral de apoyo
    SolicitudColectiva --> Cerrado: Se registra respuesta o cierre del caso

    EnAnalisis --> RequiereRevision: Error o datos insuficientes
    RequiereRevision --> EnAnalisis: Se corrige información
```

## Estados principales de una propuesta

```mermaid
stateDiagram-v2
    [*] --> Creada
    Creada --> EnVerificacion: Se cruzan datos públicos
    EnVerificacion --> ConvertidaEnDenuncia: Existe proyecto o presupuesto sin ejecutar
    EnVerificacion --> PublicadaComoPropuesta: No existe proyecto relacionado
    PublicadaComoPropuesta --> RecibiendoFirmas: Vecinos apoyan la propuesta
    RecibiendoFirmas --> PeticionFormal: Alcanza umbral de firmas
    PeticionFormal --> Cerrada: Se registra respuesta o cierre

    EnVerificacion --> RequiereRevision: Datos insuficientes o error
```

## Reglas iniciales de negocio

- Una denuncia debe contener como mínimo descripción, categoría, ubicación y evidencia fotográfica.
- Una propuesta debe contener descripción, ubicación y categoría de intervención.
- Todo reporte o propuesta debe asociarse a coordenadas geográficas.
- El sistema debe identificar la entidad responsable según ubicación y categoría.
- El análisis con IA se ejecuta de forma asíncrona para no bloquear al usuario.
- Los expedientes se generan usando la descripción ciudadana, evidencia fotográfica y datos cruzados del Estado.
- Las propuestas pueden convertirse en denuncias si se encuentra un proyecto público aprobado o presupuesto asignado sin ejecución.
- Los reportes pueden escalar a solicitud colectiva cuando alcanzan un umbral mínimo de apoyo ciudadano.
- El mapa público muestra reportes, propuestas y estados relevantes para fomentar participación vecinal.
