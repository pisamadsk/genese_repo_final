# Guide de Migration vers Flutter - GENÈSE

Ce document décrit comment migrer le prototype web React vers une application Flutter native pour iOS et Android.

## 📱 Architecture Flutter Recommandée

```
genese_flutter/
├── lib/
│   ├── main.dart
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── bilan_model.dart
│   │   └── session_model.dart
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── home_screen.dart
│   │   ├── bilan_screen.dart
│   │   ├── results_screen.dart
│   │   ├── program_screen.dart
│   │   └── settings_screen.dart
│   ├── widgets/
│   │   ├── custom_button.dart
│   │   ├── score_circle.dart
│   │   ├── bottom_nav.dart
│   │   └── connection_status.dart
│   ├── services/
│   │   ├── auth_service.dart
│   │   ├── offline_service.dart
│   │   ├── notification_service.dart
│   │   └── api_service.dart
│   └── utils/
│       ├── colors.dart
│       ├── constants.dart
│       └── theme.dart
├── pubspec.yaml
└── README.md
```

## 🎨 Palette de Couleurs Flutter

```dart
// lib/utils/colors.dart
class AppColors {
  static const Color background = Color(0xFF0F0F0F);
  static const Color card = Color(0xFF1A1A1A);
  static const Color primary = Color(0xFFFF9500);
  static const Color secondary = Color(0xFF2A2A2A);
  static const Color foreground = Color(0xFFE8E8E8);
  static const Color muted = Color(0xFF3A3A3A);
  static const Color border = Color(0xFF2A2A2A);
}
```

## 📦 Dépendances Flutter Essentielles

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Navigation
  go_router: ^13.0.0
  
  # State Management
  provider: ^6.0.0
  
  # Local Storage
  hive: ^2.2.0
  hive_flutter: ^1.1.0
  
  # Notifications
  firebase_messaging: ^14.0.0
  flutter_local_notifications: ^16.0.0
  
  # Offline Support
  connectivity_plus: ^5.0.0
  
  # HTTP Requests
  dio: ^5.0.0
  
  # UI Components
  flutter_svg: ^2.0.0
  
  # Animations
  flutter_animate: ^4.0.0
  
  # Video Player
  video_player: ^2.8.0
  
  # Camera (pour future IA posture)
  camera: ^0.10.0
```

## 🔄 Mappage des Pages React → Flutter

| React Page | Flutter Screen | Widgets Clés |
|-----------|----------------|-------------|
| Login.tsx | LoginScreen | TextField, ElevatedButton |
| Home.tsx | HomeScreen | CircularProgressIndicator, BottomNavigationBar |
| Bilan.tsx | BilanScreen | VideoPlayer, Slider, Card |
| Results.tsx | ResultsScreen | LineChart (syncfusion), ProgressBar |
| Program.tsx | ProgramScreen | ListView, Timer, VideoPlayer |
| Settings.tsx | SettingsScreen | ListTile, Switch, Dropdown |

## 📡 API Integration

### Endpoints à implémenter

```dart
// lib/services/api_service.dart
class ApiService {
  static const String baseUrl = 'https://api.genese.app';
  
  // Auth
  Future<void> login(String email, String password) {}
  Future<void> signup(UserModel user) {}
  
  // Bilan
  Future<void> submitBilan(BilanModel bilan) {}
  Future<BilanModel> getBilan(String userId) {}
  
  // Program
  Future<List<SessionModel>> getProgram(String userId) {}
  Future<void> completeSession(String sessionId) {}
  
  // Notifications
  Future<void> registerPushToken(String token) {}
}
```

## 🔔 Notifications Push

### Configuration Firebase

```dart
// lib/services/notification_service.dart
class NotificationService {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  
  static Future<void> initialize() async {
    // Demander la permission
    await _messaging.requestPermission();
    
    // Écouter les messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Afficher la notification
    });
  }
}
```

## 💾 Offline Support

### Hive Local Storage

```dart
// lib/services/offline_service.dart
class OfflineService {
  static final Box<BilanModel> bilanBox = Hive.box<BilanModel>('bilans');
  
  static Future<void> saveBilan(BilanModel bilan) async {
    await bilanBox.add(bilan);
  }
  
  static List<BilanModel> getAllBilans() {
    return bilanBox.values.toList();
  }
}
```

## 🎨 Thème Flutter

```dart
// lib/utils/theme.dart
ThemeData buildTheme() {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.background,
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.card,
      elevation: 0,
    ),
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: AppColors.card,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.muted,
    ),
  );
}
```

## 🚀 Étapes de Migration

1. **Phase 1 : Setup Flutter**
   - Créer le projet Flutter
   - Configurer les dépendances
   - Implémenter le thème et les couleurs

2. **Phase 2 : Authentification**
   - Migrer LoginScreen
   - Implémenter AuthService
   - Configurer JWT

3. **Phase 3 : Écrans Principaux**
   - Migrer HomeScreen
   - Migrer BilanScreen avec VideoPlayer
   - Migrer ResultsScreen avec graphiques

4. **Phase 4 : Fonctionnalités Avancées**
   - Implémenter Offline Support
   - Configurer Notifications Push
   - Ajouter Animations

5. **Phase 5 : Testing & Deployment**
   - Tests unitaires
   - Tests d'intégration
   - Build pour iOS et Android
   - Déploiement sur App Store et Play Store

## 📚 Ressources Utiles

- [Flutter Documentation](https://flutter.dev/docs)
- [Firebase for Flutter](https://firebase.flutter.dev/)
- [Hive Database](https://docs.hivedb.dev/)
- [Go Router](https://pub.dev/packages/go_router)
- [Provider State Management](https://pub.dev/packages/provider)

## 🔐 Considérations de Sécurité

- Utiliser Secure Storage pour les tokens JWT
- Implémenter Certificate Pinning
- Chiffrer les données locales sensibles
- Valider toutes les entrées utilisateur
- Implémenter la protection contre les attaques MITM

## 📊 Performance

- Lazy load les vidéos
- Utiliser le caching pour les images
- Optimiser les requêtes API
- Implémenter la pagination
- Utiliser les Web Workers pour les calculs lourds

---

**Note :** Ce guide est un point de départ. Adapter selon vos besoins spécifiques et les retours des utilisateurs.
