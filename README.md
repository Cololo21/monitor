dashboard/
│
├── index.html                  # App principal
│
├── core/
│   ├── api.js                  # REST API
│   ├── websocket.js            # SSE/WebSocket
│   ├── state.js                # Estado global
│   ├── events.js               # EventBus
│   └── utils.js                # Helpers comunes
│
├── modules/
│   ├── gpu/
│   │   ├── gpu.js              # Gestión GPUs
│   │   ├── gpuCard.js          # Tarjeta GPU
│   │   ├── gpuActions.js       # Pause/Resume/Assign
│   │   ├── gpuCharts.js        # Sparklines
│   │   └── gpu.css
│   │
│   ├── heatmap/
│   │   ├── heatmap.js          # Controlador
│   │   ├── renderer.js         # Render celdas
│   │   ├── zoom.js             # Zoom bloques
│   │   └── heatmap.css
│   │
│   ├── scheduler/
│   │   ├── scheduler.js        # CMA-ES
│   │   ├── eliteList.js        # Top fitness
│   │   ├── sigmaBar.js         # Sigma adaptativa
│   │   └── scheduler.css
│   │
│   ├── fitness/
│   │   ├── fitness.js          # Best match
│   │   ├── fitnessCard.js
│   │   └── fitness.css
│   │
│   ├── logs/
│   │   ├── logs.js             # Render logs
│   │   ├── filters.js          # ALL/WARN/ERROR
│   │   ├── exporter.js         # TXT/CSV/JSON
│   │   └── logs.css
│   │
│   └── auth/
│       ├── auth.js             # Token/Auth
│       ├── tokenModal.js
│       └── auth.css
│
├── assets/
│   ├── css/
│   │   ├── variables.css       # Colores
│   │   ├── base.css            # Reset/Layout
│   │   ├── cards.css           # Cards
│   │   ├── buttons.css         # Botones
│   │   ├── forms.css           # Inputs
│   │   ├── modal.css           # Modales
│   │   └── dashboard.css       # Layout global
│   │
│   ├── fonts/                  # Orbitron/ShareTech
│   ├── icons/                  # SVGs
│   └── sounds/                 # found.wav
│
├── templates/
│   ├── gpuCard.html
│   ├── logEntry.html
│   ├── eliteItem.html
│   └── modal.html
│
├── config/
│   ├── app.config.js           # API/intervalos
│   └── theme.config.js         # Temas
│
├── manifest.json               # PWA
├── sw.js                       # Service Worker
└── README.md                   # Documentación