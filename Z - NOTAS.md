# Otras tareas

Añadir este proyecto a "React"
Añadir proyectos mas nuevos

---

Hacer algo parecido a una memoria con todas las funcionalidades
Aprovechar esta memoria para hacer más tests e2e

---

Crear un componente carrusel al que se le puedan pasar imagenes de proyectos y las pase en full width
Se le pasa si es full width o enmarcado, y también el alto de forma numerica.

---

```javascript
export const NativeMaximum = {
  args: {
    'is-logged': true,
    'is-client': true,
    'is-native': true,
    configuration: MOCK_CONFIGURATION_ALL_ACTIVE,
    'channel-info': MOCK_CHANNEL_INFO,
  },
};

/** Logged web client — change password instead of biometric, no app permissions */
export const WebMaximum = {
  args: {
    ...NativeMaximum.args,
    'is-native': false,
  },
};
```
