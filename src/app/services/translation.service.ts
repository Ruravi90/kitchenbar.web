import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('es');
  public currentLang$ = this.currentLangSubject.asObservable();

  private translations: Record<string, Record<string, string>> = {
    'es': {
      'LANDING.NAV.HOME': 'Inicio',
      'LANDING.NAV.FEATURES': 'Características',
      'LANDING.NAV.ROADMAP': 'Hoja de Ruta',
      'LANDING.NAV.LOGIN': 'Iniciar Sesión',
      'LANDING.NAV.REGISTER': 'Registrarse',
      'LANDING.HERO.TITLE': 'El Sistema Definitivo de Gestión de Restaurantes',
      'LANDING.HERO.SUBTITLE': 'Optimiza tus operaciones, deleita a tus clientes y haz crecer tu negocio con KitchenBar.',
      'LANDING.HERO.GET_STARTED': 'Empezar',
      'LANDING.HERO.DEMO': 'Demo en Vivo',
      'LANDING.FEATURES.TITLE': 'Características Potentes',
      'LANDING.FEATURES.SUBTITLE': 'Todo lo que necesitas para dirigir un restaurante exitoso.',
      'LANDING.FEATURE.ORDER.TITLE': 'Gestión de Pedidos',
      'LANDING.FEATURE.ORDER.DESC': 'Gestiona pedidos desde la mesa hasta la cocina sin problemas. Actualizaciones en tiempo real y seguimiento de estado.',
      'LANDING.FEATURE.STAFF.TITLE': 'Coordinación de Personal',
      'LANDING.FEATURE.STAFF.DESC': 'Mantén a tu equipo sincronizado. Asigna mesas, rastrea el rendimiento y gestiona turnos sin esfuerzo.',
      'LANDING.FEATURE.ANALYTICS.TITLE': 'Analíticas e Información',
      'LANDING.FEATURE.ANALYTICS.DESC': 'Toma decisiones basadas en datos con informes completos sobre ventas, inventario y tendencias de clientes.',
      'LANDING.FEATURE.MOBILE.TITLE': 'Listo para Móviles',
      'LANDING.FEATURE.MOBILE.DESC': 'Accede a tu restaurante desde cualquier lugar. Diseño totalmente receptivo para tabletas y teléfonos inteligentes.',
      'LANDING.FEATURE.QR.TITLE': 'Menús QR',
      'LANDING.FEATURE.QR.DESC': 'Pedidos sin contacto hechos fáciles. Genera códigos QR dinámicos para tus menús digitales.',
      'LANDING.FEATURE.SECURE.TITLE': 'Seguro y Confiable',
      'LANDING.FEATURE.SECURE.DESC': 'Seguridad de grado empresarial para proteger tus datos y garantizar un 99.9% de tiempo de actividad.',
      'LANDING.ROADMAP.TITLE': 'Hoja de Ruta Futura',
      'LANDING.ROADMAP.SUBTITLE': 'Estamos innovando constantemente. Aquí está lo que viene después.',
      'LANDING.ROADMAP.AI.TITLE': 'Recomendaciones impulsadas por IA',
      'LANDING.ROADMAP.AI.DESC': 'Sugerencias inteligentes para clientes basadas en su historial de pedidos y preferencias.',
      'LANDING.ROADMAP.AI.DATE': 'Próximamente Q1 2026',
      'LANDING.ROADMAP.INVENTORY.TITLE': 'Predicción de Inventario',
      'LANDING.ROADMAP.INVENTORY.DESC': 'Reduce el desperdicio con pronósticos de inventario impulsados por IA y pedidos automatizados.',
      'LANDING.ROADMAP.INVENTORY.DATE': 'Próximamente Q2 2026',
      'LANDING.ROADMAP.LOYALTY.TITLE': 'Integración de Programa de Lealtad',
      'LANDING.ROADMAP.LOYALTY.DESC': 'Sistema de recompensas integrado para que tus clientes regresen.',
      'LANDING.ROADMAP.LOYALTY.DATE': 'En Desarrollo',
      'LANDING.CTA.TITLE': '¿Listo para Transformar tu Restaurante?',
      'LANDING.CTA.SUBTITLE': 'Únete a miles de restaurantes exitosos que usan KitchenBar hoy.',
      'LANDING.CTA.BUTTON': 'Crear Cuenta Gratis',
      'LANDING.FOOTER.RIGHTS': '© 2025 KitchenBar. Todos los derechos reservados.'
    },
    'en': {
      'LANDING.NAV.HOME': 'Home',
      'LANDING.NAV.FEATURES': 'Features',
      'LANDING.NAV.ROADMAP': 'Roadmap',
      'LANDING.NAV.LOGIN': 'Login',
      'LANDING.NAV.REGISTER': 'Register',
      'LANDING.HERO.TITLE': 'The Ultimate Restaurant Management System',
      'LANDING.HERO.SUBTITLE': 'Streamline your operations, delight your customers, and grow your business with KitchenBar.',
      'LANDING.HERO.GET_STARTED': 'Get Started',
      'LANDING.HERO.DEMO': 'Live Demo',
      'LANDING.FEATURES.TITLE': 'Powerful Features',
      'LANDING.FEATURES.SUBTITLE': 'Everything you need to run a successful restaurant.',
      'LANDING.FEATURE.ORDER.TITLE': 'Order Management',
      'LANDING.FEATURE.ORDER.DESC': 'Seamlessly manage orders from table to kitchen. Real-time updates and status tracking.',
      'LANDING.FEATURE.STAFF.TITLE': 'Staff Coordination',
      'LANDING.FEATURE.STAFF.DESC': 'Keep your team in sync. Assign tables, track performance, and manage shifts effortlessly.',
      'LANDING.FEATURE.ANALYTICS.TITLE': 'Analytics & Insights',
      'LANDING.FEATURE.ANALYTICS.DESC': 'Make data-driven decisions with comprehensive reports on sales, inventory, and customer trends.',
      'LANDING.FEATURE.MOBILE.TITLE': 'Mobile Ready',
      'LANDING.FEATURE.MOBILE.DESC': 'Access your restaurant from anywhere. Fully responsive design for tablets and smartphones.',
      'LANDING.FEATURE.QR.TITLE': 'QR Menus',
      'LANDING.FEATURE.QR.DESC': 'Contactless ordering made easy. Generate dynamic QR codes for your digital menus.',
      'LANDING.FEATURE.SECURE.TITLE': 'Secure & Reliable',
      'LANDING.FEATURE.SECURE.DESC': 'Enterprise-grade security to protect your data and ensure 99.9% uptime.',
      'LANDING.ROADMAP.TITLE': 'Future Roadmap',
      'LANDING.ROADMAP.SUBTITLE': 'We are constantly innovating. Here is what is coming next.',
      'LANDING.ROADMAP.AI.TITLE': 'AI-Powered Recommendations',
      'LANDING.ROADMAP.AI.DESC': 'Smart suggestions for customers based on their order history and preferences.',
      'LANDING.ROADMAP.AI.DATE': 'Coming Q1 2026',
      'LANDING.ROADMAP.INVENTORY.TITLE': 'Inventory Prediction',
      'LANDING.ROADMAP.INVENTORY.DESC': 'Reduce waste with AI-driven inventory forecasting and automated ordering.',
      'LANDING.ROADMAP.INVENTORY.DATE': 'Coming Q2 2026',
      'LANDING.ROADMAP.LOYALTY.TITLE': 'Loyalty Program Integration',
      'LANDING.ROADMAP.LOYALTY.DESC': 'Built-in rewards system to keep your customers coming back.',
      'LANDING.ROADMAP.LOYALTY.DATE': 'In Development',
      'LANDING.CTA.TITLE': 'Ready to Transform Your Restaurant?',
      'LANDING.CTA.SUBTITLE': 'Join thousands of successful restaurants using KitchenBar today.',
      'LANDING.CTA.BUTTON': 'Create Free Account',
      'LANDING.FOOTER.RIGHTS': '© 2025 KitchenBar. All rights reserved.'
    }
  };

  constructor() { }

  setLanguage(lang: string) {
    if (this.translations[lang]) {
      this.currentLangSubject.next(lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }

  translate(key: string): string {
    const lang = this.currentLangSubject.value;
    return this.translations[lang][key] || key;
  }
}
