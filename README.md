
# Autentificacion

Sistema de autentificacion basado en roles con tokens JWT(Access y Refresh) con interceptor de peticiones, 
validacion y activacion de cuenta via email, 
cambio de contraseña por envio de link via email.


## Tech Stack

**Client:** React, Next Js, Sass, Axios, Formik & Yup, Toastify

**Server:** Python, Django, Rest Framework, JWT 


## Installation

**API REST**

Primero crear un ambiente virtual
```bash
  py -m venv venv
```
Luego activar el ambiente virtual
```bash
  source venv/Scripts/activate
```
Despues de activar el ambiente instalar los requerimientos
```bash
  pip install -r requirements.txt
```
Aplicar migracion
```bash
  python manage.py migrate
```
Si no ocurrio ningun problema ya puedes ejectuar el sistema
```bash
  py manage.py runserver
```
Punto de acceso del endpoint http://127.0.0.1:8000/auth/

**Aplicacion**

Primero instalar las dependencias
```bash
 npm install
```
Luego ejecute el servidor de desarrollo:
```bash
 npm run dev
```
Punto de acceso de la aplicacion http://localhost:3000/
## Usage/Examples

**API REST**

Modificar los las credenciales de acceso del correo de envio.

settings.py
```python
EMAIL_HOST_USER = 'email@gmail.com'
EMAIL_HOST_PASSWORD = 'password'
DEFAULT_FROM_EMAIL = 'email@gmail.com'
```


## API Reference

#### Registro

```http
  POST /auth/register/
```
| Parametros | Tipo     | Descripcion                |
| :-------- | :------- | :------------------------- |
| `email` | `email` | **Required**. Tu correo |
| `username` | `string` | **Required**. Tu nombre de usuario |
| `password` | `string` | **Required**. Tu contraseña |

#### Inicio de Sesion

```http
  GET /auth/login/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `email` | **Required**. Tu correo |
| `password`      | `string` | **Required**. Tu contraseña |

