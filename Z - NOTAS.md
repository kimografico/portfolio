# Otras tareas

Añadir este proyecto a "React"
Añadir proyectos mas nuevos

---

Hacer algo parecido a una memoria con todas las funcionalidades
Aprovechar esta memoria para hacer más tests e2e

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
