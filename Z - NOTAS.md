# Otras tareas

Añadir este proyecto a "React"
Añadir proyectos mas nuevos
Reescribir recent-works

---

Comprobar el orden de imports, exports, consts y types en todos los archivos (¿quizá crear un agente para esto?)
Arreglar los enlaces de recent-works

---

En React no hay controllers o algo parecido, que no haga falta mezclar templates y logica?

---

Hacer algo parecido a una memoria con todas las funcionalidades
Aprovechar esta memoria para hacer más tests e2e

---

en edit-resume hay muchos campos blancos en darkmode

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
